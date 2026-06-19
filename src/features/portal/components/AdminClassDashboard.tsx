import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebase } from '@/context/FirebaseContext';
import { ArrowLeft, GraduationCap, Award, FileSpreadsheet, Search, Filter } from 'lucide-react';
import type { SubjectSubmissions } from '@/services/firebase/IFirebaseService';

export const AdminClassDashboard: React.FC = () => {
  const { subjectId, sessionId } = useParams<{ subjectId: string; sessionId: string }>();
  const navigate = useNavigate();
  const firebaseService = useFirebase();

  const [submissions, setSubmissions] = useState<SubjectSubmissions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quizMetadata, setQuizMetadata] = useState<{ id: string; header: string }[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState('all');

  useEffect(() => {
    if (!subjectId || !sessionId) return;
    let isCancelled = false;
    let unsubscribe: (() => void) | null = null;
    setIsLoading(true);

    const setupDashboard = async () => {
      try {
        const answersMod = await import(`../../../lectures/${subjectId}/${sessionId}/answers.ts`);
        if (isCancelled) return;
        setQuizMetadata(answersMod.QUIZ_METADATA || []);
        setQuizAnswers(answersMod.QUIZ_ANSWERS || {});

        unsubscribe = firebaseService.subscribeAllSubmissions(subjectId, sessionId, (data) => {
          if (isCancelled) return;
          setSubmissions(data);
          setIsLoading(false);
        });
      } catch (e) {
        console.error('Failed to load dashboard:', e);
        setIsLoading(false);
      }
    };

    setupDashboard();
    return () => {
      isCancelled = true;
      if (unsubscribe) unsubscribe();
    };
  }, [subjectId, sessionId, firebaseService]);

  const getStudentTotalScore = (sub: SubjectSubmissions) => {
    return quizMetadata.reduce((sum, meta) => {
      const ans = sub.answers[meta.id];
      if (!ans) return sum;
      const isCorrect = ans.isOverridden
        ? ans.isCorrect
        : ans.answer.trim().toLowerCase() === (quizAnswers[meta.id] || '').trim().toLowerCase();
      const score = ans.isOverridden ? (ans.score ?? (isCorrect ? 1 : 0)) : (isCorrect ? 1 : 0);
      return sum + score;
    }, 0);
  };

  const handleExport = () => {
    const headers = ['Roll Number', 'Student Name', ...quizMetadata.map((m) => m.header), 'Total Score'];
    const rows = submissions.map((sub) => {
      const quizCols = quizMetadata.map((meta) => {
        const ans = sub.answers[meta.id];
        if (ans) {
          const isCorrect = ans.isOverridden
            ? ans.isCorrect
            : ans.answer.trim().toLowerCase() === (quizAnswers[meta.id] || '').trim().toLowerCase();
          const score = ans.isOverridden ? (ans.score ?? (isCorrect ? 1 : 0)) : (isCorrect ? 1 : 0);
          return `${ans.answer} (${isCorrect ? 'Correct' : 'Incorrect'}, Score: ${score})`;
        }
        return 'N/A';
      });
      return [sub.studentRegistration, sub.studentName, ...quizCols, getStudentTotalScore(sub).toString()];
    });

    const csvContent = [headers, ...rows].map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `scoreboard_${subjectId}_${sessionId}.csv`);
    link.click();
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const q = searchQuery.toLowerCase().trim();
    return !q || sub.studentName.toLowerCase().includes(q) || sub.studentRegistration.toLowerCase().includes(q);
  });

  const visibleQuizzes = quizMetadata.filter((m) => selectedQuizId === 'all' || m.id === selectedQuizId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 border rounded-lg hover:bg-muted cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Admin Scoreboard</h1>
            <p className="text-xs text-muted-foreground uppercase font-mono">{subjectId} • {sessionId}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport} disabled={submissions.length === 0} className="px-3.5 py-2 bg-primary text-white font-semibold rounded-lg text-xs hover:bg-primary/95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-xs">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border bg-card p-4 rounded-xl flex items-center gap-4 shadow-xs">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><GraduationCap className="h-5 w-5" /></div>
          <div><div className="text-2xl font-bold">{submissions.length}</div><div className="text-xs text-muted-foreground">Students Active</div></div>
        </div>
        <div className="border bg-card p-4 rounded-xl flex items-center gap-4 shadow-xs">
          <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-600"><Award className="h-5 w-5" /></div>
          <div>
            <div className="text-2xl font-bold font-mono">
              {submissions.length > 0 ? (submissions.reduce((acc, s) => acc + getStudentTotalScore(s), 0) / submissions.length).toFixed(1) : '0.0'}
            </div>
            <div className="text-xs text-muted-foreground">Average Score</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center bg-card border p-3.5 rounded-xl shadow-xs">
        <div className="relative w-full sm:max-w-xs flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input type="text" placeholder="Search roll number or name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-8 pr-3 py-1.5 border rounded-lg text-xs bg-background" />
        </div>
        <div className="relative w-full sm:max-w-xs flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <select value={selectedQuizId} onChange={(e) => setSelectedQuizId(e.target.value)} className="w-full border rounded-lg text-xs bg-background p-1.5">
            <option value="all">All Quizzes</option>
            {quizMetadata.map((q) => (<option key={q.id} value={q.id}>{q.header}</option>))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border bg-card rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/40 border-b border-border/80 font-bold text-muted-foreground select-none text-left">
                <th className="p-3 pl-5">Registration</th>
                <th className="p-3">Student Name</th>
                {visibleQuizzes.map((q, i) => (<th key={i} className="p-3 text-center">{q.header}</th>))}
                <th className="p-3 text-right pr-5">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((sub) => (
                <tr key={sub.studentUid} className="border-b border-border/40 hover:bg-muted/5 transition-colors">
                  <td className="p-3 pl-5 font-mono text-xs font-semibold text-foreground/80">{sub.studentRegistration}</td>
                  <td className="p-3 font-medium">{sub.studentName}</td>
                  {visibleQuizzes.map((meta) => {
                    const qId = meta.id;
                    const ans = sub.answers[qId];
                    if (!ans) return <td key={qId} className="p-3 text-center text-muted-foreground/30">—</td>;
                    const realAnswer = quizAnswers[qId] || '';
                    const isCorrect = ans.isOverridden ? ans.isCorrect : ans.answer.trim().toLowerCase() === realAnswer.trim().toLowerCase();
                    const score = ans.isOverridden ? (ans.score ?? (isCorrect ? 1 : 0)) : (isCorrect ? 1 : 0);

                    return (
                      <td key={qId} className="p-3 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded max-w-[120px] truncate" title={ans.answer}>{ans.answer}</span>
                          <button
                            onClick={() => firebaseService.overrideQuizAnswer(subjectId!, sessionId!, sub.studentUid, qId, !isCorrect, !isCorrect ? 1 : 0, true)}
                            className={`px-2 py-0.5 text-[9px] font-bold border rounded-md cursor-pointer hover:scale-105 transition-transform ${
                              isCorrect ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 border-red-500/25 text-red-600'
                            }`}
                          >
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </button>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              value={score}
                              onChange={(e) => firebaseService.overrideQuizAnswer(subjectId!, sessionId!, sub.studentUid, qId, isCorrect, parseFloat(e.target.value) || 0, true)}
                              className="w-10 text-center text-[10px] border rounded bg-background p-0.5 font-mono"
                            />
                            {ans.isOverridden && (
                              <button onClick={() => firebaseService.overrideQuizAnswer(subjectId!, sessionId!, sub.studentUid, qId, false, 0, false)} className="text-[9px] text-muted-foreground hover:text-red-500 underline cursor-pointer">Reset</button>
                            )}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                  <td className="p-3 text-right pr-5 font-bold font-mono">{getStudentTotalScore(sub)}</td>
                </tr>
              ))}
              {filteredSubmissions.length === 0 && !isLoading && (
                <tr><td colSpan={3 + visibleQuizzes.length} className="p-8 text-center text-muted-foreground">No submissions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminClassDashboard;
