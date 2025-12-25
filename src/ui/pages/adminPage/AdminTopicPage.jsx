import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Badge,
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
  Modal,
  Row,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";

import { TopicsContext } from "../../../core/context/Context.jsx";
import { useAdminGuard } from "../../../core/hooks/useAdminGuard.js";
import { isQuestionValid } from "../../../core/utils/questions.js";

const SORT_MODES = {
  fill: "fill",
  left: "left",
  right: "right",
};

const AdminTopicPage = () => {
  const { topicId } = useParams();
  const { getTopicById, updateQuestion, addQuestion, deleteQuestion, updateTopic } =
    useContext(TopicsContext);
  const location = useLocation();
  const isAllowed = useAdminGuard();

  const topic = useMemo(() => getTopicById(topicId), [getTopicById, topicId]);
  const [highlightedId, setHighlightedId] = useState(null);
  const [sortMode, setSortMode] = useState(SORT_MODES.fill);
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
      setEditingQuestionId(location.state.highlightQuestionId);
    }
  }, [location.state]);

  useEffect(() => {
    if (highlightedId === null) {
      return undefined;
    }

    const timeoutId = setTimeout(() => setHighlightedId(null), 1600);
    return () => clearTimeout(timeoutId);
  }, [highlightedId]);

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

      if (sortMode === SORT_MODES.right) {
        return compareByField(a.right, b.right);
      }

      const aValid = isQuestionValid(a);
      const bValid = isQuestionValid(b);

      if (aValid === bValid) {
        return compareByField(a.left, b.left);
      }

      return Number(aValid) - Number(bValid);
    });

    if (draftQuestion) {
      return [draftQuestion, ...sorted];
    }

    return sorted;
  }, [questions, sortMode, draftQuestion]);

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

  const handleDraftChange = (questionId, field) => (event) => {
    const value = event.target.value;
    setQuestionDrafts((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }));
  };

  const handleEditQuestion = (questionId) => () => {
    setEditingQuestionId(questionId);
  };

  const handleCancelEdit = (question) => () => {
    if (question.id === "draft") {
      setDraftQuestion(null);
      setEditingQuestionId(null);
      setQuestionDrafts((prev) => {
        const next = { ...prev };
        delete next[question.id];
        return next;
      });
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

  const handleDeleteQuestion = (questionId) => () => {
    setPendingDeleteId(questionId);
  };

  const handleConfirmDelete = () => {
    if (!topic || pendingDeleteId === null) {
      setPendingDeleteId(null);
      return;
    }

    deleteQuestion(topic.id, pendingDeleteId);
    setEditingQuestionId((prev) => (prev === pendingDeleteId ? null : prev));
    setQuestionDrafts((prev) => {
      const next = { ...prev };
      delete next[pendingDeleteId];
      return next;
    });
    setPendingDeleteId(null);
    showToast("Вопрос удалён");
  };

  const handleSaveQuestion = (questionId) => () => {
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

  if (!isAllowed) {
    return null;
  }

  if (!topic) {
    return (
      <div className="app-shell">
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
      </div>
    );
  }

  return (
    <div className="app-shell">
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
                onChange={(event) => setSortMode(event.target.value)}
              >
                <option value={SORT_MODES.fill}>Сначала незаполненные</option>
                <option value={SORT_MODES.left}>A→Z по левой колонке</option>
                <option value={SORT_MODES.right}>A→Z по правой колонке</option>
              </FormSelect>
            </Col>
          </Row>

          <Card className="shadow-sm page-card">
            <CardBody>
              <div className="d-flex align-items-start gap-3 mb-3 flex-wrap">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-start gap-3 flex-wrap">
                    {isEditingTopicMeta ? (
                      <div className="w-100">
                        <FormGroup controlId="topicTitleEdit" className="mb-3">
                          <FormLabel>Название темы</FormLabel>
                          <FormControl
                            type="text"
                            value={topicTitleDraft}
                            onChange={(event) => setTopicTitleDraft(event.target.value)}
                            placeholder="Название темы"
                          />
                        </FormGroup>
                        <FormGroup controlId="topicDescriptionEdit" className="mb-3">
                          <FormLabel>Описание темы</FormLabel>
                          <FormControl
                            as="textarea"
                            rows={3}
                            value={topicDescriptionDraft}
                            onChange={(event) => setTopicDescriptionDraft(event.target.value)}
                            placeholder="Описание темы"
                          />
                        </FormGroup>
                        <div className="d-flex flex-wrap gap-2">
                          <Button
                            variant="success"
                            type="button"
                            onClick={handleSaveTopicMeta}
                            disabled={!topicTitleDraft.trim()}
                          >
                            Сохранить
                          </Button>
                          <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={handleCancelTopicMeta}
                          >
                            Отмена
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <CardTitle className="fs-3 mb-0">{topic.title}</CardTitle>
                        <Badge bg="light" text="dark" className="align-self-center">
                          <i className="bi bi-list-check me-1" aria-hidden="true" />
                          {questions.length} вопросов
                        </Badge>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          type="button"
                          onClick={handleStartEditTopicMeta}
                          className="align-self-center"
                        >
                          Редактировать тему
                        </Button>
                      </>
                    )}
                  </div>
                  {!isEditingTopicMeta && (
                    <CardSubtitle className="text-muted mb-2 admin-topic-subtitle">
                      {topic.description}
                    </CardSubtitle>
                  )}
                </div>
                <Button
                  variant="success"
                  onClick={handleAddQuestion}
                  className="d-none d-md-inline-flex"
                >
                  <i className="bi bi-plus-lg me-2" aria-hidden="true" />
                  Добавить вопрос
                </Button>
              </div>

              <div className="d-flex d-md-none justify-content-start mt-2 mb-3">
                <Button variant="success" onClick={handleAddQuestion}>
                  <i className="bi bi-plus-lg me-2" aria-hidden="true" />
                  Добавить вопрос
                </Button>
              </div>

              <Stack gap={3} className="admin-questions-list">
                {questions.length === 0 && !draftQuestion && (
                  <div className="text-muted">
                    В этой теме ещё нет вопросов. Добавьте первый!
                  </div>
                )}

                {displayedQuestions.map((question) => {
                  const draft = questionDrafts[question.id] ?? {
                    left: question.left ?? "",
                    right: question.right ?? "",
                  };
                  const leftError = !draft.left.trim() ? "Заполните левую колонку" : "";
                  const rightError = !draft.right.trim()
                    ? "Заполните правую колонку"
                    : "";
                  const isEditing = editingQuestionId === question.id;
                  const isValid = question.id === "draft" ? false : isQuestionValid(question);
                  const isDraft = question.id === "draft";

                  return (
                    <Card
                      key={question.id}
                      className={`admin-question-card ${highlightedId === question.id ? "is-highlighted" : ""}`}
                    >
                      <CardBody>
                        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="fw-semibold">
                              {isDraft ? "Новый" : `№${question.id.toString().padStart(2, "0")}`}
                            </span>
                            {!isValid && (
                              <Badge bg="warning" text="dark">
                                Не заполнено
                              </Badge>
                            )}
                          </div>
                          {!isEditing && (
                            <div className="d-flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                type="button"
                                onClick={handleEditQuestion(question.id)}
                              >
                                Редактировать
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                type="button"
                                onClick={handleDeleteQuestion(question.id)}
                                >
                                Удалить
                              </Button>
                            </div>
                          )}
                        </div>

                        <Row className="g-3">
                          <Col md={6}>
                            <FormGroup controlId={`question-left-${question.id}`}>
                              <FormLabel>Левая колонка</FormLabel>
                              {isEditing ? (
                                <>
                                  <FormControl
                                    as="textarea"
                                    rows={2}
                                    value={draft.left}
                                    placeholder="Фраза или вопрос"
                                    onChange={handleDraftChange(question.id, "left")}
                                    isInvalid={Boolean(leftError)}
                                  />
                                  {leftError && (
                                    <div className="text-danger small mt-1">{leftError}</div>
                                  )}
                                </>
                              ) : (
                                <div className="admin-question-text">{draft.left}</div>
                              )}
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup controlId={`question-right-${question.id}`}>
                              <FormLabel>Правая колонка</FormLabel>
                              {isEditing ? (
                                <>
                                  <FormControl
                                    as="textarea"
                                    rows={2}
                                    value={draft.right}
                                    placeholder="Ответ или соответствие"
                                    onChange={handleDraftChange(question.id, "right")}
                                    isInvalid={Boolean(rightError)}
                                  />
                                  {rightError && (
                                    <div className="text-danger small mt-1">{rightError}</div>
                                  )}
                                </>
                              ) : (
                                <div className="admin-question-text">{draft.right}</div>
                              )}
                            </FormGroup>
                          </Col>
                        </Row>

                        {isEditing && (
                          <div className="d-flex flex-wrap gap-2 justify-content-end mt-3">
                            <Button
                              variant="success"
                              type="button"
                              onClick={handleSaveQuestion(question.id)}
                              disabled={Boolean(leftError || rightError)}
                            >
                              Сохранить
                            </Button>
                            <Button
                              variant="outline-secondary"
                              type="button"
                              onClick={handleCancelEdit(question)}
                            >
                              Отмена
                            </Button>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  );
                })}
              </Stack>
            </CardBody>
          </Card>
        </div>
      </Container>

      <Modal show={pendingDeleteId !== null} onHide={() => setPendingDeleteId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Удалить вопрос?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Действие нельзя отменить. Продолжить?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPendingDeleteId(null)}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-center" className="mt-3">
        <Toast
          bg={toastState.bg}
          onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
          show={toastState.show}
          delay={2400}
          autohide
        >
          <Toast.Body className="text-white">{toastState.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default AdminTopicPage;
