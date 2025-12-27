import Badge from "react-bootstrap/Badge";
import CardSubtitle from "react-bootstrap/CardSubtitle";
import CardTitle from "react-bootstrap/CardTitle";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { pluralRu } from "../../../core/utils/pluralRu.js";

const TopicHero = ({ topic, questionsCount }) => {
  const badgeText = `${questionsCount} ${pluralRu(questionsCount, ["вопрос", "вопроса", "вопросов"])}`;

  return (
    <>
      <Row className="gy-2 align-items-start justify-content-between admin-topic-row-1">
        <Col xs={12} md className="admin-topic-title-col">
          <CardTitle as="h2" className="fs-3 mb-0">{topic.title}</CardTitle>
        </Col>
        <Col xs={12} md className="admin-topic-time-col">
          <div className="admin-topic-time text-center fw-semibold">
            {topic.timeLimitMin ?? 5} минут
          </div>
        </Col>
        <Col xs="auto" className="admin-topic-badge-col">
          <Badge bg="light" text="dark" className="fw-semibold admin-topic-count">
            {badgeText}
          </Badge>
        </Col>
      </Row>

      <Row className="mt-2 admin-topic-row-2">
        <Col>
          <CardSubtitle className="text-muted admin-topic-subtitle">
            {topic.description}
          </CardSubtitle>
        </Col>
      </Row>
    </>
  );
};

export { TopicHero };
