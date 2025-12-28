import { useEffect, useRef } from "react";
import { Badge, Button, Card, CardBody, Col, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";

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
        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2 admin-question-card__header">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="fw-semibold">
              {isDraft ? "Новый" : `№${id.toString().padStart(2, "0")}`}
            </span>
            {!isValid && (
              <Badge bg="warning" text="dark">
                Не заполнено
              </Badge>
            )}
          </div>
          {!isEditing && (
            <div className="d-flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline-primary"
                type="button"
                onClick={onEdit}
              >
                Редактировать
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                type="button"
                onClick={onDelete}
              >
                Удалить
              </Button>
            </div>
          )}
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
                    onChange={(event) => onChange("left", event.target.value)}
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
                    onChange={(event) => onChange("right", event.target.value)}
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

        {isEditing && (
          <div className="d-flex flex-wrap gap-2 justify-content-center mt-3 question-edit-actions">
            <Button
              variant="success"
              type="button"
              onClick={onSave}
              disabled={Boolean(leftError || rightError)}
            >
              Сохранить
            </Button>
            <Button
              variant="outline-secondary"
              type="button"
              onClick={onCancel}
            >
              Отмена
            </Button>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export { QuestionCard };
