import { useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const isResultPage = location.pathname === "/result";
  const navigate = useNavigate();

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

  const displayName = userName?.trim() || "Пользователь";
  const showQuizControls = isQuizPage && wasStarted && !isQuizFinished;
  const isCounting = countdownText !== null;
  const showUserRow = Boolean(displayName);

  const handleTopicClick = (event) => {
    resetTopic();

    if (isResultPage) {
      event?.preventDefault();
      navigate("/topics", { replace: true });
    }
  };

  if (!isAuth || isAdminAuthed || isAdminPage) {
    return null;
  }

  if (showQuizControls) {
    return (
      <HeaderShell className="quiz-top-bar-shell">
        <div className="quiz-top-bar-wrapper">
          <QuizTopBar
            timerText={isCounting ? countdownText ?? timerText : timerText}
            isCounting={isCounting}
            score={score}
            errorsCount={errorsCount}
            onFinish={finishQuiz}
            isRunning={isRunning}
          />
        </div>
      </HeaderShell>
    );
  }

  return (
    <UserHeader
      onTopicClick={handleTopicClick}
      isHistoryPage={isHistoryPage}
      displayName={displayName}
      onLogout={logout}
      showUserRow={showUserRow}
    />
  );
};

export { Header };
