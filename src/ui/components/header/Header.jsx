import { useContext, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Container, Button } from "react-bootstrap";

import { AdminContext, QuizContext, UserContext } from "../../../core/context/Context.jsx";
import { UserBar } from "../userBar/UserBar.jsx";

const Header = () => {
  const location = useLocation();
  const { isAuth, userName } = useContext(UserContext);
  const { isAdminAuthed, logoutAdmin } = useContext(AdminContext);
  const {
    topic,
    timeLeft,
    isRunning,
    isQuizFinished,
    wasStarted,
    countdown,
    finishQuiz,
    resetTopic,
    score,
    errorsCount,
  } = useContext(QuizContext);

  const isQuizPage = location.pathname === "/quiz";
  const isTopicsPage = location.pathname === "/topics";
  const isHistoryPage = location.pathname === "/history";
  const isAdminPage = location.pathname.startsWith("/qques");

  const timerText = useMemo(() => {
    const safeSeconds = Math.max(0, timeLeft ?? 0);
    const minutes = Math.floor(safeSeconds / 60);
    const restSeconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(
      2,
      "0",
    )}`;
  }, [timeLeft]);

  const countdownText = useMemo(() => {
    if (countdown === null) {
      return null;
    }

    return countdown === 0 ? "Старт" : String(countdown);
  }, [countdown]);

  useEffect(() => {
    if (!isAdminAuthed) {
      return;
    }

    if (!location.pathname.startsWith("/qques")) {
      logoutAdmin();
    }
  }, [isAdminAuthed, location.pathname, logoutAdmin]);

  if (!isAuth) {
    return null;
  }

  const handleTopicClick = () => {
    resetTopic();
  };

  const showQuizControls = isQuizPage && wasStarted && !isQuizFinished;
  const isCountdownActive = countdownText !== null;
  const showUserHeaderBar = !showQuizControls && !isAdminPage && Boolean(userName);

  return (
    <Navbar
      bg="white"
      variant="light"
      expand="md"
      className="mb-2 shadow-sm app-navbar user-header"
    >
      <Container fluid>
        {showQuizControls ? (
          <div className="quiz-top-bar">
            <div className={`quiz-timer ${isCountdownActive ? "is-counting" : ""}`} aria-live="polite">
              <i className="bi bi-stopwatch me-2 text-warning" />
              <span className="fw-semibold">{isCountdownActive ? countdownText : timerText}</span>
            </div>

            <div className="quiz-scoreboard" aria-label="Счёт">
              <div className="quiz-score quiz-score--ok" title="Верно">
                <span className="quiz-score__value">{score}</span>
              </div>
              <div className="quiz-score quiz-score--bad" title="Ошибки">
                <span className="quiz-score__value">{errorsCount}</span>
              </div>
            </div>

            <Button
              variant="outline-danger"
              className="header-finish-btn"
              type="button"
              onClick={finishQuiz}
              disabled={!isRunning}
            >
              Завершить
            </Button>
          </div>
        ) : (
          <div className="header-grid header-grid--compact">
            <Navbar.Brand
              as={Link}
              to="/topics"
              onClick={handleTopicClick}
              className="brand-topic header-grid__brand"
            >
              {isTopicsPage || isHistoryPage ? "Выбор темы" : topic?.title || "Тема"}
            </Navbar.Brand>

            <div className="header-grid__actions">
              {showUserHeaderBar && <UserBar />}
              <Button
                variant="outline-primary"
                className="nav-pill-btn"
                as={Link}
                to={isHistoryPage ? "/topics" : "/history"}
                type="button"
              >
                {isHistoryPage ? "Пройти тест" : "История"}
              </Button>
            </div>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export { Header };
