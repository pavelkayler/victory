import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";

import { AdminContext, TopicsContext } from "../../../core/context/Context.jsx";

const AdminPage = () => {
  const { isAdminAuthed, authorize, logoutAdmin } = useContext(AdminContext);
  const { topics, addTopic } = useContext(TopicsContext);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [topicError, setTopicError] = useState("");
  const [toastState, setToastState] = useState({
    show: false,
    message: "",
    bg: "success",
  });

  const stats = useMemo(() => {
    return {
      totalTopics: topics.length,
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
    showToast("Тема добавлена");
    setTopicTitle("");
    setTopicDescription("");
  };

  const handleEditClick = (topicId) => () => {
    navigate(`/qques/topics/${topicId}`);
  };

  const handleLogoutAdmin = () => {
    logoutAdmin();
    navigate("/", { replace: true });
  };

  const showToast = (message, bg = "success") => {
    setToastState({ show: true, message, bg });
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
              Доступ по адресу /qques. Сессия хранится до перехода на пользовательские страницы.
            </CardSubtitle>

            <Form onSubmit={handlePasswordSubmit} className="admin-auth-form">
              <FormGroup controlId="adminPassword" className="mb-3">
                <FormLabel>Пароль</FormLabel>
                <FormControl
                  type="password"
                  value={password}
                  placeholder="Введите пароль"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </FormGroup>

              {passwordError && (
                <div className="text-danger mb-3">{passwordError}</div>
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
              <div className="admin-title-row">
                <CardTitle className="fs-3 d-flex align-items-center gap-2 mb-0 admin-title">
                  <i className="bi bi-shield-lock-fill text-primary" aria-hidden="true" />
                  Админ-панель
                </CardTitle>
                <Button
                  variant="outline-secondary"
                  onClick={handleLogoutAdmin}
                  className="admin-exit-btn d-none d-md-inline-flex"
                >
                  Выйти
                </Button>
              </div>

              <div className="d-flex justify-content-center d-md-none mt-2">
                <Button variant="outline-secondary" onClick={handleLogoutAdmin} className="admin-exit-btn">
                  Выйти
                </Button>
              </div>

              <CardSubtitle className="text-muted mb-3">
                Доступ по адресу /qques. Сессия хранится до перехода на пользовательские страницы.
              </CardSubtitle>

              <CardTitle as="h3" className="fs-5 mb-3">
                Список тем (всего: {stats.totalTopics})
              </CardTitle>

              {topics.length === 0 ? (
                <Card className="border-0 bg-light-subtle admin-form-card mb-4">
                  <CardBody>
                    <div className="text-muted">
                      Тем пока нет. Создайте первую тему через форму ниже.
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Card className="border-0 mb-4">
                  <CardBody>
                    <Stack gap={3} className="admin-topics-list">
                      {topics.map((topic) => (
                        <div key={topic.id} className="admin-topic-row">
                          <div className="admin-topic-row__meta">
                            <div className="fw-semibold text-break">{topic.title}</div>
                            <div className="text-muted small mb-2 text-break">
                              {topic.description}
                            </div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <Badge bg="light" text="dark">
                                <i className="bi bi-list-check me-1" aria-hidden="true" />
                                {topic.questions.length} вопросов
                              </Badge>
                            </div>
                          </div>

                          <div className="admin-topic-row__actions">
                            <div className="d-flex flex-wrap gap-2 w-100">
                              <Button
                                variant="outline-primary"
                                type="button"
                                onClick={handleEditClick(topic.id)}
                              >
                                Редактировать
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Stack>
                  </CardBody>
                </Card>
              )}

              <Card className="border-0 bg-light-subtle admin-form-card">
                <CardBody>
                  <CardTitle className="fs-5 mb-3">Добавить новую тему</CardTitle>
                  <Form onSubmit={handleCreateTopic}>
                    <FormGroup controlId="topicTitle" className="mb-3">
                      <FormLabel>Название</FormLabel>
                      <FormControl
                        type="text"
                        value={topicTitle}
                        onChange={(event) => setTopicTitle(event.target.value)}
                        placeholder='Например, "JavaScript"'
                        required
                      />
                    </FormGroup>

                    <FormGroup controlId="topicDescription" className="mb-3">
                      <FormLabel>Описание</FormLabel>
                      <FormControl
                        as="textarea"
                        rows={3}
                        value={topicDescription}
                        onChange={(event) => setTopicDescription(event.target.value)}
                        placeholder="Кратко о теме"
                      />
                    </FormGroup>

                    {topicError && (
                      <div className="text-warning mb-3">{topicError}</div>
                    )}

                    <Button variant="success" type="submit" className="w-100">
                      Добавить тему
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </CardBody>
          </Card>
        </div>
      </Container>

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

export default AdminPage;
