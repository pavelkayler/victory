import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { topics as defaultTopics } from "../data/questions.js";

const TOPICS_STORAGE_KEY = "quiz-topics";

const readStoredTopics = () => {
  if (typeof localStorage === "undefined") {
    return defaultTopics;
  }

  try {
    const raw = localStorage.getItem(TOPICS_STORAGE_KEY);
    if (!raw) {
      return defaultTopics;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultTopics;
  } catch (error) {
    console.error("Failed to read topics from storage", error);
    return defaultTopics;
  }
};

const TopicsContext = createContext(null);

const TopicsProvider = ({ children }) => {
  const [topics, setTopics] = useState(() => readStoredTopics());

  useEffect(() => {
    if (typeof localStorage === "undefined") {
      return;
    }

    try {
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(topics));
    } catch (error) {
      console.error("Failed to persist topics", error);
    }
  }, [topics]);

  const getTopicById = useCallback((topicId) => {
    return topics.find((topic) => topic.id === topicId) ?? null;
  }, [topics]);

  const addTopic = useCallback((title, description) => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `topic-${Date.now()}`;

    const newTopic = {
      id,
      title: trimmedTitle || "Новая тема",
      description: trimmedDescription || "Добавьте описание темы и вопросы",
      questions: [],
    };

    setTopics((prev) => [...prev, newTopic]);

    return newTopic;
  }, []);

  const addQuestion = useCallback((topicId, { left = "", right = "" }) => {
    let createdQuestion = null;

    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) {
          return topic;
        }

        const nextId =
          topic.questions.reduce((max, question) => Math.max(max, question.id), 0) + 1;

        createdQuestion = {
          id: nextId,
          left,
          right,
        };

        return {
          ...topic,
          questions: [...topic.questions, createdQuestion],
        };
      }),
    );

    return createdQuestion;
  }, []);

  const updateQuestion = useCallback((topicId, questionId, updates) => {
    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) {
          return topic;
        }

        return {
          ...topic,
          questions: topic.questions.map((question) =>
            question.id === questionId ? { ...question, ...updates } : question,
          ),
        };
      }),
    );
  }, []);

  const value = useMemo(
    () => ({
      topics,
      getTopicById,
      addTopic,
      addQuestion,
      updateQuestion,
    }),
    [topics, getTopicById, addTopic, addQuestion, updateQuestion],
  );

  return <TopicsContext.Provider value={value}>{children}</TopicsContext.Provider>;
};

export { TopicsContext, TopicsProvider };
