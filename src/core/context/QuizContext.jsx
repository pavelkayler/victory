/* eslint-disable react-hooks/set-state-in-effect */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";

import { UserContext } from "./UserContext.jsx";
import { HistoryContext } from "./HistoryContext.jsx";
import { TopicsContext } from "./TopicsContext.jsx";
import { MIN_PAIRS } from "../constants/quiz.js";
import { isQuestionValid } from "../utils/questions.js";

const QuizContext = createContext(null);

const shuffleArray = (source) => {
  const array = source.slice();
  for (let index = array.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const temp = array[index];
    array[index] = array[randomIndex];
    array[randomIndex] = temp;
  }
  return array;
};

// левый столбик — вопросы, правый — ответы
const createColumns = (pairs) => {
  const safePairs = Array.isArray(pairs) ? pairs : [];

  const left = safePairs.map((pair) => ({
    id: `left-${pair.id}`,
    pairId: pair.id,
    text: pair.left,
  }));

  const right = safePairs.map((pair) => ({
    id: `right-${pair.id}`,
    pairId: pair.id,
    text: pair.right,
  }));

  return {
    leftItems: shuffleArray(left),
    rightItems: shuffleArray(right),
  };
};

// выбираем подсказку так, чтобы пара не повторялась подряд
const pickRandomPrompt = (columns, prevPairId = null) => {
  const { leftItems, rightItems } = columns;
  const allItems = [...leftItems, ...rightItems];

  if (allItems.length === 0) {
    return null;
  }

  if (allItems.length === 1) {
    const item = allItems[0];
    const side = item.id.startsWith("left-") ? "left" : "right";

    return {
      side,
      itemId: item.id,
      pairId: item.pairId,
      text: item.text,
    };
  }

  let item;

  do {
    const randomIndex = Math.floor(Math.random() * (allItems.length));
    item = allItems[randomIndex];
  } while (allItems.length > 1 && item.pairId === prevPairId);

  const side = item.id.startsWith("left-") ? "left" : "right";

  return {
    side,
    itemId: item.id,
    pairId: item.pairId,
    text: item.text,
  };
};

const clampTimeLimitSeconds = (topic) => {
  const rawMinutes = Number(topic?.timeLimitMin ?? 5);
  const safeMinutes = Number.isFinite(rawMinutes) && rawMinutes > 0 ? rawMinutes : 5;
  const minutes = Math.min(60, Math.max(1, safeMinutes));
  return minutes * 60;
};

const QuizProvider = ({ children }) => {
  const { userName } = useContext(UserContext);
  const { addQuizAttempt } = useContext(HistoryContext);
  const { topics } = useContext(TopicsContext);

  const initialTopic = topics[0] ?? null;
  const initialTimeLimitSec = clampTimeLimitSeconds(initialTopic);

  const [questions, setQuestions] = useState(initialTopic?.questions ?? []);
  const [topic, setTopic] = useState(initialTopic);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(initialTimeLimitSec);
  const [shouldAutoInitTopic, setShouldAutoInitTopic] = useState(true);

  const [sessionId, setSessionId] = useState(0);
  const [completedSessionId, setCompletedSessionId] = useState(null);

  const [columns, setColumns] = useState(() =>
    createColumns(initialTopic?.questions ?? []),
  );
  const { leftItems, rightItems } = columns;

  const [currentPrompt, setCurrentPrompt] = useState(null);

  const [score, setScore] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);

  const [timeLeft, setTimeLeft] = useState(initialTimeLimitSec);
  const [isRunning, setIsRunning] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isRunRecorded, setIsRunRecorded] = useState(false);

  const [wasStarted, setWasStarted] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [isSelectionLocked, setIsSelectionLocked] = useState(false);

  const [feedback, setFeedback] = useState(null); // { side, itemId, result: 'correct' | 'wrong' }

  const [streak, setStreak] = useState(0); // количество подряд верных ответов
  const [bestStreak, setBestStreak] = useState(0);
  const [startError, setStartError] = useState(null);

  // подготовка квиза (после выбора темы)
  const initQuiz = useCallback((nextTopic = null) => {
    setShouldAutoInitTopic(true);

    const selectedTopic = nextTopic || topic || topics[0];

    if (!selectedTopic) {
      return;
    }

    const nextTimeLimit = clampTimeLimitSeconds(selectedTopic);

    setTopic(selectedTopic);
    const validQuestions = (selectedTopic.questions ?? []).filter(isQuestionValid);

    setQuestions(validQuestions);

    const newColumns = createColumns(validQuestions);

    setColumns(newColumns);
    setCurrentPrompt(null);

    setScore(0);
    setErrorsCount(0);
    setTimeLimitSeconds(nextTimeLimit);
    setTimeLeft(nextTimeLimit);

    setIsRunning(false);
    setIsQuizFinished(false);
    setIsRunRecorded(false);

    setWasStarted(false);
    setIsSelectionLocked(false);
    setFeedback(null);
    setStreak(0);
    setBestStreak(0);
    setSessionId((prev) => prev + 1);
    setCompletedSessionId(null);
    setCountdown(null);
    setStartError(null);
  }, [topic, topics]);

  const resetTopic = useCallback(() => {
    setTopic(null);
    setStartError(null);
  }, []);

  const resetQuizState = useCallback(() => {
    setShouldAutoInitTopic(false);
    setTopic(null);
    setQuestions([]);
    setColumns({ leftItems: [], rightItems: [] });
    setCurrentPrompt(null);
    setScore(0);
    setErrorsCount(0);
    setTimeLimitSeconds(0);
    setTimeLeft(0);
    setIsRunning(false);
    setIsRunRecorded(false);
    setWasStarted(false);
    setIsSelectionLocked(false);
    setFeedback(null);
    setStreak(0);
    setBestStreak(0);
    setSessionId((prev) => prev + 1);
    setCompletedSessionId(null);
    setCountdown(null);
    setStartError(null);
  }, []);

  useEffect(() => {
    if (!shouldAutoInitTopic || topic || topics.length === 0) {
      return;
    }

    initQuiz(topics[0]);
  }, [initQuiz, shouldAutoInitTopic, topic, topics]);

  useEffect(() => {
    if (!topic) {
      return;
    }

    const updatedTopic = topics.find((item) => item.id === topic.id);

    if (updatedTopic && updatedTopic !== topic) {
      const validQuestions = (updatedTopic.questions ?? []).filter(isQuestionValid);
      setTopic(updatedTopic);
      setQuestions(validQuestions);

      if (!wasStarted) {
        const nextTimeLimit = clampTimeLimitSeconds(updatedTopic);
        setTimeLimitSeconds(nextTimeLimit);
        setTimeLeft(nextTimeLimit);
        setColumns(createColumns(validQuestions));
      }
    }
  }, [topic, topics, wasStarted]);

  useEffect(() => {
    const activeTopic = topics.find((item) => item.id === topic?.id) ?? topic ?? topics[0];
    const validCount = (activeTopic?.questions ?? []).filter(isQuestionValid).length;

    if (validCount >= MIN_PAIRS) {
      setStartError(null);
    }
  }, [topic, topics]);

  // старт: первый рандом + включаем таймер
  const startQuiz = useCallback(() => {
    const validQuestions = questions.filter(isQuestionValid);

    if (validQuestions.length < MIN_PAIRS || leftItems.length === 0 || rightItems.length === 0) {
      setStartError(`Недостаточно вопросов для старта: нужно минимум ${MIN_PAIRS}.`);
      setIsRunning(false);
      setCountdown(null);
      setWasStarted(false);
      return;
    }

    setStartError(null);
    setIsRunning(true);

    setCurrentPrompt((prevPrompt) => {
      const prevPairId = prevPrompt ? prevPrompt.pairId : null;
      return pickRandomPrompt(columns, prevPairId);
    });
  }, [columns, leftItems.length, questions, rightItems.length]);

  const startCountdown = useCallback(() => {
    if (wasStarted || countdown !== null || isQuizFinished) {
      return;
    }

    const validQuestions = questions.filter(isQuestionValid);

    if (!topic || validQuestions.length < MIN_PAIRS) {
      setStartError(`Недостаточно вопросов для старта: минимум ${MIN_PAIRS}.`);
      return;
    }

    setStartError(null);
    setTimeLeft(timeLimitSeconds);
    setWasStarted(true);
    setCountdown(3);
  }, [countdown, isQuizFinished, questions, timeLimitSeconds, topic, wasStarted]);

  const resetCounters = useCallback(() => {
    setScore(0);
    setErrorsCount(0);
    setStreak(0);
  }, []);

  const finishQuiz = useCallback(() => {
    if (!wasStarted || isQuizFinished) {
      return;
    }
    setIsQuizFinished(true);
    setIsRunning(false);
    setCompletedSessionId(sessionId);
  }, [isQuizFinished, sessionId, wasStarted]);

  const handleItemClick = useCallback((side, itemId) => {
    if (!currentPrompt || !isRunning || isQuizFinished || isSelectionLocked) {
      return;
    }

    const { side: promptSide, pairId: promptPairId } = currentPrompt;

    // нельзя кликать в тот же столбец
    if (side === promptSide) {
      return;
    }

    const items = side === "left" ? leftItems : rightItems;
    const clickedItem = items.find((item) => item.id === itemId);

    if (!clickedItem) {
      return;
    }

    const isCorrect = clickedItem.pairId === promptPairId;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const nextValue = prev + 1;
        setBestStreak((prevBest) => Math.max(prevBest, nextValue));
        return nextValue;
      });
    } else {
      setErrorsCount((prev) => prev + 1);
      setStreak(0);
    }

    setFeedback({
      side,
      itemId,
      result: isCorrect ? "correct" : "wrong",
    });

    setIsSelectionLocked(true);

    setTimeout(() => {
      setCurrentPrompt((prevPrompt) => {
        const prevPairId = prevPrompt ? prevPrompt.pairId : null;
        return pickRandomPrompt(columns, prevPairId);
      });
      setFeedback(null);
      setIsSelectionLocked(false);
    }, 250);
  }, [columns, currentPrompt, isQuizFinished, isRunning, isSelectionLocked, leftItems, rightItems]);

  useEffect(() => {
    if (countdown === null) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setCountdown((prev) => {
        if (prev === null) {
          return null;
        }

        const nextValue = prev - 1;

        if (nextValue <= 0) {
          startQuiz();
          return null;
        }

        return nextValue;
      });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [countdown, startQuiz]);

  // таймер
  useEffect(() => {
    if (!isRunning || isQuizFinished) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, isQuizFinished]);

  // авто-завершение по таймеру
  useEffect(() => {
    if (timeLeft === 0 && isRunning && !isQuizFinished) {
      setIsQuizFinished(true);
      setIsRunning(false);
      setCompletedSessionId(sessionId);
    }
  }, [isQuizFinished, isRunning, sessionId, timeLeft]);

  // запись попытки в историю (когда квиз завершён, только один раз)
  useEffect(() => {
    if (!isQuizFinished || isRunRecorded || !wasStarted) {
      return;
    }

    setIsRunRecorded(true);

    const durationSec = Math.max(0, timeLimitSeconds - timeLeft);

    addQuizAttempt({
      date: new Date().toISOString(),
      userName,
      correct: score,
      wrong: errorsCount,
      durationSec,
      streak: bestStreak,
      topicId: topic?.id ?? null,
      topicTitle: topic?.title ?? "",
    });
  }, [
    isQuizFinished,
    isRunRecorded,
    wasStarted,
    addQuizAttempt,
    userName,
    score,
    errorsCount,
    timeLimitSeconds,
    timeLeft,
    bestStreak,
    topic,
  ]);

  const value = useMemo(
    () => ({
      questions,
      topic,
      leftItems,
      rightItems,
      sessionId,
      completedSessionId,
      currentPrompt,
      score,
      errorsCount,
      timeLeft,
      isRunning,
      isQuizFinished,
      wasStarted,
      countdown,
      feedback,
      streak,
      bestStreak,
      initQuiz,
      startQuiz,
      startCountdown,
      resetCounters,
      resetTopic,
      resetQuizState,
      finishQuiz,
      handleItemClick,
      startError,
    }),
    [
      questions,
      topic,
      leftItems,
      rightItems,
      sessionId,
      completedSessionId,
      currentPrompt,
      score,
      errorsCount,
      timeLeft,
      isRunning,
      isQuizFinished,
      wasStarted,
      countdown,
      feedback,
      streak,
      bestStreak,
      initQuiz,
      startQuiz,
      startCountdown,
      resetCounters,
      resetTopic,
      resetQuizState,
      finishQuiz,
      handleItemClick,
      startError,
    ],
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export { QuizContext, QuizProvider };
