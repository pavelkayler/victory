import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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
import {
  normalizeImportedTopic,
  prepareTopicsForAppend,
  createTopicsExportBlob,
} from "../../core/utils/importExportTopics.js";
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

  const showToast = useCallback((message, bg = "success") => {
    setToastState({ show: true, message, bg });
  }, []);

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

  const handlePasswordSubmit = useCallback((event) => {
    event.preventDefault();
    const isValid = authorize(password);

    if (!isValid) {
      setPasswordError("Неверный пароль. Попробуйте ещё раз.");
      return;
    }

    setPasswordError("");
    setPassword("");
  }, [authorize, password]);

  const handleCreateTopic = useCallback((event) => {
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
  }, [addTopic, showToast, topicDescription, topicTimeLimit, topicTitle]);

  const handleEditClick = useCallback((topicId) => {
    navigate(`${ADMIN_PATH}/topics/${topicId}`);
  }, [navigate]);

  const handleExportTopics = useCallback(() => {
    const blob = createTopicsExportBlob(topics);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "topics-export.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("Экспорт выполнен");
  }, [showToast, topics]);

  const handleCloseImportModal = useCallback(() => {
    setIsImportModalOpen(false);
    setImportError("");
    setSelectedImportFile(null);
    if (importInputRef.current) {
      importInputRef.current.value = "";
    }
  }, []);

  const handleImportTopics = useCallback(async (file, mode) => {
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
        const preparedTopics = prepareTopicsForAppend(normalizedTopics, topics);
        appendTopics(preparedTopics);
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
  }, [appendTopics, handleCloseImportModal, replaceTopics, showToast, topics]);

  const handleImportChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSelectedImportFile(file);
    setImportError("");
  }, []);

  const handleFilePickerClick = useCallback(() => {
    importInputRef.current?.click();
  }, []);

  const handleOpenImportModal = useCallback(() => {
    setImportError("");
    setSelectedImportFile(null);
    setImportMode("append");
    setIsImportModalOpen(true);
    if (importInputRef.current) {
      importInputRef.current.value = "";
    }
  }, []);

  const handleConfirmImport = useCallback(async () => {
    if (!selectedImportFile) {
      setImportError("Выберите файл для импорта.");
      return;
    }

    await handleImportTopics(selectedImportFile, importMode);
  }, [handleImportTopics, importMode, selectedImportFile]);

  const handleLogoutAdmin = useCallback(() => {
    logoutAdmin();
    logout();
    navigate("/", { replace: true });
  }, [logout, logoutAdmin, navigate]);

  const handleToastClose = useCallback(() => {
    setToastState((prev) => ({ ...prev, show: false }));
  }, []);

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
        onClose={handleToastClose}
        bg={toastState.bg}
      />
    </Container>
  );
};

export { AdminScreen };
