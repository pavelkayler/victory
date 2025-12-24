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
  const { isAdminAuthed, authorize } = useContext(AdminContext);
  const { topics, addTopic, addQuestion } = useContext(TopicsContext);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [topicError, setTopicError] = useState("");

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

  const handleEditClick = (topicId) => () => {
    navigate(`/qques/topics/${topicId}`);
  };

  const handleQuickAddQuestion = (topicId) => () => {
    const newQuestion = addQuestion(topicId, { left: "", right: "" });
    navigate(`/qques/topics/${topicId}`, {
      state: newQuestion ? { highlightQuestionId: newQuestion.id } : undefined,
    });
  };

  return (
    <div className="app-shell">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <Card className="shadow-lg page-card p-4 admin-card">
              <CardBody>
                <CardTitle className="fs-3 d-flex align-items-center gap-2">
                  <i className="bi bi-shield-lock-fill text-primary" aria-hidden="true" />
                  Админ-кабинет
                </CardTitle>

                <CardSubtitle className="text-muted mb-4">
                  Доступ по адресу /qques. Сессия сбрасывается после перезагрузки.
                </CardSubtitle>

                {!isAdminAuthed ? (
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
                ) : (
                  <>
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
                                {topics.map((topic) => (
                                  <div key={topic.id} className="admin-topic-row">
                                    <div className="admin-topic-row__meta">
                                      <div className="fw-semibold">{topic.title}</div>
                                      <div className="text-muted small mb-2">
                                        {topic.description}
                                      </div>
                                      <div className="d-flex align-items-center gap-2">
                                        <Badge bg="light" text="dark">
                                          <i className="bi bi-list-check me-1" aria-hidden="true" />
                                          {topic.questions.length} вопросов
                                        </Badge>
                                      </div>
                                    </div>

                                    <div className="admin-topic-row__actions">
                                      <Button
                                        variant="outline-primary"
                                        type="button"
                                        onClick={handleEditClick(topic.id)}
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
                                    </div>
                                  </div>
                                ))}
                              </Stack>
                            )}
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminPage;
