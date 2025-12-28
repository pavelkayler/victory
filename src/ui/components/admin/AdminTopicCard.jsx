import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";

import { pluralRu } from "../../../core/utils/pluralRu.js";

const AdminTopicCard = ({ topic, onEdit }) => {
  const questionsLabel = `${topic.questions.length} ${pluralRu(topic.questions.length, ["вопрос", "вопроса", "вопросов"])}`;

  return (
    <div className="admin-topic-row">
      <div className="admin-topic-row__meta">
        <div className="admin-topic-row__top">
          <div className="admin-topic-row__title fw-semibold text-break">{topic.title}</div>
          <div className="admin-topic-row__badges">
            <Badge bg="light" text="dark" className="fw-semibold admin-topic-badge admin-topic-badge--time">
              {topic.timeLimitMin ?? 5} минут
            </Badge>
            <Badge bg="light" text="dark" className="fw-semibold admin-topic-badge">
              {questionsLabel}
            </Badge>
          </div>
        </div>
        <div className="text-muted small text-break admin-topic-row__desc">{topic.description}</div>
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
