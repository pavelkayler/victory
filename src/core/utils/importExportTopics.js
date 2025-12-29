import { generateId, generateQuestionId, makeUniqueTitle } from "./topics.js";

const clampTimeLimit = (value, fallback = 5) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(60, Math.max(1, parsed));
};

const normalizeImportedTopic = (topic) => {
  if (!topic || typeof topic !== "object") {
    throw new Error("Некорректная структура темы.");
  }

  const topicId = typeof topic.id === "string" ? topic.id : topic.id?.toString();
  if (!topicId) {
    throw new Error("У темы отсутствует id.");
  }

  if (!Array.isArray(topic.questions)) {
    throw new Error(`У темы "${topic.title || topicId}" отсутствует список вопросов.`);
  }

  if (typeof topic.title !== "string" || topic.title.trim() === "") {
    throw new Error(`У темы "${topicId}" отсутствует название.`);
  }

  if (typeof topic.description !== "string") {
    throw new Error(`У темы "${topicId}" отсутствует описание.`);
  }

  const normalizedQuestions = topic.questions
    .map((question) => {
      if (!question || typeof question !== "object") {
        return null;
      }

      const questionId = Number(question.id);
      if (!Number.isFinite(questionId)) {
        return null;
      }

      return {
        id: questionId,
        left: typeof question.left === "string" ? question.left : "",
        right: typeof question.right === "string" ? question.right : "",
      };
    })
    .filter(Boolean);

  const timeLimitRaw = topic.timeLimitMinutes ?? topic.timeLimitMin ?? topic.timeLimit;
  const timeLimitMin = clampTimeLimit(timeLimitRaw ?? 5);

  if (timeLimitMin === null) {
    throw new Error(`Некорректное время у темы "${topic.title || topicId}".`);
  }

  return {
    id: topicId,
    title: topic.title.trim(),
    description: topic.description,
    timeLimitMin,
    questions: normalizedQuestions,
  };
};

const prepareTopicsForAppend = (normalizedTopics, existingTopics) => {
  const usedTitles = new Set(existingTopics.map((topic) => topic.title));

  return normalizedTopics.map((topic) => {
    const uniqueTitle = makeUniqueTitle(topic.title, usedTitles);
    const preparedQuestions = topic.questions.map((question) => ({
      ...question,
      id: generateQuestionId(),
    }));

    usedTitles.add(uniqueTitle);

    return {
      ...topic,
      id: generateId(),
      title: uniqueTitle,
      questions: preparedQuestions,
    };
  });
};

const createTopicsExportBlob = (topics) => {
  return new Blob([JSON.stringify({ topics }, null, 2)], { type: "application/json" });
};

export {
  clampTimeLimit,
  normalizeImportedTopic,
  prepareTopicsForAppend,
  createTopicsExportBlob,
};
