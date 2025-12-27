/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/CardBody";
import CardSubtitle from "react-bootstrap/CardSubtitle";
import CardTitle from "react-bootstrap/CardTitle";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import FormSelect from "react-bootstrap/FormSelect";
import Row from "react-bootstrap/Row";

import { TopicsContext } from "../../core/context/Context.jsx";
import { ADMIN_PATH } from "../../core/constants/paths.js";
import { useAdminGuard } from "../../core/hooks/useAdminGuard.js";
import { isQuestionValid } from "../../core/utils/questions.js";
import { ConfirmModal } from "../components/common/ConfirmModal.jsx";
import { AppToast } from "../components/common/AppToast.jsx";
import { TopicHero } from "../components/adminTopic/TopicHero.jsx";
import { TopicActionsRow } from "../components/adminTopic/TopicActionsRow.jsx";
import { TopicEditForm } from "../components/adminTopic/TopicEditForm.jsx";
import { QuestionsList } from "../components/adminTopic/QuestionsList.jsx";

const SORT_MODES = {
  leftAsc: "leftAsc",
  leftDesc: "leftDesc",
  rightAsc: "rightAsc",
  rightDesc: "rightDesc",
  created: "created",
};

const AdminTopicScreen = () => {
  const { topicId } = useParams();
  const { getTopicById, updateQuestion, addQuestion, deleteQuestion, updateTopic } =
    useContext(TopicsContext);
  const location = useLocation();
  const isAllowed = useAdminGuard();

  const topic = useMemo(() => getTopicById(topicId), [getTopicById, topicId]);
  const [highlightedId, setHighlightedId] = useState(null);
  const [lastCreatedId, setLastCreatedId] = useState(null);
  const [sortMode, setSortMode] = useState(SORT_MODES.created);
  const [pinnedQuestionId, setPinnedQuestionId] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionDrafts, setQuestionDrafts] = useState({});
  const [isEditingTopicMeta, setIsEditingTopicMeta] = useState(false);
  const [topicTitleDraft, setTopicTitleDraft] = useState("");
  const [topicDescriptionDraft, setTopicDescriptionDraft] = useState("");
  const [topicTimeLimitDraft, setTopicTimeLimitDraft] = useState(5);
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    bg: "success",
  });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [draftQuestion, setDraftQuestion] = useState(null);

  useEffect(() => {
    if (!topic) {
      setQuestionDrafts({});
      setTopicTitleDraft("");
      setTopicDescriptionDraft("");
      setTopicTimeLimitDraft(5);
      setDraftQuestion(null);
      return;
    }

    setTopicTitleDraft(topic.title ?? "");
    setTopicDescriptionDraft(topic.description ?? "");
    setTopicTimeLimitDraft(topic.timeLimitMin ?? 5);
    setQuestionDrafts((prev) => {
      const next = {};
      topic.questions.forEach((question) => {
        next[question.id] = {
          left: prev[question.id]?.left ?? question.left ?? "",
          right: prev[question.id]?.right ?? question.right ?? "",
        };
      });
      return next;
    });
  }, [topic]);

  useEffect(() => {
    if (location.state?.highlightQuestionId) {
      setHighlightedId(location.state.highlightQuestionId);
      setPinnedQuestionId(location.state.highlightQuestionId);
      setEditingQuestionId(location.state.highlightQuestionId);
      setLastCreatedId(location.state.highlightQuestionId);
    }
  }, [location.state]);

  const questions = useMemo(() => topic?.questions ?? [], [topic]);
  const parsedTimeLimit = Number(topicTimeLimitDraft);
  const isTimeLimitValid = Number.isFinite(parsedTimeLimit)
    && parsedTimeLimit >= 1
    && parsedTimeLimit <= 60;

  const showToast = (message, bg = "success") => {
    setToastState({ show: true, message, bg });
  };

  const displayedQuestions = useMemo(() => {
    const sorted = [...questions];

    const compareByField = (aValue, bValue, direction = 1) => {
      const leftText = (aValue ?? "").trim();
      const rightText = (bValue ?? "").trim();
      const isLeftEmpty = leftText === "";
      const isRightEmpty = rightText === "";

      if (isLeftEmpty && !isRightEmpty) {
        return 1;
      }
      if (!isLeftEmpty && isRightEmpty) {
        return -1;
      }

      return leftText.localeCompare(rightText, "ru", { sensitivity: "base" }) * direction;
    };

    if (sortMode === SORT_MODES.leftAsc) {
      sorted.sort((a, b) => compareByField(a.left, b.left, 1));
    } else if (sortMode === SORT_MODES.leftDesc) {
      sorted.sort((a, b) => compareByField(a.left, b.left, -1));
    } else if (sortMode === SORT_MODES.rightAsc) {
      sorted.sort((a, b) => compareByField(a.right, b.right, 1));
    } else if (sortMode === SORT_MODES.rightDesc) {
      sorted.sort((a, b) => compareByField(a.right, b.right, -1));
    }

    const pinnedQuestion = pinnedQuestionId
      ? sorted.find((question) => question.id === pinnedQuestionId)
      : null;
    const sortedWithoutPinned = pinnedQuestion
      ? sorted.filter((question) => question.id !== pinnedQuestionId)
      : sorted;

    const sequence = [];

    if (draftQuestion) {
      sequence.push(draftQuestion);
    }

    if (pinnedQuestion) {
      sequence.push(pinnedQuestion);
    }

    return [...sequence, ...sortedWithoutPinned];
  }, [questions, sortMode, draftQuestion, pinnedQuestionId]);

  const handleAddQuestion = () => {
    if (!topic) {
      return;
    }
    if (draftQuestion) {
      setEditingQuestionId(draftQuestion.id);
      return;
    }

    const nextDraft = { id: "draft", left: "", right: "" };
    setDraftQuestion(nextDraft);
    setQuestionDrafts((prev) => ({
      ...prev,
      [nextDraft.id]: { left: "", right: "" },
    }));
    setEditingQuestionId(nextDraft.id);
    setHighlightedId(nextDraft.id);
  };

  const handleDraftChange = (questionId, field, value) => {
    setQuestionDrafts((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }));
  };

  const handleEditQuestion = (questionId) => {
    setEditingQuestionId(questionId);
  };

  const handleCancelEdit = (question) => {
    if (question.id === "draft") {
      setDraftQuestion(null);
      setEditingQuestionId(null);
      setQuestionDrafts((prev) => {
        const next = { ...prev };
        delete next[question.id];
        return next;
      });
      setHighlightedId((prev) => (prev === question.id ? null : prev));
      return;
    }

    setQuestionDrafts((prev) => ({
      ...prev,
      [question.id]: {
        left: question.left ?? "",
        right: question.right ?? "",
      },
    }));
    setEditingQuestionId(null);
  };

  const handleDeleteQuestion = (questionId) => {
    setPendingDeleteId(questionId);
  };

  const handleConfirmDelete = () => {
    if (!topic || pendingDeleteId === null) {
      setPendingDeleteId(null);
      return;
    }

    deleteQuestion(topic.id, pendingDeleteId);
    setEditingQuestionId((prev) => (prev === pendingDeleteId ? null : prev));
    setHighlightedId((prev) => (prev === pendingDeleteId ? null : prev));
    setPinnedQuestionId((prev) => (prev === pendingDeleteId ? null : prev));
    setLastCreatedId((prev) => (prev === pendingDeleteId ? null : prev));
    setQuestionDrafts((prev) => {
      const next = { ...prev };
      delete next[pendingDeleteId];
      return next;
    });
    setPendingDeleteId(null);
    showToast("Сохранено");
  };

  const handleSaveQuestion = (questionId) => {
    if (!topic) {
      return;
    }

    const draft = questionDrafts[questionId] ?? { left: "", right: "" };
    const trimmedLeft = draft.left.trim();
    const trimmedRight = draft.right.trim();

    if (!trimmedLeft || !trimmedRight) {
      setQuestionDrafts((prev) => ({
        ...prev,
        [questionId]: {
          left: draft.left,
          right: draft.right,
        },
      }));
      return;
    }

    if (questionId === "draft") {
      const created = addQuestion(
        topic.id,
        { left: trimmedLeft, right: trimmedRight },
        { allowDraft: false },
      );
      if (created) {
        setQuestionDrafts((prev) => {
          const next = { ...prev };
          delete next.draft;
          return next;
        });
        setDraftQuestion(null);
        setEditingQuestionId(null);
        setHighlightedId(created.id);
        setPinnedQuestionId(created.id);
        setLastCreatedId(created.id);
        showToast("Сохранено");
      }
      return;
    }

    updateQuestion(
      topic.id,
      questionId,
      {
        left: trimmedLeft,
        right: trimmedRight,
      },
      { allowDraft: false },
    );
    setEditingQuestionId(null);
    setHighlightedId((prev) => (questionId === lastCreatedId ? prev : null));
    setPinnedQuestionId((prev) => (questionId === lastCreatedId ? prev : null));
    showToast("Сохранено");
  };

  const handleStartEditTopicMeta = () => {
    setIsEditingTopicMeta(true);
  };

  const handleSaveTopicMeta = () => {
    if (!topic) {
      return;
    }
    const trimmedTitle = topicTitleDraft.trim();
    const parsedLimit = Number(topicTimeLimitDraft);

    if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
      showToast("Укажите время от 1 до 60 минут", "danger");
      return;
    }

    const normalizedTimeLimit = Math.min(60, Math.max(1, parsedLimit));

    if (!trimmedTitle) {
      return;
    }

    updateTopic(topic.id, {
      title: trimmedTitle,
      description: topicDescriptionDraft,
      timeLimitMin: normalizedTimeLimit,
    });
    setIsEditingTopicMeta(false);
    showToast("Сохранено");
  };

  const handleCancelTopicMeta = () => {
    setTopicTitleDraft(topic?.title ?? "");
    setTopicDescriptionDraft(topic?.description ?? "");
    setTopicTimeLimitDraft(topic?.timeLimitMin ?? 5);
    setIsEditingTopicMeta(false);
  };

  const handleSortChange = (event) => {
    setSortMode(event.target.value);
    setPinnedQuestionId(null);
    setHighlightedId(null);
    setLastCreatedId(null);
  };

  if (!isAllowed) {
    return null;
  }

  if (!topic) {
    return (
      <Container fluid className="page-section">
        <div className="page-wrap">
          <Card className="shadow-sm page-card">
            <CardBody>
              <CardTitle className="fs-4">Тема не найдена</CardTitle>
              <CardSubtitle className="text-muted mb-4">
                Проверьте ссылку или вернитесь на список тем.
              </CardSubtitle>
              <Button as={Link} to={ADMIN_PATH} variant="primary">
                Назад к темам
              </Button>
            </CardBody>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="page-section">
      <div className="page-wrap">
        <Row className="mb-3 align-items-center">
          <Col>
            <Button as={Link} to={ADMIN_PATH} variant="outline-primary" size="sm" className="admin-back-btn">
              <i className="bi bi-arrow-left-short me-2" aria-hidden="true" />
              К списку тем
            </Button>
          </Col>
          <Col xs="auto">
            <FormSelect
              size="sm"
              value={sortMode}
              onChange={handleSortChange}
            >
              <option value={SORT_MODES.created}>По порядку создания</option>
              <option value={SORT_MODES.leftAsc}>А→Я по левой колонке</option>
              <option value={SORT_MODES.leftDesc}>Я→А по левой колонке</option>
              <option value={SORT_MODES.rightAsc}>А→Я по правой колонке</option>
              <option value={SORT_MODES.rightDesc}>Я→А по правой колонке</option>
            </FormSelect>
          </Col>
        </Row>

        <Card className="shadow-sm page-card">
          <CardBody>
            {isEditingTopicMeta ? (
              <TopicEditForm
                titleDraft={topicTitleDraft}
                descriptionDraft={topicDescriptionDraft}
                onChangeTitle={setTopicTitleDraft}
                onChangeDescription={setTopicDescriptionDraft}
              />
            ) : (
              <TopicHero topic={topic} questionsCount={questions.length} />
            )}

              <TopicActionsRow
                isEditingTopic={isEditingTopicMeta}
                onEditTopic={handleStartEditTopicMeta}
                onAddQuestion={handleAddQuestion}
                onCancelEdit={handleCancelTopicMeta}
                onSaveTopic={handleSaveTopicMeta}
                isSaveDisabled={!topicTitleDraft.trim() || !isTimeLimitValid}
                isTimeLimitValid={isTimeLimitValid}
                timeLimit={topicTimeLimitDraft}
                onChangeTimeLimit={setTopicTimeLimitDraft}
              />

            <QuestionsList
              questions={displayedQuestions}
              questionDrafts={questionDrafts}
              highlightedId={highlightedId}
              editingQuestionId={editingQuestionId}
              isQuestionValid={isQuestionValid}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              onChange={handleDraftChange}
              onSave={handleSaveQuestion}
              onCancel={handleCancelEdit}
            />
          </CardBody>
        </Card>
      </div>

      <ConfirmModal
        show={pendingDeleteId !== null}
        title="Удалить вопрос?"
        body="Действие нельзя отменить. Продолжить?"
        confirmText="Удалить"
        cancelText="Отмена"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />

      <AppToast
        show={toastState.show}
        message={toastState.message}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
        bg={toastState.bg}
      />
    </Container>
  );
};

export { AdminTopicScreen };
