import { Badge, Button } from "react-bootstrap";

import { pluralRu } from "../../../core/utils/pluralRu.js";

const AdminTopicCard = ({ topic, onEdit }) => {
  const questionsLabel = `${topic.questions.length} ${pluralRu(topic.questions.length, ["вопрос", "вопроса", "вопросов"])}`;

  return (
    <div className="admin-topic-row">
      <div className="admin-topic-row__meta">
        <div className="fw-semibold text-break">{topic.title}</div>
        <div className="text-muted small text-break">{topic.description}</div>
        <Badge bg="light" text="dark" className="fw-semibold">
          {questionsLabel}
        </Badge>
      </div>

      <div className="admin-topic-row__actions">
        <Button
          variant="outline-primary"
          type="button"
          onClick={onEdit}
        >
          Редактировать
        </Button>
      </div>
    </div>
  );
};

export { AdminTopicCard };
