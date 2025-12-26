import { useContext, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  FormLabel,
  FormSelect,
  Modal,
  Row,
  Toast,
  ToastContainer,
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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

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
    clearHistory();
    setToastMessage("История очищена");
    setShowToast(true);
  };

  const handleConfirmClear = () => {
    handleClearHistory();
    setIsConfirmOpen(false);
  };

  const openConfirm = () => {
    setIsConfirmOpen(true);
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
  };

  return (
    <Container fluid className="page-section">
      <div className="page-wrap">
        <Card className="shadow-sm page-card">
          <CardBody>
            <CardTitle className="fs-3 mb-3"><i className="bi bi-table me-2 text-primary" />
              Журнал прохождений викторины
            </CardTitle>

            <Row className="gy-2 gx-3 align-items-center">
              <Col xs={12} md={6} className="mx-auto history-filter-wrap">
                <FormLabel className="fw-semibold d-block mb-1">Фильтр по теме</FormLabel>
                <FormSelect
                  className="w-100 mt-2"
                  value={selectedTopicId}
                  onChange={(event) => setSelectedTopicId(event.target.value)}
                >
                  <option value="all">Все темы</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title}
                    </option>
                  ))}
                </FormSelect>
              </Col>
            </Row>

            <Row className="mt-3 mb-3">
              <Col xs={12} className="d-flex justify-content-center align-items-end">
                <Button variant="outline-danger" onClick={openConfirm}>
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

      <Modal show={isConfirmOpen} onHide={closeConfirm} centered>
        <Modal.Header closeButton>
          <Modal.Title>Подтвердите очистку</Modal.Title>
        </Modal.Header>
        <Modal.Body>История будет удалена. Продолжить?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeConfirm}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleConfirmClear}>
            Очистить
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-center" className="mb-3">
        <Toast
          bg="success"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={2600}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export { History };
