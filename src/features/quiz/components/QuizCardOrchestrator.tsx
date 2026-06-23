import React from 'react';
import { useQuizState } from '../hooks/useQuizState';
import { getQuizVisibilityMode } from '@/features/presentation/components/slides/SlideRenderer';
import { StudentQuizView } from './StudentQuizView';
import { AdminQuizView } from './AdminQuizView';
import { useUserContext } from '@/context';

export type QuizType = 'numeric-input' | 'multiple-choice';

interface QuizCardOrchestratorProps {
  quizId: string;
  questionText: string;
  quizType?: QuizType;
  options?: string[]; // Required for multiple choice
}

export const QuizCardOrchestrator: React.FC<QuizCardOrchestratorProps> = ({
  quizId,
  questionText,
  quizType = 'numeric-input',
  options = [],
}) => {
  const { userProfile } = useUserContext();

  const {
    isAdmin,
    quizState,
    studentAnswer,
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
    allSubmissions,
    handleStudentSubmit,
    handleAdminActivate,
    handleAdminReactivate,
    handleAdminClose,
    handleAdminReset,
    isRevealed,
    handleAdminReveal,
    correctAnswer,
  } = useQuizState(quizId, quizType);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (userProfile?.isGuest) {
    const status = quizState?.status || 'hidden';
    const visibilityMode = getQuizVisibilityMode(quizId);
    
    if (status === 'hidden' && visibilityMode === 'stealth') {
      return null;
    }

    return (
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
    );
  }

  const visibilityMode = getQuizVisibilityMode(quizId);
  const status = quizState?.status || 'hidden';

  if (!isAdmin) {
    return (
      <>
        <StudentQuizView
          status={status}
          visibilityMode={visibilityMode}
          isLagging={isLagging}
          lagTimeLeft={lagTimeLeft}
          timeLeft={timeLeft}
          quizType={quizType}
          questionText={questionText}
          options={options}
          studentAnswer={studentAnswer}
          setStudentAnswer={setStudentAnswer}
          handleStudentSubmit={handleStudentSubmit}
          isSubmitting={isSubmitting}
          hasSubmitted={hasSubmitted}
          correctAnswer={correctAnswer}
          formatTime={formatTime}
        />
        {/* PRINT-ONLY PLACEHOLDER */}
        <div className="quiz-print-placeholder hidden print:block border-2 border-dashed border-black/80 rounded-lg p-4 mt-4 text-xs select-none">
          <div className="font-bold text-center border-b border-black pb-1.5 mb-2">[ QUIZ ASSESSMENT ZONE ]</div>
          <p className="mb-1"><strong>Question:</strong> {questionText}</p>
          <p className="mb-1"><strong>Quiz ID:</strong> {quizId}</p>
          <p className="italic text-black/60">Submit your answer inside the web course portal to receive completion credit.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminQuizView
        status={status}
        questionText={questionText}
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
        correctAnswer={correctAnswer}
        options={options}
        allSubmissions={allSubmissions}
        isRevealed={isRevealed}
        handleAdminReveal={handleAdminReveal}
      />
      {/* PRINT-ONLY PLACEHOLDER */}
      <div className="quiz-print-placeholder hidden print:block border-2 border-dashed border-black/80 rounded-lg p-4 mt-4 text-xs select-none">
        <div className="font-bold text-center border-b border-black pb-1.5 mb-2">[ QUIZ ASSESSMENT ZONE ]</div>
        <p className="mb-1"><strong>Question:</strong> {questionText}</p>
        <p className="mb-1"><strong>Quiz ID:</strong> {quizId}</p>
        <p className="italic text-black/60">Submit your answer inside the web course portal to receive completion credit.</p>
      </div>
    </>
  );
};
