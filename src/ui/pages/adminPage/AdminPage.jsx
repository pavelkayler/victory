import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { AdminContext, TopicsContext } from "../../../core/context/Context.jsx";

const AdminPage = () => {
  const { isAdminAuthed, authorize, logoutAdmin } = useContext(AdminContext);
  const { topics, addTopic, addQuestion, updateTopic } = useContext(TopicsContext);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [topicError, setTopicError] = useState("");
  const [editError, setEditError] = useState("");
  const [editingTopicId, setEditingTopicId] = useState(null);
  const [editingTopicForm, setEditingTopicForm] = useState({
    title: "",
    description: "",
  });

  const stats = useMemo(() => {
    const totalQuestions = topics.reduce(
      (sum, topic) => sum + topic.questions.length,
      0,
    );

    return {
      totalTopics: topics.length,
      totalQuestions,
    };
  }, [topics]);

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    const isValid = authorize(password);

    if (!isValid) {
      setPasswordError("Неверный пароль. Попробуйте ещё раз.");
      return;
    }

    setPasswordError("");
    setPassword("");
  };

  const handleCreateTopic = (event) => {
    event.preventDefault();
    const nextTitle = topicTitle.trim();

    if (!nextTitle) {
      setTopicError("Название обязательно.");
      return;
    }

    setTopicError("");
    const nextDescription = topicDescription.trim();
    addTopic(nextTitle, nextDescription);
    setTopicTitle("");
    setTopicDescription("");
  };

  const handleStartEditTopic = (topic) => () => {
    setEditingTopicId(topic.id);
    setEditingTopicForm({
      title: topic.title ?? "",
      description: topic.description ?? "",
    });
    setEditError("");
  };

  const handleTopicEditChange = (field) => (event) => {
    setEditingTopicForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSaveTopic = (topicId) => () => {
    const trimmedTitle = editingTopicForm.title.trim();
    if (!trimmedTitle) {
      setEditError("Название обязательно.");
      return;
    }

    updateTopic(topicId, {
      title: trimmedTitle,
      description: editingTopicForm.description,
    });
    setEditingTopicId(null);
    setEditingTopicForm({ title: "", description: "" });
    setEditError("");
  };

  const handleCancelEdit = () => {
    setEditingTopicId(null);
    setEditingTopicForm({ title: "", description: "" });
    setEditError("");
  };

  const handleEditClick = (topicId) => () => {
    navigate(`/qques/topics/${topicId}`);
  };

  const handleQuickAddQuestion = (topicId) => () => {
    const newQuestion = addQuestion(
      topicId,
      { left: "", right: "" },
      { allowDraft: true },
    );
    navigate(`/qques/topics/${topicId}`, {
      state: newQuestion ? { highlightQuestionId: newQuestion.id } : undefined,
    });
  };

  if (!isAdminAuthed) {
    return (
      <div className="admin-login-screen">
        <Card className="shadow-lg admin-login-card">
          <CardBody>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-shield-lock-fill text-primary" aria-hidden="true" />
              <CardTitle className="fs-3 mb-0">Админ-кабинет</CardTitle>
            </div>
            <CardSubtitle className="text-muted mb-4">
              Доступ по адресу /qques. Сессия хранится до закрытия вкладки.
            </CardSubtitle>

            <Form onSubmit={handlePasswordSubmit} className="admin-auth-form">
              <Form.Group controlId="adminPassword" className="mb-3">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  placeholder="Введите пароль"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Form.Group>

              {passwordError && (
                <Alert variant="danger" className="mb-3">
                  {passwordError}
                </Alert>
              )}

              <Button variant="primary" type="submit" className="w-100">
                Войти
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Container fluid className="page-section">
        <div className="page-wrap">
          <Card className="shadow-lg page-card admin-card">
            <CardBody>
              <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                <div>
                  <CardTitle className="fs-3 d-flex align-items-center gap-2">
                    <i className="bi bi-shield-lock-fill text-primary" aria-hidden="true" />
                    Админ-кабинет
                  </CardTitle>

                  <CardSubtitle className="text-muted mb-2">
                    Доступ по адресу /qques. Сессия хранится до закрытия вкладки.
                  </CardSubtitle>
                </div>
                <Button variant="outline-secondary" onClick={logoutAdmin}>
                  Выйти
                </Button>
              </div>

              <Row className="g-3 mb-4">
                <Col md={6}>
                  <div className="admin-stat">
                    <span className="admin-stat__label">Темы</span>
                    <span className="admin-stat__value">{stats.totalTopics}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="admin-stat">
                    <span className="admin-stat__label">Всего вопросов</span>
                    <span className="admin-stat__value">{stats.totalQuestions}</span>
                  </div>
                </Col>
              </Row>

              <Row className="g-4">
                <Col md={6}>
                  <Card className="h-100 border-0 bg-light-subtle admin-form-card">
                    <CardBody>
                      <CardTitle className="fs-5 mb-3">Добавить новую тему</CardTitle>
                      <Form onSubmit={handleCreateTopic}>
                        <Form.Group controlId="topicTitle" className="mb-3">
                          <Form.Label>Название</Form.Label>
                          <Form.Control
                            type="text"
                            value={topicTitle}
                            onChange={(event) => setTopicTitle(event.target.value)}
                            placeholder='Например, "JavaScript"'
                            required
                          />
                        </Form.Group>

                        <Form.Group controlId="topicDescription" className="mb-3">
                          <Form.Label>Описание</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={topicDescription}
                            onChange={(event) =>
                              setTopicDescription(event.target.value)
                            }
                            placeholder="Кратко о теме"
                          />
                        </Form.Group>

                        {topicError && (
                          <Alert variant="warning" className="mb-3">
                            {topicError}
                          </Alert>
                        )}

                        <Button variant="success" type="submit" className="w-100">
                          Добавить тему
                        </Button>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="h-100 border-0">
                    <CardBody>
                      <CardTitle className="fs-5 mb-3">Список тем</CardTitle>
                      {topics.length === 0 ? (
                        <Alert variant="info" className="mb-0">
                          Тем пока нет. Создайте первую тему через форму слева.
                        </Alert>
                      ) : (
                        <Stack gap={3} className="admin-topics-list">
                          {topics.map((topic) => {
                            const isEditing = editingTopicId === topic.id;
                            const currentTitle = isEditing
                              ? editingTopicForm.title
                              : topic.title;
                            const currentDescription = isEditing
                              ? editingTopicForm.description
                              : topic.description;

                            return (
                              <div key={topic.id} className="admin-topic-row">
                                <div className="admin-topic-row__meta">
                                  {isEditing ? (
                                    <Stack gap={2}>
                                      <Form.Group controlId={`edit-topic-title-${topic.id}`}>
                                        <Form.Label className="visually-hidden">Название</Form.Label>
                                        <Form.Control
                                          type="text"
                                          value={currentTitle}
                                          placeholder="Название темы"
                                          onChange={handleTopicEditChange("title")}
                                          isInvalid={Boolean(editError && !currentTitle.trim())}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          Название обязательно.
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                      <Form.Group controlId={`edit-topic-description-${topic.id}`}>
                                        <Form.Label className="visually-hidden">Описание</Form.Label>
                                        <Form.Control
                                          as="textarea"
                                          rows={2}
                                          value={currentDescription}
                                          placeholder="Описание темы"
                                          onChange={handleTopicEditChange("description")}
                                        />
                                      </Form.Group>
                                      {editError && (
                                        <div className="text-danger small">{editError}</div>
                                      )}
                                    </Stack>
                                  ) : (
                                    <>
                                      <div className="fw-semibold text-break">{currentTitle}</div>
                                      <div className="text-muted small mb-2 text-break">
                                        {currentDescription}
                                      </div>
                                    </>
                                  )}
                                  <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <Badge bg="light" text="dark">
                                      <i className="bi bi-list-check me-1" aria-hidden="true" />
                                      {topic.questions.length} вопросов
                                    </Badge>
                                  </div>
                                </div>

                                <div className="admin-topic-row__actions">
                                  {isEditing ? (
                                    <div className="d-flex flex-wrap gap-2 w-100">
                                      <Button
                                        variant="success"
                                        type="button"
                                        onClick={handleSaveTopic(topic.id)}
                                        disabled={!currentTitle.trim()}
                                      >
                                        Сохранить
                                      </Button>
                                      <Button
                                        variant="outline-secondary"
                                        type="button"
                                        onClick={handleCancelEdit}
                                      >
                                        Отмена
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="d-flex flex-wrap gap-2 w-100">
                                      <Button
                                        variant="outline-primary"
                                        type="button"
                                        onClick={handleStartEditTopic(topic)}
                                      >
                                        Редактировать
                                      </Button>
                                      <Button
                                        variant="primary"
                                        type="button"
                                        className="admin-topic-row__add"
                                        onClick={handleQuickAddQuestion(topic.id)}
                                      >
                                        <i className="bi bi-plus-lg me-2" aria-hidden="true" />
                                        Вопрос
                                      </Button>
                                      <Button
                                        variant="outline-secondary"
                                        type="button"
                                        onClick={handleEditClick(topic.id)}
                                      >
                                        Открыть
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </Stack>
                      )}
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default AdminPage;
