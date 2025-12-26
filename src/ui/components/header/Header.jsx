import { useContext, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button, Stack } from "react-bootstrap";

import { AdminContext, QuizContext, UserContext } from "../../../core/context/Context.jsx";
import { HeaderShell } from "./HeaderShell.jsx";
import { HeaderNavRow } from "./HeaderNavRow.jsx";
import { HeaderUserRow } from "./HeaderUserRow.jsx";

const Header = () => {
  const location = useLocation();
  const { isAuth, userName, logout } = useContext(UserContext);
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

  const displayName = userName?.trim() || "Пользователь";

  const handleTopicClick = () => {
    resetTopic();
  };

  const handleLogout = () => {
    logout();
  };

  const showQuizControls = isQuizPage && wasStarted && !isQuizFinished;
  const isCountdownActive = countdownText !== null;
  const showUserHeaderBar = !showQuizControls && !isAdminPage && Boolean(userName);

  if (showQuizControls) {
    return (
      <HeaderShell>
        <div className="quiz-top-bar">
          <div className={`quiz-timer ${isCountdownActive ? "is-counting" : ""}`} aria-live="polite">
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
      </HeaderShell>
    );
  }

  return (
    <HeaderShell>
      <div className="w-100">
        <HeaderNavRow
          brandLabel={isTopicsPage || isHistoryPage ? "Выбор темы" : topic?.title || "Тема"}
          isHistoryPage={isHistoryPage}
          onBrandClick={handleTopicClick}
        />

        {showUserHeaderBar && (
          <Stack
            direction="horizontal"
            gap={2}
            className="align-items-center d-none d-md-inline-flex user-header-desktop"
          >
            <div className="d-inline-flex align-items-center gap-2 flex-nowrap">
              <i className="bi bi-person-circle text-primary" aria-hidden="true" />
              <span className="fw-semibold user-name" title={displayName}>
                {displayName}
              </span>
            </div>
            <Button
              variant="outline-danger"
              type="button"
              className="user-logout-btn"
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </Stack>
        )}

        <HeaderUserRow displayName={displayName} onLogout={handleLogout} />
      </div>
    </HeaderShell>
  );
};

export { Header };
