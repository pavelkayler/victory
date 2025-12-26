import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  Row,
} from "react-bootstrap";

import { TopicsContext } from "../../core/context/Context.jsx";
import { useAdminGuard } from "../../core/hooks/useAdminGuard.js";
import { isQuestionValid } from "../../core/utils/questions.js";
import { ConfirmModal } from "../components/common/ConfirmModal.jsx";
import { AppToast } from "../components/common/AppToast.jsx";
import { TopicHero } from "../components/adminTopic/TopicHero.jsx";
import { TopicActionsRow } from "../components/adminTopic/TopicActionsRow.jsx";
import { TopicEditForm } from "../components/adminTopic/TopicEditForm.jsx";
import { QuestionsList } from "../components/adminTopic/QuestionsList.jsx";

const SORT_MODES = {
  left: "left",
  right: "right",
};

const AdminTopicScreen = () => {
  const { topicId } = useParams();
  const { getTopicById, updateQuestion, addQuestion, deleteQuestion, updateTopic } =
    useContext(TopicsContext);
  const location = useLocation();
  const isAllowed = useAdminGuard();

  const topic = useMemo(() => getTopicById(topicId), [getTopicById, topicId]);
  const [highlightedId, setHighlightedId] = useState(null);
  const [sortMode, setSortMode] = useState(SORT_MODES.left);
  const [pinnedQuestionId, setPinnedQuestionId] = useState(null);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionDrafts, setQuestionDrafts] = useState({});
  const [isEditingTopicMeta, setIsEditingTopicMeta] = useState(false);
  const [topicTitleDraft, setTopicTitleDraft] = useState("");
  const [topicDescriptionDraft, setTopicDescriptionDraft] = useState("");
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
      setDraftQuestion(null);
      return;
    }

    setTopicTitleDraft(topic.title ?? "");
    setTopicDescriptionDraft(topic.description ?? "");
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
    }
  }, [location.state]);

  const questions = topic?.questions ?? [];

  const showToast = (message, bg = "success") => {
    setToastState({ show: true, message, bg });
  };

  const compareByField = (aValue, bValue) => {
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

    return leftText.localeCompare(rightText, "ru", { sensitivity: "base" });
  };

  const displayedQuestions = useMemo(() => {
    const sorted = [...questions];

    sorted.sort((a, b) => {
      if (sortMode === SORT_MODES.left) {
        return compareByField(a.left, b.left);
      }

      return compareByField(a.right, b.right);
    });

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
    setQuestionDrafts((prev) => {
      const next = { ...prev };
      delete next[pendingDeleteId];
      return next;
    });
    setPendingDeleteId(null);
    showToast("Вопрос удалён");
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
        showToast("Вопрос сохранён");
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
    setHighlightedId(questionId);
    setPinnedQuestionId(questionId);
    showToast("Вопрос сохранён");
  };

  const handleStartEditTopicMeta = () => {
    setIsEditingTopicMeta(true);
  };

  const handleSaveTopicMeta = () => {
    if (!topic) {
      return;
    }
    const trimmedTitle = topicTitleDraft.trim();

    if (!trimmedTitle) {
      return;
    }

    updateTopic(topic.id, {
      title: trimmedTitle,
      description: topicDescriptionDraft,
    });
    setIsEditingTopicMeta(false);
    showToast("Тема сохранена");
  };

  const handleCancelTopicMeta = () => {
    setTopicTitleDraft(topic?.title ?? "");
    setTopicDescriptionDraft(topic?.description ?? "");
    setIsEditingTopicMeta(false);
  };

  const handleSortChange = (event) => {
    setSortMode(event.target.value);
    setPinnedQuestionId(null);
    setHighlightedId(null);
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
              <Button as={Link} to="/qques" variant="primary">
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
            <Button as={Link} to="/qques" variant="outline-primary" size="sm" className="admin-back-btn">
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
              <option value={SORT_MODES.left}>A→Z по левой колонке</option>
              <option value={SORT_MODES.right}>A→Z по правой колонке</option>
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
                onSave={handleSaveTopicMeta}
                onCancel={handleCancelTopicMeta}
              />
            ) : (
              <TopicHero topic={topic} questionsCount={questions.length} />
            )}

            <TopicActionsRow
              isEditingTopic={isEditingTopicMeta}
              onEditTopic={handleStartEditTopicMeta}
              onAddQuestion={handleAddQuestion}
              onCancelEdit={handleCancelTopicMeta}
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
