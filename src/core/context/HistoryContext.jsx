import { createContext, useEffect, useMemo, useState } from "react";

const HistoryContext = createContext(null);

const HISTORY_STORAGE_KEY = "quiz-history";

const getStoredHistory = () => {
  if (typeof localStorage === "undefined") {
    return [];
  }

  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to read history from storage", error);
    return [];
  }
};

const HistoryProvider = ({ children }) => {
  const [quizHistory, setQuizHistory] = useState(() => getStoredHistory());

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(quizHistory));
    } catch (error) {
      console.error("Failed to persist history", error);
    }
  }, [quizHistory]);

  const addQuizAttempt = (attempt) => {
    setQuizHistory((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...attempt,
      },
    ]);
  };

  const clearHistory = () => {
    setQuizHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear history", error);
    }
  };

  const value = useMemo(
    () => ({
      quizHistory,
      addQuizAttempt,
      clearHistory,
    }),
    [quizHistory],
  );

  return <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>;
};

export { HistoryContext, HistoryProvider };
