import { Stack } from "react-bootstrap";

import { QuestionCard } from "./QuestionCard.jsx";

const QuestionsList = ({
  questions,
  questionDrafts,
  highlightedId,
  editingQuestionId,
  isQuestionValid,
  onEdit,
  onDelete,
  onChange,
  onSave,
  onCancel,
}) => {
  return (
    <Stack gap={3} className="admin-questions-list">
      {questions.length === 0 && (
        <div className="text-muted">
          В этой теме ещё нет вопросов. Добавьте первый!
        </div>
      )}

      {questions.map((question) => {
        const draft = questionDrafts[question.id] ?? {
          left: question.left ?? "",
          right: question.right ?? "",
        };
        const leftError = !draft.left.trim() ? "Заполните левую колонку" : "";
        const rightError = !draft.right.trim() ? "Заполните правую колонку" : "";
        const isEditing = editingQuestionId === question.id;
        const isValid = question.id === "draft" ? false : isQuestionValid(question);

        return (
          <QuestionCard
            key={question.id}
            question={question}
            draft={draft}
            isEditing={isEditing}
            isHighlighted={highlightedId === question.id}
            leftError={leftError}
            rightError={rightError}
            isValid={isValid}
            onChange={(field, value) => onChange(question.id, field, value)}
            onEdit={() => onEdit(question.id)}
            onSave={() => onSave(question.id)}
            onCancel={() => onCancel(question)}
            onDelete={() => onDelete(question.id)}
          />
        );
      })}
    </Stack>
  );
};

export { QuestionsList };
