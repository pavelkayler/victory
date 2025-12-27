import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/CardBody";
import CardSubtitle from "react-bootstrap/CardSubtitle";
import CardTitle from "react-bootstrap/CardTitle";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";

import { AdminContext, TopicsContext, UserContext } from "../../core/context/Context.jsx";
import { ADMIN_PATH } from "../../core/constants/paths.js";
import { AppToast } from "../components/common/AppToast.jsx";
import { AdminHeader } from "../components/admin/AdminHeader.jsx";
import { TopicListHeader } from "../components/admin/TopicListHeader.jsx";
import { AdminTopicList } from "../components/admin/AdminTopicList.jsx";
import { AdminAddTopicForm } from "../components/admin/AdminAddTopicForm.jsx";

const AdminScreen = () => {
  const { isAdminAuthed, authorize, logoutAdmin } = useContext(AdminContext);
  const { topics, addTopic } = useContext(TopicsContext);
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [topicTimeLimit, setTopicTimeLimit] = useState(5);
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
    const normalizedTimeLimit = Math.min(60, Math.max(1, Number(topicTimeLimit) || 5));

    if (!nextTitle) {
      setTopicError("Название обязательно.");
      return;
    }

    setTopicError("");
    const nextDescription = topicDescription.trim();
    addTopic(nextTitle, nextDescription, normalizedTimeLimit);
    showToast("Тема добавлена");
    setTopicTitle("");
    setTopicDescription("");
    setTopicTimeLimit(5);
  };

  const handleEditClick = (topicId) => {
    navigate(`${ADMIN_PATH}/topics/${topicId}`);
  };

  const handleLogoutAdmin = () => {
    logoutAdmin();
    logout();
    navigate("/", { replace: true });
  };

  const showToast = (message, bg = "success") => {
    setToastState({ show: true, message, bg });
  };

  if (!isAdminAuthed) {
    return (
      <Container fluid className="admin-login-screen">
        <Card className="shadow-lg admin-login-card">
          <CardBody>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-shield-lock-fill text-primary" aria-hidden="true" />
              <CardTitle className="fs-3 mb-0">Админ-кабинет</CardTitle>
            </div>
            <CardSubtitle className="text-muted mb-4">
              Введите пароль администратора, чтобы управлять темами.
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
      </Container>
    );
  }

  return (
    <Container fluid className="page-section">
      <div className="page-wrap">
        <Card className="shadow-lg page-card admin-card">
          <CardBody>
            <AdminHeader onLogout={handleLogoutAdmin} />

            <TopicListHeader total={stats.totalTopics} />

            <AdminTopicList topics={topics} onEditTopic={handleEditClick} />

            <AdminAddTopicForm
              topicTitle={topicTitle}
              topicDescription={topicDescription}
              onChangeTitle={setTopicTitle}
              onChangeDescription={setTopicDescription}
              timeLimit={topicTimeLimit}
              onChangeTimeLimit={setTopicTimeLimit}
              onSubmit={handleCreateTopic}
              topicError={topicError}
            />
          </CardBody>
        </Card>
      </div>

      <AppToast
        show={toastState.show}
        message={toastState.message}
        onClose={() => setToastState((prev) => ({ ...prev, show: false }))}
        bg={toastState.bg}
      />
    </Container>
  );
};

export { AdminScreen };
