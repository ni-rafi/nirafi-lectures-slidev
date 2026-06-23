import { useState, useEffect } from 'react';
import { useFirebase } from '@/context/FirebaseContext';
import { getLectureDeck } from '../components/slides/SlideRenderer';
import type { QuizState } from '@/services/firebase/IFirebaseService';
import type { Subject, Lecture } from '@/config/lectures';

export const useQuizSubscriptions = (
  activeSub: Subject | undefined,
  activeLec: Lecture | undefined,
  isLoadingDeck: boolean
) => {
  const firebaseService = useFirebase();
  const [quizStates, setQuizStates] = useState<Record<string, QuizState>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoadingDeck || !activeLec || !activeSub) return;
    const deck = getLectureDeck(activeLec.id);
    const quizIds = (Object.values(deck.slideMetadata) as Array<{ quizId?: string }>)
      .map((m) => m.quizId)
      .filter((id): id is string => !!id);

    if (quizIds.length === 0) {
      setQuizStates({});
      setReady(true);
      return;
    }

    let resolvedCount = 0;
    const unsubscribes = quizIds.map((id) =>
      firebaseService.subscribeQuizState(id, (state) => {
        if (state) {
          setQuizStates((prev) => ({ ...prev, [id]: state }));
        }
        // Count each quiz ID as resolved (whether state exists or not)
        resolvedCount += 1;
        if (resolvedCount >= quizIds.length) {
          setReady(true);
        }
      })
    );

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [activeLec, activeSub, firebaseService, isLoadingDeck]);

  return { quizStates, ready };
};

