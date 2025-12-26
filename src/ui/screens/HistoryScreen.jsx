import { useContext, useMemo, useState } from "react";
import { Card, CardBody, CardTitle, Container } from "react-bootstrap";

import {
  HistoryContext,
  TopicsContext,
  UserContext,
} from "../../core/context/Context.jsx";
import { useAuthGuard } from "../../core/hooks/useAuthGuard.js";
import { ConfirmModal } from "../components/common/ConfirmModal.jsx";
import { AppToast } from "../components/common/AppToast.jsx";
import { HistoryFilter } from "../components/history/HistoryFilter.jsx";
import { HistoryClearButton } from "../components/history/HistoryClearButton.jsx";
import { HistoryAttemptList } from "../components/history/HistoryAttemptList.jsx";

const HistoryScreen = () => {
  const { quizHistory, clearHistory } = useContext(HistoryContext);
  const { userName } = useContext(UserContext);
  const { topics } = useContext(TopicsContext);

  useAuthGuard();

  const [selectedTopicId, setSelectedTopicId] = useState("all");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toastState, setToastState] = useState({ show: false, message: "" });

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
    setToastState({ show: true, message: "История очищена" });
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
            <CardTitle className="fs-3 mb-3">
              <i className="bi bi-table me-2 text-primary" />
              Журнал прохождений викторины
            </CardTitle>

            <HistoryFilter
              selectedTopicId={selectedTopicId}
              topics={topics}
              onChange={setSelectedTopicId}
            />

            <HistoryClearButton onClick={openConfirm} />

            <HistoryAttemptList
              attempts={attemptsFiltered}
              formatDate={formatDate}
              formatDuration={formatDuration}
            />
          </CardBody>
        </Card>
      </div>

      <ConfirmModal
        show={isConfirmOpen}
        title="Подтвердите очистку"
        body="История будет удалена. Продолжить?"
        confirmText="Очистить"
        cancelText="Отмена"
        onConfirm={handleConfirmClear}
        onCancel={closeConfirm}
      />

      <AppToast
        show={toastState.show}
        message={toastState.message}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
      />
    </Container>
  );
};

export { HistoryScreen };
