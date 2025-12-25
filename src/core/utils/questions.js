const isQuestionValid = (question) => {
  const left = (question?.left ?? "").trim();
  const right = (question?.right ?? "").trim();

  return left !== "" && right !== "";
};

export { isQuestionValid };
