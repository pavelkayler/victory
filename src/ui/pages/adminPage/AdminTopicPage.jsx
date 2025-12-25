import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
  Form,
  Row,
  Stack,
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
  const { getTopicById, updateQuestion, addQuestion, deleteQuestion } =
    useContext(TopicsContext);
  const location = useLocation();
  const isAllowed = useAdminGuard();

  const topic = useMemo(() => getTopicById(topicId), [getTopicById, topicId]);
  const [highlightedId, setHighlightedId] = useState(null);
  const [sortMode, setSortMode] = useState(SORT_MODES.fill);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [questionDrafts, setQuestionDrafts] = useState({});

  useEffect(() => {
    if (!topic) {
      setQuestionDrafts({});
      return;
    }

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

  const displayedQuestions = useMemo(() => {
    const sorted = [...questions];

    sorted.sort((a, b) => {
      if (sortMode === SORT_MODES.left) {
        return (a.left ?? "").localeCompare(b.left ?? "", "ru", { sensitivity: "base" });
      }

      if (sortMode === SORT_MODES.right) {
        return (a.right ?? "").localeCompare(b.right ?? "", "ru", { sensitivity: "base" });
      }

      const aValid = isQuestionValid(a);
      const bValid = isQuestionValid(b);

      if (aValid === bValid) {
        return a.id - b.id;
      }

      return Number(aValid) - Number(bValid);
    });

    return sorted;
  }, [questions, sortMode]);

  const handleAddQuestion = () => {
    if (!topic) {
      return;
    }
    const newQuestion = addQuestion(
      topic.id,
      { left: "", right: "" },
      { allowDraft: true },
    );
    if (newQuestion) {
      setQuestionDrafts((prev) => ({
        ...prev,
        [newQuestion.id]: { left: "", right: "" },
      }));
      setEditingQuestionId(newQuestion.id);
      setHighlightedId(newQuestion.id);
    }
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
    if (!topic) {
      return;
    }
    const confirmed = window.confirm("Удалить вопрос?");
    if (!confirmed) {
      return;
    }

    deleteQuestion(topic.id, questionId);
    setEditingQuestionId((prev) => (prev === questionId ? null : prev));
    setQuestionDrafts((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
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
              <Form.Select
                size="sm"
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value)}
              >
                <option value={SORT_MODES.fill}>Сначала незаполненные</option>
                <option value={SORT_MODES.left}>A→Z по левой колонке</option>
                <option value={SORT_MODES.right}>A→Z по правой колонке</option>
              </Form.Select>
            </Col>
          </Row>

          <Card className="shadow-sm page-card">
            <CardBody>
              <div className="d-flex align-items-start gap-3 mb-2 flex-wrap">
                <CardTitle className="fs-3 mb-0">{topic.title}</CardTitle>
                <Badge bg="light" text="dark" className="align-self-center">
                  <i className="bi bi-list-check me-1" aria-hidden="true" />
                  {questions.length} вопросов
                </Badge>
              </div>
              <CardSubtitle className="text-muted mb-4">
                Редактируйте карточки. Незаполненные вопросы помечены отдельно.
              </CardSubtitle>

              <Stack gap={3} className="admin-questions-list">
                {questions.length === 0 && (
                  <Alert variant="info" className="mb-0">
                    В этой теме ещё нет вопросов. Добавьте первый!
                  </Alert>
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
                  const isValid = isQuestionValid(question);

                  return (
                    <Card
                      key={question.id}
                      className={`admin-question-card ${highlightedId === question.id ? "is-highlighted" : ""}`}
                    >
                      <CardBody>
                        <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                          <div className="d-flex align-items-center gap-2 flex-wrap">
                            <span className="fw-semibold">
                              №{question.id.toString().padStart(2, "0")}
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
                            <Form.Group controlId={`question-left-${question.id}`}>
                              <Form.Label>Левая колонка</Form.Label>
                              <Form.Control
                                type="text"
                                value={draft.left}
                                placeholder="Фраза или вопрос"
                                onChange={handleDraftChange(question.id, "left")}
                                disabled={!isEditing}
                                isInvalid={isEditing && Boolean(leftError)}
                              />
                              {isEditing && leftError && (
                                <Form.Text className="text-danger">{leftError}</Form.Text>
                              )}
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group controlId={`question-right-${question.id}`}>
                              <Form.Label>Правая колонка</Form.Label>
                              <Form.Control
                                type="text"
                                value={draft.right}
                                placeholder="Ответ или соответствие"
                                onChange={handleDraftChange(question.id, "right")}
                                disabled={!isEditing}
                                isInvalid={isEditing && Boolean(rightError)}
                              />
                              {isEditing && rightError && (
                                <Form.Text className="text-danger">{rightError}</Form.Text>
                              )}
                            </Form.Group>
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

              <div className="d-flex justify-content-end mt-4">
                <Button variant="success" onClick={handleAddQuestion}>
                  <i className="bi bi-plus-lg me-2" aria-hidden="true" />
                  Добавить вопрос
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default AdminTopicPage;
