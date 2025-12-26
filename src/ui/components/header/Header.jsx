import { useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { AdminContext, QuizContext, UserContext } from "../../../core/context/Context.jsx";
import { ADMIN_PATH } from "../../../core/constants/paths.js";
import { QuizTopBar } from "../quiz/header/QuizTopBar.jsx";
import { HeaderShell } from "./HeaderShell.jsx";
import { UserHeader } from "./UserHeader.jsx";

const Header = () => {
  const location = useLocation();
  const { isAuth, userName, logout } = useContext(UserContext);
  const { isAdminAuthed } = useContext(AdminContext);
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
  const isHistoryPage = location.pathname === "/history";
  const isAdminPage = location.pathname.startsWith(ADMIN_PATH);

  const timerText = useMemo(() => {
    const safeSeconds = Math.max(0, timeLeft ?? 0);
    const minutes = Math.floor(safeSeconds / 60);
    const restSeconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
  }, [timeLeft]);

  const countdownText = useMemo(() => {
    if (countdown === null) {
      return null;
    }

    return countdown === 0 ? "Старт" : String(countdown);
  }, [countdown]);

  if (!isAuth || isAdminAuthed || isAdminPage) {
    return null;
  }

  const displayName = userName?.trim() || "Пользователь";
  const showQuizControls = isQuizPage && wasStarted && !isQuizFinished;
  const showUserRow = Boolean(displayName);
  const isCounting = countdownText !== null;

  if (showQuizControls) {
    return (
      <HeaderShell>
        <QuizTopBar
          timerText={isCounting ? countdownText ?? timerText : timerText}
          isCounting={isCounting}
          score={score}
          errorsCount={errorsCount}
          onFinish={finishQuiz}
          isRunning={isRunning}
        />
      </HeaderShell>
    );
  }

  return (
    <UserHeader
      onTopicClick={resetTopic}
      isHistoryPage={isHistoryPage}
      displayName={displayName}
      onLogout={logout}
      showUserRow={showUserRow}
    />
  );
};

export { Header };
