import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { topics as defaultTopics } from "../data/questions.js";

const TOPICS_STORAGE_KEY = "quiz-topics";

const clampTimeLimit = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }

  return Math.min(60, Math.max(1, parsed));
};

const normalizeQuestion = (question) => {
  if (!question || typeof question !== "object") {
    return null;
  }

  const id = Number(question.id);

  if (!Number.isFinite(id)) {
    return null;
  }

  return {
    id,
    left: typeof question.left === "string" ? question.left : "",
    right: typeof question.right === "string" ? question.right : "",
  };
};

const normalizeTopic = (topic) => {
  if (!topic || typeof topic !== "object") {
    return null;
  }

  const topicId = typeof topic.id === "string" ? topic.id : topic.id?.toString();
  if (!topicId) {
    return null;
  }

  const timeLimitValue = clampTimeLimit(
    topic.timeLimitMin ?? topic.timeLimit ?? topic.timeLimitMinutes ?? 5,
  ) ?? 5;

  const questions = Array.isArray(topic.questions)
    ? topic.questions.map((question) => normalizeQuestion(question)).filter(Boolean)
    : [];

  return {
    ...topic,
    id: topicId,
    title: typeof topic.title === "string" ? topic.title : "Новая тема",
    description: typeof topic.description === "string" ? topic.description : "",
    timeLimitMin: timeLimitValue,
    questions,
  };
};

const normalizedDefaultTopics = defaultTopics
  .map((topic) => normalizeTopic(topic))
  .filter(Boolean);

const readStoredTopics = () => {
  if (typeof localStorage === "undefined") {
    return normalizedDefaultTopics;
  }

  try {
    const raw = localStorage.getItem(TOPICS_STORAGE_KEY);
    if (!raw) {
      return normalizedDefaultTopics;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return normalizedDefaultTopics;
    }

    const normalizedTopics = parsed
      .map((topic) => normalizeTopic(topic))
      .filter(Boolean);

    return normalizedTopics.length > 0 ? normalizedTopics : normalizedDefaultTopics;
  } catch (error) {
    console.error("Failed to read topics from storage", error);
    return normalizedDefaultTopics;
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

  const addTopic = useCallback((title, description, timeLimitMin = 5) => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const normalizedTimeLimit = clampTimeLimit(timeLimitMin) ?? 5;

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `topic-${Date.now()}`;

    const newTopic = {
      id,
      title: trimmedTitle || "Новая тема",
      description: trimmedDescription || "Добавьте описание темы и вопросы",
      timeLimitMin: normalizedTimeLimit,
      questions: [],
    };

    setTopics((prev) => [...prev, newTopic]);

    return newTopic;
  }, []);

  const updateTopic = useCallback((topicId, patch) => {
    const trimmedTitle =
      patch.title !== undefined ? patch.title.trim() : undefined;
    const trimmedDescription =
      patch.description !== undefined ? patch.description.trim() : undefined;
    const normalizedTimeLimit =
      patch.timeLimitMin !== undefined ? clampTimeLimit(patch.timeLimitMin) : undefined;

    if (
      trimmedTitle === undefined
      && trimmedDescription === undefined
      && normalizedTimeLimit === undefined
    ) {
      return;
    }

    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) {
          return topic;
        }

        if (trimmedTitle !== undefined && trimmedTitle === "") {
          return topic;
        }

        return {
          ...topic,
          title: trimmedTitle ?? topic.title,
          description: trimmedDescription ?? topic.description,
          timeLimitMin: normalizedTimeLimit ?? topic.timeLimitMin ?? 5,
        };
      }),
    );
  }, []);

  const addQuestion = useCallback((topicId, { left = "", right = "" }, { allowDraft = false } = {}) => {
    let createdQuestion = null;

    const trimmedLeft = left.trim();
    const trimmedRight = right.trim();

    if (!allowDraft && (trimmedLeft === "" || trimmedRight === "")) {
      return null;
    }

    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) {
          return topic;
        }

        const nextId =
          topic.questions.reduce((max, question) => Math.max(max, question.id), 0) + 1;

        createdQuestion = {
          id: nextId,
          left: trimmedLeft,
          right: trimmedRight,
        };

        return {
          ...topic,
          questions: [createdQuestion, ...topic.questions],
        };
      }),
    );

    return createdQuestion;
  }, []);

  const updateQuestion = useCallback((topicId, questionId, updates, { allowDraft = false } = {}) => {
    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) {
          return topic;
        }

        return {
          ...topic,
          questions: topic.questions.map((question) =>
            question.id === questionId
              ? (() => {
                const nextLeft = updates.left !== undefined
                  ? updates.left.trim()
                  : question.left;
                const nextRight = updates.right !== undefined
                  ? updates.right.trim()
                  : question.right;

                if (!allowDraft && (nextLeft === "" || nextRight === "")) {
                  return question;
                }

                return {
                  ...question,
                  left: nextLeft,
                  right: nextRight,
                };
              })()
              : question,
          ),
        };
      }),
    );
  }, []);

  const deleteQuestion = useCallback((topicId, questionId) => {
    setTopics((prev) =>
      prev.map((topic) => {
        if (topic.id !== topicId) {
          return topic;
        }

        return {
          ...topic,
          questions: topic.questions.filter((question) => question.id !== questionId),
        };
      }),
    );
  }, []);

  const replaceTopics = useCallback((nextTopics) => {
    const normalizedTopics = (Array.isArray(nextTopics) ? nextTopics : [])
      .map((topic) => normalizeTopic(topic))
      .filter(Boolean);

    setTopics(normalizedTopics);
  }, []);

  const value = useMemo(
    () => ({
      topics,
      getTopicById,
      addTopic,
      updateTopic,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      replaceTopics,
    }),
    [topics, getTopicById, addTopic, updateTopic, addQuestion, updateQuestion, deleteQuestion, replaceTopics],
  );

  return <TopicsContext.Provider value={value}>{children}</TopicsContext.Provider>;
};

export { TopicsContext, TopicsProvider };
