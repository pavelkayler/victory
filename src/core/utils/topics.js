const generateId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const random = Math.random().toString(16).slice(2);
  return `id-${Date.now()}-${random}`;
};

const generateQuestionId = (() => {
  let counter = 0;

  return () => {
    counter += 1;
    return Date.now() + counter;
  };
})();

const makeUniqueTitle = (baseTitle, usedTitlesSet) => {
  const safeTitle = typeof baseTitle === "string" ? baseTitle : "";
  let candidate = safeTitle;
  let counter = 1;

  while (usedTitlesSet.has(candidate)) {
    candidate = `${safeTitle} (${counter})`;
    counter += 1;
  }

  usedTitlesSet.add(candidate);
  return candidate;
};

export { generateId, generateQuestionId, makeUniqueTitle };
