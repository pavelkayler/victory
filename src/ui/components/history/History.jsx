import { useContext, useMemo, useState } from "react";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";

import {
  HistoryContext,
  TopicsContext,
  UserContext,
} from "../../../core/context/Context.jsx";
import { useAuthGuard } from "../../../core/hooks/useAuthGuard.js";

const History = () => {
  const { quizHistory, clearHistory } = useContext(HistoryContext);
  const { userName } = useContext(UserContext);
  const { topics } = useContext(TopicsContext);

  useAuthGuard();

  const [selectedTopicId, setSelectedTopicId] = useState("all");

  const userHistory = useMemo(
    () => quizHistory.filter((attempt) => attempt.userName === userName),
    [quizHistory, userName],
  );

  const attemptsFiltered = useMemo(() => {
    if (selectedTopicId === "all") {
      return userHistory;
    }

    return userHistory.filter((attempt) => attempt.topicId === selectedTopicId);
  }, [selectedTopicId, userHistory]);

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds = 0) => {
    const safeSeconds = Math.max(0, seconds ?? 0);
    const minutes = Math.floor(safeSeconds / 60);
    const restSeconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
  };

  const handleClearHistory = () => {
    const confirmed = window.confirm("Очистить историю?");
    if (!confirmed) {
      return;
    }

    clearHistory();
  };

  return (
    <Container fluid className="page-section">
      <div className="page-wrap">
        <Card className="shadow-sm page-card">
          <CardBody>
            <CardTitle className="fs-3 mb-3"><i className="bi bi-table me-2 text-primary" />
              Журнал прохождений викторины
            </CardTitle>

            <Row className="gy-2 gx-3 align-items-center mb-3">
              <Col xs={12} md={6}>
                <Form.Label className="fw-semibold d-block mb-1">Фильтр по теме</Form.Label>
                <Form.Select
                  value={selectedTopicId}
                  onChange={(event) => setSelectedTopicId(event.target.value)}
                >
                  <option value="all">Все темы</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col xs={12} md={6} className="d-flex justify-content-md-end align-items-end">
                <Button variant="outline-danger" onClick={handleClearHistory}>
                  Очистить историю
                </Button>
              </Col>
            </Row>

            {attemptsFiltered.length === 0 ? (
              <p className="mb-0">Пока нет ни одной попытки.</p>
            ) : (
              <div className="history-grid">
                {attemptsFiltered.map((attempt, index) => (
                  <div className="history-card" key={attempt.id ?? index}>
                    <div className="history-card__header">
                      <div className="history-topic-block">
                        <span className="history-topic">
                          {attempt.topicTitle || "Выбранная тема"}
                        </span>
                        <span className="history-date">{formatDate(attempt.date)}</span>
                      </div>
                    </div>

                    <div className="history-stats">
                      <div className="history-stat history-stat--time">
                        <span className="history-stat__label">Время</span>
                        <span className="history-stat__value">
                          <i className="bi bi-stopwatch text-warning" />
                          {formatDuration(attempt.durationSec)}
                        </span>
                      </div>

                      <div className="history-stat history-stat--combo">
                        <span className="history-stat__label">Комбо</span>
                        <span className="history-stat__value">
                          <i className="bi bi-fire" />
                          {attempt.streak ?? "-"}
                        </span>
                      </div>

                      <div className="history-stat history-stat--success">
                        <span className="history-stat__label">Верно</span>
                        <span className="history-stat__value">
                          <i className="bi bi-check-circle-fill" />
                          {attempt.correct}
                        </span>
                      </div>

                      <div className="history-stat history-stat--danger">
                        <span className="history-stat__label">Ошибок</span>
                        <span className="history-stat__value">
                          <i className="bi bi-x-circle-fill" />
                          {attempt.wrong}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};

export { History };
