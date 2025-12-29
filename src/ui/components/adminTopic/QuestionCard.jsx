import { memo, useCallback, useEffect, useRef } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/CardBody";
import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import Row from "react-bootstrap/Row";

const QuestionCard = ({
  question,
  draft,
  isEditing,
  isHighlighted,
  leftError,
  rightError,
  isValid,
  onChange,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) => {
  const { id } = question;
  const isDraft = id === "draft";
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const handleLeftChange = useCallback((event) => {
    onChange(id, "left", event.target.value);
  }, [id, onChange]);
  const handleRightChange = useCallback((event) => {
    onChange(id, "right", event.target.value);
  }, [id, onChange]);
  const handleEditClick = useCallback(() => {
    onEdit(id);
  }, [id, onEdit]);
  const handleSaveClick = useCallback(() => {
    onSave(id);
  }, [id, onSave]);
  const handleCancelClick = useCallback(() => {
    onCancel(question);
  }, [onCancel, question]);
  const handleDeleteClick = useCallback(() => {
    onDelete(id);
  }, [id, onDelete]);

  const autoResize = (element) => {
    if (!element) {
      return;
    }
    element.style.height = "auto";
    element.style.overflow = "hidden";
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    autoResize(leftRef.current);
  }, [draft.left, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    autoResize(rightRef.current);
  }, [draft.right, isEditing]);

  return (
    <Card
      className={`admin-question-card ${isHighlighted ? "is-highlighted" : ""}`.trim()}
    >
      <CardBody>
        <div className="admin-question-card__header">
          <div className="admin-question-card__meta d-flex align-items-center gap-2 flex-wrap">
            <span className="fw-semibold">
              {isDraft ? "Новый" : `№${id.toString().padStart(2, "0")}`}
            </span>
            {!isValid && (
              <Badge bg="warning" text="dark">
                Не заполнено
              </Badge>
            )}
          </div>
        </div>

        <Row className="g-3">
          <Col md={6}>
            <FormGroup controlId={`question-left-${id}`}>
              <FormLabel>Левая колонка</FormLabel>
              {isEditing ? (
                <>
                  <FormControl
                    as="textarea"
                    rows={2}
                    ref={leftRef}
                    value={draft.left}
                    placeholder="Фраза или вопрос"
                    onChange={handleLeftChange}
                    isInvalid={Boolean(leftError)}
                    className="auto-resize-textarea"
                  />
                  {leftError && (
                    <div className="text-danger small mt-1">{leftError}</div>
                  )}
                </>
              ) : (
                <div className="admin-question-text">{draft.left}</div>
              )}
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup controlId={`question-right-${id}`}>
              <FormLabel>Правая колонка</FormLabel>
              {isEditing ? (
                <>
                  <FormControl
                    as="textarea"
                    rows={2}
                    ref={rightRef}
                    value={draft.right}
                    placeholder="Ответ или соответствие"
                    onChange={handleRightChange}
                    isInvalid={Boolean(rightError)}
                    className="auto-resize-textarea"
                  />
                  {rightError && (
                    <div className="text-danger small mt-1">{rightError}</div>
                  )}
                </>
              ) : (
                <div className="admin-question-text">{draft.right}</div>
              )}
            </FormGroup>
          </Col>
        </Row>

        {!isEditing && (
          <div className="question-actions-row d-flex align-items-center justify-content-between gap-2 mt-3 mb-2">
            <Button
              size="sm"
              variant="outline-primary"
              type="button"
              onClick={handleEditClick}
            >
              Редактировать
            </Button>
            <Button
              size="sm"
              variant="outline-danger"
              type="button"
              onClick={handleDeleteClick}
            >
              Удалить
            </Button>
          </div>
        )}

        {isEditing && (
          <div className="question-edit-actions d-flex align-items-center justify-content-between gap-2 flex-wrap mt-3 mb-2 w-100">
            <Button
              variant="success"
              type="button"
              onClick={handleSaveClick}
              disabled={Boolean(leftError || rightError)}
            >
              Сохранить
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={handleCancelClick}
            >
              Отмена
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const QuestionCardMemo = memo(QuestionCard);

export { QuestionCardMemo as QuestionCard };
