import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import FormSelect from "react-bootstrap/FormSelect";
import Modal from "react-bootstrap/Modal";
import ModalBody from "react-bootstrap/ModalBody";
import ModalFooter from "react-bootstrap/ModalFooter";
import ModalHeader from "react-bootstrap/ModalHeader";
import ModalTitle from "react-bootstrap/ModalTitle";

import { AdminContext, TopicsContext, UserContext } from "../../core/context/Context.jsx";
import { ADMIN_PATH } from "../../core/constants/paths.js";
import { AppToast } from "../components/common/AppToast.jsx";
import { AdminHeader } from "../components/admin/AdminHeader.jsx";
import { TopicListHeader } from "../components/admin/TopicListHeader.jsx";
import { AdminTopicList } from "../components/admin/AdminTopicList.jsx";
import { AdminAddTopicForm } from "../components/admin/AdminAddTopicForm.jsx";

const AdminScreen = () => {
  const { isAdminAuthed, authorize, logoutAdmin } = useContext(AdminContext);
  const { topics, addTopic, replaceTopics, appendTopics } = useContext(TopicsContext);
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const importInputRef = useRef(null);

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
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importMode, setImportMode] = useState("append");
  const [selectedImportFile, setSelectedImportFile] = useState(null);
  const [importError, setImportError] = useState("");

  const stats = useMemo(() => {
    return {
      totalTopics: topics.length,
    };
  }, [topics]);

  const showToast = (message, bg = "success") => {
    setToastState({ show: true, message, bg });
  };

  useEffect(() => {
    if (location.state?.toastMessage) {
      setToastState({
        show: true,
        message: location.state.toastMessage,
        bg: location.state.toastBg ?? "success",
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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

  const clampTimeLimit = (value) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return 5;
    }

    return Math.min(60, Math.max(1, parsed));
  };

  const normalizeImportedTopic = (topic) => {
    if (!topic || typeof topic !== "object") {
      throw new Error("Некорректная структура темы.");
    }

    const topicId = typeof topic.id === "string" ? topic.id : topic.id?.toString();
    if (!topicId) {
      throw new Error("У темы отсутствует id.");
    }

    if (!Array.isArray(topic.questions)) {
      throw new Error(`У темы "${topic.title || topicId}" отсутствует список вопросов.`);
    }

    if (typeof topic.title !== "string" || topic.title.trim() === "") {
      throw new Error(`У темы "${topicId}" отсутствует название.`);
    }

    if (typeof topic.description !== "string") {
      throw new Error(`У темы "${topicId}" отсутствует описание.`);
    }

    const normalizedQuestions = topic.questions
      .map((question) => {
        if (!question || typeof question !== "object") {
          return null;
        }

        const questionId = Number(question.id);
        if (!Number.isFinite(questionId)) {
          return null;
        }

        return {
          id: questionId,
          left: typeof question.left === "string" ? question.left : "",
          right: typeof question.right === "string" ? question.right : "",
        };
      })
      .filter(Boolean);

    const timeLimitRaw = topic.timeLimitMinutes ?? topic.timeLimitMin ?? topic.timeLimit;
    const timeLimitMin = clampTimeLimit(timeLimitRaw ?? 5);

    if (timeLimitMin === null) {
      throw new Error(`Некорректное время у темы "${topic.title || topicId}".`);
    }

    return {
      id: topicId,
      title: topic.title.trim(),
      description: topic.description,
      timeLimitMin,
      questions: normalizedQuestions,
    };
  };

  const handleExportTopics = () => {
    const payload = { topics };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "topics-export.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Экспорт выполнен");
  };

  const handleImportTopics = async (file, mode) => {
    if (!file) {
      setImportError("Выберите файл для импорта.");
      return;
    }

    setImportError("");
    try {
      const content = await file.text();
      const parsed = JSON.parse(content);
      const rawTopics = Array.isArray(parsed) ? parsed : parsed?.topics;

      if (!Array.isArray(rawTopics)) {
        throw new Error("Неверный формат файла: нет массива тем.");
      }

      const normalizedTopics = rawTopics.map((topic) => normalizeImportedTopic(topic)).filter(Boolean);

      if (normalizedTopics.length === 0) {
        throw new Error("Нет валидных тем для импорта.");
      }

      if (mode === "replace") {
        replaceTopics(normalizedTopics);
      } else {
        // При добавлении обновляем темы с совпадающими id и добавляем новые в конец списка.
        appendTopics(normalizedTopics);
      }

      showToast("Импорт выполнен");
      handleCloseImportModal();
    } catch (error) {
      const message = error.message || "Не удалось импортировать файл";
      setImportError(message);
      showToast(message, "danger");
    } finally {
      if (importInputRef.current) {
        importInputRef.current.value = "";
      }
    }
  };

  const handleImportChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedImportFile(file);
    setImportError("");
  };

  const handleFilePickerClick = () => {
    importInputRef.current?.click();
  };

  const handleOpenImportModal = () => {
    setImportError("");
    setSelectedImportFile(null);
    setImportMode("append");
    setIsImportModalOpen(true);
    if (importInputRef.current) {
      importInputRef.current.value = "";
    }
  };

  const handleCloseImportModal = () => {
    setIsImportModalOpen(false);
    setImportError("");
    setSelectedImportFile(null);
    if (importInputRef.current) {
      importInputRef.current.value = "";
    }
  };

  const handleConfirmImport = async () => {
    if (!selectedImportFile) {
      setImportError("Выберите файл для импорта.");
      return;
    }

    await handleImportTopics(selectedImportFile, importMode);
  };

  const handleLogoutAdmin = () => {
    logoutAdmin();
    logout();
    navigate("/", { replace: true });
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

            <TopicListHeader
              total={stats.totalTopics}
              onExportClick={handleExportTopics}
              onImportClick={handleOpenImportModal}
            />

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

      <FormControl
        type="file"
        accept="application/json"
        ref={importInputRef}
        className="d-none"
        onChange={handleImportChange}
      />

      <Modal show={isImportModalOpen} onHide={handleCloseImportModal} centered>
        <ModalHeader closeButton>
          <ModalTitle>Импорт тем</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="import-modal__file text-center">
            {selectedImportFile ? (
              <div className="import-file-chip">
                <span className="import-file-name">{selectedImportFile.name}</span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  type="button"
                  onClick={handleFilePickerClick}
                >
                  Сменить файл
                </Button>
              </div>
            ) : (
              <Button variant="primary" type="button" onClick={handleFilePickerClick}>
                Загрузить
              </Button>
            )}
          </div>

          <FormGroup controlId="importModeSelect" className="mt-3 mb-0">
            <FormLabel className="fw-semibold small mb-1">Режим импорта</FormLabel>
            <FormSelect
              value={importMode}
              onChange={(event) => setImportMode(event.target.value)}
            >
              <option value="append">Добавить новые темы к имеющимся</option>
              <option value="replace">Заменить имеющиеся темы новыми</option>
            </FormSelect>
          </FormGroup>
          {importError && <div className="text-danger mt-2 small">{importError}</div>}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline-secondary" type="button" onClick={handleCloseImportModal}>
            Отмена
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={handleConfirmImport}
            disabled={!selectedImportFile}
          >
            Импортировать
          </Button>
        </ModalFooter>
      </Modal>

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
