import { useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/CardBody";
import CardTitle from "react-bootstrap/CardTitle";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

import { HistoryContext, TopicsContext } from "../../core/context/Context.jsx";
import { useAuthGuard } from "../../core/hooks/useAuthGuard.js";

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

const RatingCard = ({ attempt }) => {
  return (
    <div className="rating-card">
      <div className="rating-card__row">
        <span className="rating-card__place">#{attempt.place}</span>
        <span className="rating-card__user text-truncate">{attempt.userName}</span>
      </div>
      <div className="rating-card__row rating-card__row--stats">
        <span className="rating-card__correct text-success">Верно: {attempt.correct}</span>
        <span className="rating-card__wrong text-danger">Ошибок: {attempt.wrong}</span>
      </div>
      <div className="rating-card__row rating-card__row--meta">
        <span className="rating-card__time">Время: {formatDuration(attempt.durationSec)}</span>
        <span className="rating-card__date text-muted">{formatDate(attempt.date)}</span>
      </div>
    </div>
  );
};

const RatingScreen = () => {
  const { topicId } = useParams();
  const { quizHistory } = useContext(HistoryContext);
  const { topics } = useContext(TopicsContext);

  useAuthGuard();

  const topic = useMemo(
    () => topics.find((item) => item.id === topicId) ?? null,
    [topics, topicId],
  );

  const rows = useMemo(() => {
    const attempts = quizHistory.filter((attempt) => attempt.topicId === topicId);

    const bestByUser = attempts.reduce((acc, attempt) => {
      const existing = acc[attempt.userName];
      if (!existing) {
        acc[attempt.userName] = attempt;
        return acc;
      }

      const isBetter =
        attempt.correct > existing.correct ||
        (attempt.correct === existing.correct && attempt.wrong < existing.wrong) ||
        (attempt.correct === existing.correct &&
          attempt.wrong === existing.wrong &&
          attempt.durationSec < existing.durationSec) ||
        (attempt.correct === existing.correct &&
          attempt.wrong === existing.wrong &&
          attempt.durationSec === existing.durationSec &&
          new Date(attempt.date).getTime() > new Date(existing.date).getTime());

      acc[attempt.userName] = isBetter ? attempt : existing;
      return acc;
    }, {});

    return Object.values(bestByUser)
      .sort((a, b) => {
        if (a.correct !== b.correct) {
          return b.correct - a.correct;
        }
        if (a.wrong !== b.wrong) {
          return a.wrong - b.wrong;
        }
        if (a.durationSec !== b.durationSec) {
          return a.durationSec - b.durationSec;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })
      .map((attempt, index) => ({ ...attempt, place: index + 1 }));
  }, [quizHistory, topicId]);

  return (
    <Container fluid className="page-section">
      <div className="page-wrap">
        <Card className="shadow-sm page-card">
          <CardBody>
            <CardTitle className="fs-4 mb-3">
              <i className="bi bi-trophy-fill me-2 text-warning" aria-hidden="true" />
              Рейтинг по теме
            </CardTitle>

            {topic && (
              <div className="mb-3 text-muted">
                Тема: <span className="fw-semibold">{topic.title}</span>
              </div>
            )}

            {rows.length === 0 ? (
              <div className="text-muted">Результатов пока нет.</div>
            ) : (
              <>
                <div className="table-responsive d-none d-md-block">
                  <Table hover className="align-middle mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: "80px" }}>Место</th>
                        <th>Пользователь</th>
                        <th>Верно</th>
                        <th>Ошибок</th>
                        <th>Время</th>
                        <th>Дата</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((attempt) => (
                        <tr key={attempt.id}>
                          <td className="fw-semibold">{attempt.place}</td>
                          <td>{attempt.userName}</td>
                          <td className="text-success fw-semibold">{attempt.correct}</td>
                          <td className="text-danger fw-semibold">{attempt.wrong}</td>
                          <td>{formatDuration(attempt.durationSec)}</td>
                          <td>{formatDate(attempt.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <div className="d-md-none rating-card-list">
                  {rows.map((attempt) => (
                    <RatingCard key={attempt.id} attempt={attempt} />
                  ))}
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};

export { RatingScreen };
