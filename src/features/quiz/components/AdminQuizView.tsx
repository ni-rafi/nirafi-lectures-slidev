import React from 'react';
import { Clock } from 'lucide-react';
import { NumericQuizAdmin } from './types/NumericQuiz';
import { MultipleChoiceQuizAdmin } from './types/MultipleChoiceQuiz';
import type { SubQuestionDefinition } from '../hooks/useQuizState';
import { parameterResolver } from '../utils/parameterResolver';

import { AdminQuestionPreview } from './admin/AdminQuestionPreview';
import { AdminQuizSetup } from './admin/AdminQuizSetup';
import { AdminControlsHeader } from './admin/AdminControlsHeader';
import { AdminRegNoInspector } from './admin/AdminRegNoInspector';

interface QuizSubmission {
  studentName: string;
  studentRegistration: string;
  answer: string;
  isCorrect: boolean;
}

interface AdminQuizViewProps {
  status: string;
  durationInput: number;
  setDurationInput: (val: number) => void;
  bufferInput: number;
  setBufferInput: (val: number) => void;
  handleAdminActivate: () => Promise<void>;
  isLagging: boolean;
  lagTimeLeft: number;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  handleAdminClose: () => Promise<void>;
  handleAdminReset: () => Promise<void>;
  adminView: 'chart' | 'details';
  setAdminView: (view: 'chart' | 'details') => void;
  handleAdminReactivate: (extraSeconds: number) => Promise<void>;
  quizType: 'numeric-input' | 'multiple-choice';
  correctAnswer: string | ((reg: string) => string) | { formula: string; resolve: (reg: string) => string };
  correctAnswers: Record<string, string | ((reg: string) => string) | { formula: string; resolve: (reg: string) => string }>;
  allSubmissions: QuizSubmission[];
  allSubmissionsMap: Record<string, QuizSubmission[]>;
  isRevealed: boolean;
  isRevealedMap: Record<string, boolean>;
  handleAdminReveal: (idSuffix?: string) => Promise<void>;
  questions: SubQuestionDefinition[];
}

export const AdminQuizView: React.FC<AdminQuizViewProps> = ({
  status,
  durationInput,
  setDurationInput,
  bufferInput,
  setBufferInput,
  handleAdminActivate,
  isLagging,
  lagTimeLeft,
  timeLeft,
  formatTime,
  handleAdminClose,
  handleAdminReset,
  adminView,
  setAdminView,
  handleAdminReactivate,
  correctAnswers,
  allSubmissionsMap,
  isRevealedMap,
  handleAdminReveal,
  questions,
}) => {
  const [isInspectRevealed, setIsInspectRevealed] = React.useState(false);
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const [inspectorRegNo, setInspectorRegNo] = React.useState('');

  React.useEffect(() => {
    setIsInspectRevealed(false);
  }, [status, isLagging]);

  React.useEffect(() => {
    if (status === 'hidden') {
      setActiveTabIndex(0);
      setInspectorRegNo('');
    }
  }, [status]);

  const isMultiQuestion = questions.length > 1;
  const currentQuestion = questions[activeTabIndex] || questions[0] || {
    idSuffix: '',
    questionText: '',
    quizType: 'numeric-input' as const,
    options: [] as string[],
  };

  const hasDynamicParams = React.useMemo(() => {
    return questions.some((q) => {
      if (parameterResolver.isDynamic(q.questionText)) return true;
      if (q.options && parameterResolver.isDynamic(q.options)) return true;
      const rawAns = correctAnswers[q.idSuffix];
      if (rawAns && parameterResolver.isDynamic(rawAns)) return true;
      return false;
    });
  }, [questions, correctAnswers]);

  const maxDigitsRequired = React.useMemo(() => {
    let max = 0;
    const checkValue = (val: unknown) => {
      if (val && typeof val === 'object') {
        const obj = val as Record<string, unknown>;
        if ('digitsRequired' in obj && typeof obj.digitsRequired === 'number') {
          max = Math.max(max, obj.digitsRequired);
        } else if ('formula' in obj && typeof obj.formula === 'string') {
          if (obj.formula.includes('[last 2 digits]')) {
            max = Math.max(max, 2);
          } else if (obj.formula.includes('[last digit]')) {
            max = Math.max(max, 1);
          }
        }
      }
    };

    questions.forEach((q) => {
      checkValue(q.questionText);
      if (Array.isArray(q.options)) {
        q.options.forEach(checkValue);
      } else {
        checkValue(q.options);
      }
      const rawAns = correctAnswers[q.idSuffix];
      checkValue(rawAns);
    });

    return max || 1;
  }, [questions, correctAnswers]);

  const activeRegNo = inspectorRegNo.trim() || undefined;
  const curQuestionText = parameterResolver.resolve(currentQuestion.questionText, activeRegNo);
  const curQuizType = currentQuestion.quizType;
  const curOptions = parameterResolver.resolve(currentQuestion.options || [], activeRegNo);
  const curSubmissions = allSubmissionsMap[currentQuestion.idSuffix] || [];
  const curIsRevealed = isRevealedMap[currentQuestion.idSuffix] || false;
  const curCorrectAnswerRaw = correctAnswers[currentQuestion.idSuffix] || '';
  const curCorrectAnswer = parameterResolver.resolve(curCorrectAnswerRaw, activeRegNo);

  const previewTitle = React.useMemo(() => {
    const base = isMultiQuestion ? `Admin Question ${activeTabIndex + 1} Preview` : `Admin Preview`;
    if (!hasDynamicParams) return `${base}:`;

    const isUnresolved =
      (typeof curQuestionText === 'string' && (curQuestionText.includes('[last digit]') || curQuestionText.includes('[last 2 digits]'))) ||
      (typeof curCorrectAnswer === 'string' && (curCorrectAnswer.includes('[last digit]') || curCorrectAnswer.includes('[last 2 digits]')));

    if (activeRegNo && !isUnresolved) {
      return `${base} (Evaluating Reg No: ${activeRegNo}):`;
    }
    return `${base} (Showing Raw Formulas):`;
  }, [isMultiQuestion, activeTabIndex, hasDynamicParams, activeRegNo, curQuestionText, curCorrectAnswer]);

  // Submission count for the first question acts as the global student count
  const globalSubmissionCount = allSubmissionsMap[questions[0]?.idSuffix || '']?.length || 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border border-border/80 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4 text-left">
      <div className="flex justify-between items-center select-none border-b border-border/40 pb-2">
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Classroom Quiz</span>
        {status === 'active' && (
          <span className={`flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded-full border ${
            isLagging
              ? 'text-amber-500 bg-amber-500/10 border-amber-500/25'
              : 'text-red-500 bg-red-500/10 border-red-500/25'
          }`}>
            <Clock className={`h-3.5 w-3.5 ${isLagging ? 'animate-spin' : 'animate-pulse'}`} />
            {isLagging ? `${lagTimeLeft}s (Buffer)` : formatTime(timeLeft)}
          </span>
        )}
      </div>

      {isMultiQuestion && (status === 'active' || status === 'closed') && (
        <div className="flex border-b border-border/40 select-none overflow-x-auto gap-1 mb-2">
          {questions.map((q, idx) => {
            const isActive = activeTabIndex === idx;
            const isQRevealed = isRevealedMap[q.idSuffix];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTabIndex(idx)}
                className={`px-4 py-2 text-xs font-bold transition-all border-b-2 hover:text-foreground cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground'
                }`}
              >
                Question {idx + 1} {isQRevealed && '✓'}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <AdminQuestionPreview
          previewTitle={previewTitle}
          status={status}
          isLagging={isLagging}
          curQuestionText={curQuestionText}
          isInspectRevealed={isInspectRevealed}
          setIsInspectRevealed={setIsInspectRevealed}
        />

        {status === 'hidden' && (
          <AdminQuizSetup
            durationInput={durationInput}
            setDurationInput={setDurationInput}
            bufferInput={bufferInput}
            setBufferInput={setBufferInput}
            handleAdminActivate={handleAdminActivate}
          />
        )}

        {status !== 'hidden' && (
          <div className="flex flex-col gap-3">
            {isLagging ? (
              <div className="p-6 border border-dashed border-border rounded-xl bg-muted/10 flex flex-col items-center gap-3 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin"></div>
                </div>
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Lag Buffer Active</h4>
                <p className="text-xs text-muted-foreground">
                  Students are loading the quiz form... {lagTimeLeft} seconds remaining.
                </p>
                <div className="flex gap-2 mt-2 w-full justify-center">
                  <button
                    type="button"
                    onClick={handleAdminClose}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Cancel / Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <AdminControlsHeader
                  status={status}
                  adminView={adminView}
                  setAdminView={setAdminView}
                  handleAdminReset={handleAdminReset}
                  handleAdminReactivate={handleAdminReactivate}
                  handleAdminClose={handleAdminClose}
                  curIsRevealed={curIsRevealed}
                  globalSubmissionCount={globalSubmissionCount}
                  handleAdminReveal={handleAdminReveal}
                  currentQuestionIdSuffix={currentQuestion.idSuffix}
                  durationInput={durationInput}
                  setDurationInput={setDurationInput}
                />

                {curQuizType === 'numeric-input' ? (
                  <NumericQuizAdmin
                    key={currentQuestion.idSuffix}
                    correctAnswer={curCorrectAnswer}
                    correctAnswerRaw={curCorrectAnswerRaw}
                    submissions={curSubmissions}
                    activeView={adminView}
                    isRevealed={curIsRevealed}
                  />
                ) : (
                  <MultipleChoiceQuizAdmin
                    key={currentQuestion.idSuffix}
                    correctAnswer={curCorrectAnswer}
                    correctAnswerRaw={curCorrectAnswerRaw}
                    options={Array.isArray(curOptions) ? curOptions : curOptions ? [curOptions] : []}
                    submissions={curSubmissions}
                    activeView={adminView}
                    isRevealed={curIsRevealed}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>

      {hasDynamicParams && (
        <AdminRegNoInspector
          inspectorRegNo={inspectorRegNo}
          setInspectorRegNo={setInspectorRegNo}
          maxDigitsRequired={maxDigitsRequired}
          activeRegNo={activeRegNo}
          curCorrectAnswer={curCorrectAnswer}
        />
      )}
    </div>
  );
};
