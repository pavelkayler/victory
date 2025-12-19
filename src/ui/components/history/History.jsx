import { useContext, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
} from "react-bootstrap";

import { HistoryContext, UserContext } from "../../../core/context/Context.jsx";
import { useAuthGuard } from "../../../core/hooks/useAuthGuard.js";

const History = () => {
  const { quizHistory } = useContext(HistoryContext);
  const { userName } = useContext(UserContext);

  useAuthGuard();

  const userHistory = useMemo(
    () => quizHistory.filter((attempt) => attempt.userName === userName),
    [quizHistory, userName],
  );

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

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow-sm page-card">
            <CardBody>
              <CardTitle className="fs-3 mb-3"><i className="bi bi-table me-2 text-primary" />
                Журнал прохождений викторины
              </CardTitle>

              {userHistory.length === 0 ? (
                <p className="mb-0">Пока нет ни одной попытки.</p>
              ) : (
                <div className="history-grid">
                  {userHistory.map((attempt, index) => (
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
        </Col>
      </Row>
    </Container>
  );
};

export { History };
