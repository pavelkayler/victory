import { Badge, Button } from "react-bootstrap";

const AdminTopicCard = ({ topic, onEdit }) => {
  return (
    <div className="admin-topic-row">
      <div className="admin-topic-row__meta">
        <div className="fw-semibold text-break">{topic.title}</div>
        <div className="text-muted small mb-2 text-break">
          {topic.description}
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Badge bg="light" text="dark">
            <i className="bi bi-list-check me-1" aria-hidden="true" />
            {topic.questions.length} вопросов
          </Badge>
        </div>
      </div>

      <div className="admin-topic-row__actions">
        <div className="d-flex flex-wrap gap-2 w-100">
          <Button
            variant="outline-primary"
            type="button"
            onClick={onEdit}
          >
            Редактировать
          </Button>
        </div>
      </div>
    </div>
  );
};

export { AdminTopicCard };
