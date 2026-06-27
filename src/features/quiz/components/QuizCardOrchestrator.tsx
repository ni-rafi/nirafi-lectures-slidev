import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuizState, type SubQuestionDefinition } from '../hooks/useQuizState';
import { getQuizVisibilityMode } from '@/features/presentation/components/slides/SlideRenderer';
import { StudentQuizView } from './StudentQuizView';
import { AdminQuizView } from './AdminQuizView';
import { useUserContext } from '@/context';

export type QuizType = 'numeric-input' | 'multiple-choice';

interface QuizCardOrchestratorProps {
  quizId: string;
  questionText: React.ReactNode | ((reg: string) => React.ReactNode) | { formula: string; resolve: (reg: string) => React.ReactNode };
  quizType?: QuizType;
  options?: string[] | ((reg: string) => string[]) | { formula: string; resolve: (reg: string) => string[] }; // Required for multiple choice
  questions?: SubQuestionDefinition[];
  defaultDuration?: number;
  defaultBuffer?: number;
}

export const QuizCardOrchestrator: React.FC<QuizCardOrchestratorProps> = ({
  quizId,
  questionText,
  quizType = 'numeric-input',
  options = [],
  questions,
  defaultDuration = 300,
  defaultBuffer = 20,
}) => {
  const { userProfile } = useUserContext();

  const normalizedQuestions = questions || [
    {
      idSuffix: '',
      questionText: questionText as any, // Cast temporarily to conform to SubQuestionDefinition
      quizType,
      options,
    },
  ];

  const {
    isAdmin,
    quizState,
    studentAnswers,
    setStudentAnswer,
    hasSubmitted,
    isSubmitting,
    timeLeft,
    isLagging,
    lagTimeLeft,
    adminView,
    setAdminView,
    durationInput,
    setDurationInput,
    bufferInput,
    setBufferInput,
    allSubmissionsMap,
    handleStudentSubmit,
    handleAdminActivate,
    handleAdminReactivate,
    handleAdminClose,
    handleAdminReset,
    isRevealedMap,
    handleAdminReveal,
    correctAnswers,
  } = useQuizState(quizId, quizType, normalizedQuestions, defaultDuration, defaultBuffer);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderPrintPlaceholder = () => (
    <div className="quiz-print-placeholder hidden print:flex flex-col items-center justify-center border-2 border-dashed border-primary/60 bg-primary/5 rounded-xl p-8 my-auto w-full select-none text-center gap-4">
      <div className="flex items-center gap-2.5 text-primary">
        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <h2 className="text-base font-extrabold uppercase tracking-wider">Classroom Quiz Assessment Zone</h2>
      </div>
      
      <div className="max-w-xl border-t border-b border-border/60 py-6 my-2 w-full flex items-center justify-center">
        <span className="text-4xl md:text-5xl font-black tracking-widest text-primary/30 uppercase select-none font-mono">
          QUIZ
        </span>
      </div>

      <p className="text-xs text-muted-foreground italic max-w-md">
        This is an active real-time classroom assessment. Please submit your answer inside the web course portal to receive completion credit.
      </p>
    </div>
  );

  const [searchParams] = useSearchParams();
  const isPrintMode = searchParams.get('print') === 'true';
  const visibilityMode = getQuizVisibilityMode(quizId);
  const status = quizState?.status || 'hidden';

  const isStealthHidden = status === 'hidden' && visibilityMode === 'stealth';

  if (isStealthHidden && (isPrintMode || !isAdmin || userProfile?.isGuest)) {
    return null;
  }

  if (userProfile?.isGuest) {
    return (
      <>
        <div className="print:hidden w-full flex justify-center">
          <div className="w-full max-w-2xl mx-auto bg-card border border-border/80 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col gap-4 text-center select-none">
            <div className="flex justify-center mb-2">
              <span className="text-[10px] font-bold text-primary tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full">
                Classroom Quiz
              </span>
            </div>
            <div className="py-6 px-4 flex flex-col items-center gap-3">
              <h3 className="text-base font-bold text-foreground">Interactive Quiz</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                Interactive Quiz: Only available to signed-in students. Sign in with Google to participate.
              </p>
            </div>
          </div>
        </div>
        {renderPrintPlaceholder()}
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <div className="print:hidden w-full flex justify-center">
          <StudentQuizView
            status={status}
            visibilityMode={visibilityMode}
            isLagging={isLagging}
            lagTimeLeft={lagTimeLeft}
            timeLeft={timeLeft}
            quizType={quizType}
            studentAnswer={studentAnswers[''] || ''}
            studentAnswers={studentAnswers}
            setStudentAnswer={setStudentAnswer}
            handleStudentSubmit={handleStudentSubmit}
            isSubmitting={isSubmitting}
            hasSubmitted={hasSubmitted}
            correctAnswer={correctAnswers[''] || ''}
            correctAnswers={correctAnswers}
            formatTime={formatTime}
            questions={normalizedQuestions}
          />
        </div>
        {renderPrintPlaceholder()}
      </>
    );
  }

  return (
    <>
      <div className="print:hidden w-full flex justify-center">
        <AdminQuizView
          status={status}
          durationInput={durationInput}
          setDurationInput={setDurationInput}
          bufferInput={bufferInput}
          setBufferInput={setBufferInput}
          handleAdminActivate={handleAdminActivate}
          isLagging={isLagging}
          lagTimeLeft={lagTimeLeft}
          timeLeft={timeLeft}
          formatTime={formatTime}
          handleAdminClose={handleAdminClose}
          handleAdminReset={handleAdminReset}
          adminView={adminView}
          setAdminView={setAdminView}
          handleAdminReactivate={handleAdminReactivate}
          quizType={quizType}
          correctAnswer={correctAnswers[''] || ''}
          correctAnswers={correctAnswers}
          allSubmissions={allSubmissionsMap[''] || []}
          allSubmissionsMap={allSubmissionsMap}
          isRevealed={quizState?.isRevealed || false}
          isRevealedMap={isRevealedMap}
          handleAdminReveal={handleAdminReveal}
          questions={normalizedQuestions}
        />
      </div>
      {renderPrintPlaceholder()}
    </>
  );
};
