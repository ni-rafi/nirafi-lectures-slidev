import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Play, RotateCcw, Check } from 'lucide-react';
import { PlaygroundSection } from './PlaygroundSection';

export const QuizzesSection: React.FC = () => {
  const [quizId, setQuizId] = useState('brick_lec2_q1');
  const [questionText, setQuestionText] = useState('What is the standard volume of a structural brick in cubic millimeters?');
  const [correctAnswer, setCorrectAnswer] = useState('1900000');
  const [quizType, setQuizType] = useState<'numeric-input' | 'multiple-choice'>('numeric-input');
  const optionsStr = '1200000, 1500000, 1900000, 2200000';
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [status, setStatus] = useState<'placeholder' | 'active' | 'closed'>('active');
  const [studentAnswer, setStudentAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const options = optionsStr.split(',').map((o) => o.trim()).filter(Boolean);

  const renderMockPreview = () => {
    if (role === 'student') {
      if (status === 'placeholder') {
        return (
          <div className="text-center py-8 text-xs font-semibold text-muted-foreground border border-dashed rounded-xl p-4 bg-muted/5 select-none">
            [ QUIZ ACTIVE IN LIVE SESSION - Waiting to Open... ]
          </div>
        );
      }

      return (
        <div className="w-full bg-card border border-border/70 rounded-2xl p-5 shadow-md flex flex-col gap-4 text-left">
          <div className="flex justify-between items-center select-none text-[10px] font-bold text-primary tracking-widest uppercase">
            <span>Classroom Quiz (Student)</span>
            {status === 'active' && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                <Clock className="h-3 w-3 animate-pulse" /> 4:58
              </span>
            )}
          </div>
          <div className="text-xs font-bold text-foreground">{questionText}</div>

          {quizType === 'numeric-input' ? (
            <div className="flex flex-col gap-3">
              <Input
                type="text"
                placeholder="Enter numeric calculation..."
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                disabled={hasSubmitted || status === 'closed'}
                className="text-xs h-9"
              />
              <Button
                size="sm"
                onClick={() => setHasSubmitted(true)}
                disabled={hasSubmitted || !studentAnswer || status === 'closed'}
                className="h-8 font-bold text-xs cursor-pointer"
              >
                {hasSubmitted ? 'Submitted' : 'Submit Answer'}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => !hasSubmitted && status === 'active' && setStudentAnswer(opt)}
                  disabled={hasSubmitted || status === 'closed'}
                  className={`w-full p-2.5 rounded-xl border text-xs text-left transition-all font-medium cursor-pointer ${
                    studentAnswer === opt
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-muted/10 border-border hover:bg-muted/20 text-muted-foreground'
                  }`}
                >
                  {opt}
                </button>
              ))}
              <Button
                size="sm"
                onClick={() => setHasSubmitted(true)}
                disabled={hasSubmitted || !studentAnswer || status === 'closed'}
                className="h-8 font-bold text-xs mt-2 cursor-pointer"
              >
                {hasSubmitted ? 'Submitted' : 'Submit Answer'}
              </Button>
            </div>
          )}

          {hasSubmitted && (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 mt-1">
              <Check className="h-4 w-4 shrink-0" />
              <span>
                Answer "{studentAnswer}" submitted successfully.{' '}
                {status === 'closed' && (
                  <span className="font-bold">
                    ({studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase() ? 'Correct' : 'Incorrect'})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="w-full bg-card border border-border/80 rounded-2xl p-5 shadow-md flex flex-col gap-4 text-left">
          <div className="text-[10px] font-bold text-primary tracking-widest uppercase select-none">
            Classroom Quiz (Presenter Admin)
          </div>
          <div className="text-xs border bg-muted/20 p-3 rounded-xl">
            <span className="font-bold text-muted-foreground block mb-0.5 select-none">Question Preview:</span>
            {questionText}
          </div>

          <div className="flex justify-between items-center border-t pt-3 border-border/40 select-none">
            <div className="flex gap-1.5">
              <Button
                size="xs"
                variant={status === 'active' ? 'default' : 'outline'}
                onClick={() => setStatus('active')}
                className="h-6 font-mono text-[9px] cursor-pointer"
              >
                <Play className="h-3 w-3 mr-1" /> Activate
              </Button>
              <Button
                size="xs"
                variant={status === 'closed' ? 'default' : 'outline'}
                onClick={() => setStatus('closed')}
                className="h-6 font-mono text-[9px] cursor-pointer"
              >
                Close
              </Button>
              <Button
                size="xs"
                variant={status === 'placeholder' ? 'default' : 'outline'}
                onClick={() => setStatus('placeholder')}
                className="h-6 font-mono text-[9px] cursor-pointer"
              >
                <RotateCcw className="h-3 w-3 mr-1" /> Reset
              </Button>
            </div>
          </div>

          <div className="text-[10px] text-muted-foreground font-mono">
            Correct Answer: <span className="text-emerald-500 font-bold">{correctAnswer}</span>
          </div>
        </div>
      );
    }
  };

  const codeText = `const slideSchema: SlideSchema = {
  id: 1,
  section: 'Evaluation',
  layout: 'fullwidth',
  props: {
    title: "Classroom Quiz",
    element: {
      type: 'quiz',
      config: {
        quizId: "${quizId}",
        quizType: "${quizType}"
      },
      data: {
        question: "${questionText}",
        correctAnswer: "${correctAnswer}"
      }
    }
  }
};`;

  const editorContent = (
    <div className="text-slate-300 font-mono text-[11px] leading-relaxed select-text space-y-2">
      <div>
        <span className="text-teal-400">quiz.config</span> = <span className="text-pink-400">&#123;</span>
      </div>
      <div className="pl-4">
        <span className="text-teal-400">quizId</span>: "
        <input
          type="text"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none focus:border-primary/50 w-28 font-mono text-[11px] inline-block font-bold"
        />
        ",
      </div>
      <div className="pl-4">
        <span className="text-teal-400">quizType</span>: "
        <select
          value={quizType}
          onChange={(e) => setQuizType(e.target.value as any)}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-teal-400 focus:outline-none focus:border-primary/50 font-mono text-[11px] inline-block cursor-pointer font-bold"
        >
          <option value="numeric-input">numeric-input</option>
          <option value="multiple-choice">multiple-choice</option>
        </select>
        "
      </div>
      <div>
        <span className="text-pink-400">&#125;</span>
      </div>
      <div>
        <span className="text-teal-400">quiz.data</span> = <span className="text-pink-400">&#123;</span>
      </div>
      <div className="pl-4">
        <span className="text-teal-400">question</span>: "
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none focus:border-primary/50 w-44 font-mono text-[11px] inline-block"
        />
        ",
      </div>
      <div className="pl-4">
        <span className="text-teal-400">correctAnswer</span>: "
        <input
          type="text"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          className="bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-amber-300 focus:outline-none focus:border-primary/50 w-20 font-mono text-[11px] inline-block"
        />
        "
      </div>
      <div>
        <span className="text-pink-400">&#125;</span>
      </div>
    </div>
  );

  return (
    <PlaygroundSection
      title="Classroom Interactive Quizzes"
      description={
        <span>
          Embed real-time student assessments into your slide decks using <code>&lt;QuizCardOrchestrator&gt;</code>. These sync with Firestore to accept student responses during active timers and draw submission summary charts for presenters.
        </span>
      }
      preview={
        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center bg-muted/30 border border-border/50 rounded-xl p-2 select-none">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Simulator Controls</span>
            <div className="flex gap-1">
              <Button
                size="xs"
                variant={role === 'student' ? 'default' : 'outline'}
                onClick={() => { setRole('student'); setHasSubmitted(false); setStudentAnswer(''); }}
                className="h-6 text-[9px] cursor-pointer"
              >
                Student View
              </Button>
              <Button
                size="xs"
                variant={role === 'admin' ? 'default' : 'outline'}
                onClick={() => setRole('admin')}
                className="h-6 text-[9px] cursor-pointer"
              >
                Presenter Admin View
              </Button>
            </div>
          </div>
          {renderMockPreview()}
        </div>
      }
      codeText={codeText}
      editorContent={editorContent}
    />
  );
};

export default QuizzesSection;
