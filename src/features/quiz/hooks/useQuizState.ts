import { useState, useEffect } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { useUserContext } from '@/context';
import type { QuizState } from '@/services/firebase/IFirebaseService';
import { checkQuizAnswerCorrectness } from '../utils/answerChecker';
import { parameterResolver } from '../utils/parameterResolver';

interface QuizSubmission {
  studentName: string;
  studentRegistration: string;
  answer: string;
  isCorrect: boolean;
}

export interface SubQuestionDefinition {
  idSuffix: string;
  questionText: string | ((reg: string) => string) | { formula: string; resolve: (reg: string) => string };
  quizType: 'numeric-input' | 'multiple-choice';
  options?: string[] | ((reg: string) => string[]) | { formula: string; resolve: (reg: string) => string[] };
}

export const useQuizState = (
  quizId: string,
  quizType: 'numeric-input' | 'multiple-choice',
  questions?: SubQuestionDefinition[],
  defaultDuration = 300,
  defaultBuffer = 20
) => {
  const firebaseService = useFirebase();
  const { userProfile, uid } = useUserContext();

  const isAdmin = userProfile?.role === 'admin';

  const normalizedQuestions: SubQuestionDefinition[] = questions || [
    {
      idSuffix: '',
      questionText: '',
      quizType,
    },
  ];

  const [resolvedCorrectAnswers, setResolvedCorrectAnswers] = useState<Record<string, string | ((reg: string) => string)>>({});
  const [quizState, setQuizStateState] = useState<QuizState | null>(null);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLagging, setIsLagging] = useState(false);
  const [lagTimeLeft, setLagTimeLeft] = useState(0);
  const [adminView, setAdminView] = useState<'chart' | 'details'>('chart');
  const [durationInput, setDurationInput] = useState(defaultDuration);
  const [bufferInput, setBufferInput] = useState(defaultBuffer);
  const [allSubmissionsMap, setAllSubmissionsMap] = useState<Record<string, QuizSubmission[]>>({});

  const subjectId = 'quantity-surveying';
  const sessionId = '2023-24';

  const getAnswerKey = (baseId: string, idSuffix: string) => {
    return idSuffix ? `${baseId}-${idSuffix}` : baseId;
  };

  // 1. Subscribe to active Quiz State
  useEffect(() => {
    return firebaseService.subscribeQuizState(quizId, (state) => {
      setQuizStateState(state);
    });
  }, [quizId, firebaseService]);

  // 2. Fetch student's existing answers if any
  useEffect(() => {
    if (uid && !isAdmin) {
      firebaseService.getSubjectSubmissions(subjectId, sessionId, uid).then((sub) => {
        if (sub) {
          const initialAnswers: Record<string, string> = {};
          let submittedCount = 0;
          normalizedQuestions.forEach((q) => {
            const qId = getAnswerKey(quizId, q.idSuffix);
            if (sub.answers[qId]) {
              initialAnswers[q.idSuffix] = sub.answers[qId].answer;
              submittedCount++;
            }
          });
          setStudentAnswers(initialAnswers);
          if (submittedCount === normalizedQuestions.length && normalizedQuestions.length > 0) {
            setHasSubmitted(true);
          }
        }
      });
    }
  }, [uid, quizId, isAdmin, firebaseService]);

  // 3. Subscribe to submissions for Admin view in real-time
  useEffect(() => {
    if (isAdmin && (quizState?.status === 'active' || quizState?.status === 'closed')) {
      let isCancelled = false;
      let unsubscribe: (() => void) | null = null;

      const setupSubscription = async () => {
        try {
          const answersMod = await import(`../../../subjects/${subjectId}/lectures/${sessionId}/answers.ts`);
          if (isCancelled) return;

          const correctMap: Record<string, string | ((reg: string) => string)> = {};
          normalizedQuestions.forEach((q) => {
            const fullId = getAnswerKey(quizId, q.idSuffix);
            correctMap[q.idSuffix] = answersMod.QUIZ_ANSWERS[fullId] || '';
          });
          setResolvedCorrectAnswers(correctMap);

          unsubscribe = firebaseService.subscribeAllSubmissions(subjectId, sessionId, (subs) => {
            if (isCancelled) return;

            const submissionsMap: Record<string, QuizSubmission[]> = {};
            normalizedQuestions.forEach((q) => {
              const qId = getAnswerKey(quizId, q.idSuffix);
              const realCorrectAnswer = correctMap[q.idSuffix] || '';

              submissionsMap[q.idSuffix] = subs
                .filter((s) => s.answers[qId] !== undefined)
                .map((s) => {
                  const ans = s.answers[qId]!;
                  const evaluatedTarget = parameterResolver.resolve(realCorrectAnswer, s.studentRegistration);
                  const isCorrect = ans.isOverridden
                    ? ans.isCorrect
                    : checkQuizAnswerCorrectness(ans.answer, evaluatedTarget, q.quizType);
                  return {
                    studentName: s.studentName,
                    studentRegistration: s.studentRegistration,
                    answer: ans.answer,
                    isCorrect,
                  };
                });
            });
            setAllSubmissionsMap(submissionsMap);
          });
        } catch (e) {
          console.error('Failed to setup real-time submissions listener:', e);
        }
      };

      setupSubscription();

      return () => {
        isCancelled = true;
        if (unsubscribe) unsubscribe();
      };
    } else {
      setAllSubmissionsMap({});
    }
  }, [isAdmin, quizState?.status, quizId, firebaseService]);

  // 4. Timer Logic
  useEffect(() => {
    if (quizState?.status === 'active' && quizState.activatedAt) {
      const activatedTime = typeof quizState.activatedAt === 'number'
        ? quizState.activatedAt
        : quizState.activatedAt instanceof Date
          ? quizState.activatedAt.getTime()
          : (quizState.activatedAt as { seconds: number }).seconds * 1000 || Date.now();

      const buffer = quizState.loadingBufferSeconds || 0;

      const runTimer = () => {
        const elapsed = Math.floor((Date.now() - activatedTime) / 1000);

        if (elapsed < buffer) {
          setIsLagging(true);
          setLagTimeLeft(buffer - elapsed);
          setTimeLeft(quizState.durationSeconds);
        } else {
          setIsLagging(false);
          setLagTimeLeft(0);

          const answeringElapsed = elapsed - buffer;
          const remaining = quizState.durationSeconds - answeringElapsed;

          if (remaining <= 0) {
            setTimeLeft(0);
            if (isAdmin) {
              firebaseService.setQuizState(quizId, { ...quizState, status: 'closed' });
            }
          } else {
            setTimeLeft(remaining);
          }
        }
      };

      runTimer();
      const timer = setInterval(runTimer, 1000);
      return () => clearInterval(timer);
    } else {
      setIsLagging(false);
      setLagTimeLeft(0);
      setTimeLeft(0);
    }
  }, [quizState, quizId, isAdmin, firebaseService]);

  const handleStudentSubmit = async () => {
    if (!uid || !userProfile || hasSubmitted) return;
    setIsSubmitting(true);

    const studentReg = userProfile.registration || '0000000000';
    const batchAnswers: Record<string, { answer: string; isCorrect: boolean }> = {};
    normalizedQuestions.forEach((q) => {
      const qId = getAnswerKey(quizId, q.idSuffix);
      const ans = studentAnswers[q.idSuffix] || '';
      const correctAnsRaw = resolvedCorrectAnswers[q.idSuffix] || '';
      const correctAns = parameterResolver.resolve(correctAnsRaw, studentReg);
      const isCorrect = checkQuizAnswerCorrectness(ans, correctAns, q.quizType);
      batchAnswers[qId] = {
        answer: ans,
        isCorrect,
      };
    });

    await firebaseService.submitQuizAnswersBatch(
      subjectId,
      sessionId,
      uid,
      { name: userProfile.name, reg: studentReg },
      batchAnswers
    );

    setHasSubmitted(true);
    setIsSubmitting(false);
  };

  const handleAdminActivate = async () => {
    const lagTime = Math.min(Math.max(0, bufferInput), 30);
    await firebaseService.setQuizState(quizId, {
      status: 'active',
      activatedAt: Date.now(),
      durationSeconds: durationInput,
      quizType,
      loadingBufferSeconds: lagTime,
      isRevealed: false,
      revealedQuestions: {},
    });
  };

  const handleAdminReactivate = async (extraSeconds: number) => {
    const nextDuration = (timeLeft > 0 ? timeLeft : 0) + extraSeconds;
    await firebaseService.setQuizState(quizId, {
      status: 'active',
      activatedAt: Date.now(),
      durationSeconds: nextDuration,
      quizType,
      loadingBufferSeconds: 0,
      isRevealed: false,
      revealedQuestions: quizState?.revealedQuestions || {},
    });
  };

  const handleAdminClose = async () => {
    if (quizState) {
      await firebaseService.setQuizState(quizId, { ...quizState, status: 'closed' });
    }
  };

  const handleAdminReset = async () => {
    await firebaseService.setQuizState(quizId, {
      status: 'hidden',
      activatedAt: 0,
      durationSeconds: durationInput,
      quizType,
      loadingBufferSeconds: 0,
      isRevealed: false,
      revealedQuestions: {},
    });
    setStudentAnswers({});
    setHasSubmitted(false);
  };

  const handleAdminReveal = async (idSuffix?: string) => {
    if (quizState) {
      const suffix = idSuffix || '';
      const nextRevealed = {
        ...(quizState.revealedQuestions || {}),
        [suffix]: true,
      };
      await firebaseService.setQuizState(quizId, {
        ...quizState,
        revealedQuestions: nextRevealed,
        isRevealed: Object.values(nextRevealed).some((v) => v),
      });
    }
  };

  const setStudentAnswer = (valOrSuffix: string, val?: string) => {
    if (val !== undefined) {
      setStudentAnswers((prev) => ({ ...prev, [valOrSuffix]: val }));
    } else {
      setStudentAnswers((prev) => ({ ...prev, '': valOrSuffix }));
    }
  };

  const isRevealedMap: Record<string, boolean> = {};
  normalizedQuestions.forEach((q) => {
    isRevealedMap[q.idSuffix] = quizState?.revealedQuestions?.[q.idSuffix] || false;
  });

  return {
    isAdmin,
    quizState,
    studentAnswer: studentAnswers[''] || '',
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
    allSubmissions: allSubmissionsMap[''] || [],
    allSubmissionsMap,
    handleStudentSubmit,
    handleAdminActivate,
    handleAdminReactivate,
    handleAdminClose,
    handleAdminReset,
    isRevealed: quizState?.isRevealed || false,
    isRevealedMap,
    handleAdminReveal,
    correctAnswer: resolvedCorrectAnswers[''] || '',
    correctAnswers: resolvedCorrectAnswers,
  };
};
