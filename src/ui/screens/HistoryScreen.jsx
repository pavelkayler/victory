import { useCallback, useContext, useMemo, useState } from "react";
import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/CardBody";
import CardTitle from "react-bootstrap/CardTitle";
import Container from "react-bootstrap/Container";

import {
  HistoryContext,
  TopicsContext,
  UserContext,
} from "../../core/context/Context.jsx";
import { useAuthGuard } from "../../core/hooks/useAuthGuard.js";
import { formatDateRu, formatDurationMmSs } from "../../core/utils/formatters.js";
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

  const handleClearHistory = useCallback(() => {
    clearHistory();
    setToastState({ show: true, message: "История очищена" });
  }, [clearHistory]);

  const handleConfirmClear = useCallback(() => {
    handleClearHistory();
    setIsConfirmOpen(false);
  }, [handleClearHistory]);

  const handleTopicChange = useCallback((value) => {
    setSelectedTopicId(value);
  }, []);

  const openConfirm = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  const closeConfirm = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);

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
              onChange={handleTopicChange}
            />

            <HistoryClearButton onClick={openConfirm} />

            <HistoryAttemptList
              attempts={attemptsFiltered}
              formatDate={formatDateRu}
              formatDuration={formatDurationMmSs}
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
