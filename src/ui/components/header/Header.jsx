import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { AdminContext, QuizContext, UserContext } from "../../../core/context/Context.jsx";
import { ADMIN_PATH } from "../../../core/constants/paths.js";
import { QuizOverlayBar, QuizTopBar } from "../quiz/header/QuizTopBar.jsx";
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
  const topBarRef = useRef(null);
  const [isTopBarVisible, setIsTopBarVisible] = useState(true);

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

  const displayName = userName?.trim() || "Пользователь";
  const showQuizControls = isQuizPage && wasStarted && !isQuizFinished;
  const isCounting = countdownText !== null;
  const showOverlayBar = showQuizControls && isRunning && !isTopBarVisible;
  const showUserRow = Boolean(displayName);

  useEffect(() => {
    if (!showQuizControls) {
      return;
    }

    const observed = topBarRef.current;
    if (!observed || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsTopBarVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );

    observer.observe(observed);

    return () => observer.disconnect();
  }, [showQuizControls]);

  if (!isAuth || isAdminAuthed || isAdminPage) {
    return null;
  }

  if (showQuizControls) {
    return (
      <>
        <HeaderShell>
          <div ref={topBarRef}>
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

        {showOverlayBar && (
          <QuizOverlayBar
            timerText={timerText}
            isCounting={isCounting}
            score={score}
            errorsCount={errorsCount}
          />
        )}
      </>
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
