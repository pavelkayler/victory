/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "react-bootstrap";

import { QuizContext } from "../../core/context/Context.jsx";
import { useAuthGuard } from "../../core/hooks/useAuthGuard.js";
import { QuizHeader } from "../components/quiz/header/QuizHeader.jsx";
import { QuizColumns } from "../components/quiz/questions/QuizColumns.jsx";
import { ScoreBurst } from "../components/quiz/effects/ScoreBurst.jsx";
import { ComboBurst } from "../components/quiz/effects/ComboBurst.jsx";

const QuizScreen = () => {
  const {
    score,
    streak,
    isQuizFinished,
    sessionId,
    completedSessionId,
    startCountdown,
    finishQuiz,
    wasStarted,
    isRunning,
    countdown,
    timeLeft,
    errorsCount,
  } = useContext(QuizContext);

  useAuthGuard();
  const navigate = useNavigate();

  useEffect(() => {
    if (isQuizFinished && completedSessionId === sessionId) {
      navigate("/result");
    }
  }, [completedSessionId, isQuizFinished, navigate, sessionId]);

  const wasStartedRef = useRef(wasStarted);
  const isRunningRef = useRef(isRunning);
  const isQuizFinishedRef = useRef(isQuizFinished);

  useEffect(() => {
    wasStartedRef.current = wasStarted;
  }, [wasStarted]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    isQuizFinishedRef.current = isQuizFinished;
  }, [isQuizFinished]);

  useEffect(() => {
    return () => {
      if (
        wasStartedRef.current &&
        isRunningRef.current &&
        !isQuizFinishedRef.current
      ) {
        finishQuiz();
      }
    };
  }, [finishQuiz]);

  const handleStart = () => {
    startCountdown();
  };

  const [showBurst, setShowBurst] = useState(false);
  const prevScoreRef = useRef(score);
  const [showCombo, setShowCombo] = useState(false);
  const prevStreakRef = useRef(streak);
  const [isScrolled, setIsScrolled] = useState(false);
  const isCounting = countdown !== null;
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

  const overlayTimerText = isCounting ? countdownText ?? timerText : timerText;
  const showOverlayStats = wasStarted && !isQuizFinished;

  useEffect(() => {
    if (score > prevScoreRef.current) {
      setShowBurst(true);
      const timeoutId = setTimeout(() => {
        setShowBurst(false);
      }, 600);
      prevScoreRef.current = score;
      return () => clearTimeout(timeoutId);
    }

    prevScoreRef.current = score;
    return undefined;
  }, [score]);

  useEffect(() => {
    const prevStreak = prevStreakRef.current;

    if (streak >= 3 && streak > prevStreak) {
      setShowCombo(true);
      const timeoutId = setTimeout(() => setShowCombo(false), 600);
      prevStreakRef.current = streak;
      return () => clearTimeout(timeoutId);
    }

    if (streak < 3) {
      setShowCombo(false);
    }

    prevStreakRef.current = streak;
    return undefined;
  }, [streak]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showIntroCard = !wasStarted;

  return (
    <Container fluid className="py-4 px-2 px-md-4 quiz-container quiz-page">
      <Row>
        <Col xs={12}>
          <Card className="shadow-sm page-card quiz-card">
            <CardBody className="quiz-body">
              <ScoreBurst visible={showBurst && streak < 3} />
              <ComboBurst streak={streak} visible={showCombo} />

              <div className={`quiz-stage ${isScrolled ? "is-scrolled" : ""}`}>
                {showOverlayStats && (
                  <div className="quiz-overlay-bar">
                    <div className="quiz-stats quiz-stats--overlay gap-2">
                      <div
                        className={`quiz-timer flex-shrink-0 ${isCounting ? "is-counting" : ""}`}
                        aria-live="polite"
                      >
                        <span className="fw-semibold">{overlayTimerText}</span>
                      </div>
                      <div className="quiz-scoreboard quiz-scoreboard--compact d-flex flex-nowrap align-items-center justify-content-center gap-2 flex-grow-1">
                        <div className="quiz-score quiz-score--ok flex-shrink-1">
                          <span className="quiz-score__value">{score}</span>
                        </div>
                        <div className="quiz-score quiz-score--bad flex-shrink-1">
                          <span className="quiz-score__value">{errorsCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <QuizColumns hasStarted={wasStarted} />

                <QuizHeader
                  countdown={countdown}
                  onStart={handleStart}
                  isFadingOut={wasStarted && countdown === null}
                  showIntroCard={showIntroCard}
                  hasStarted={wasStarted}
                />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export { QuizScreen };
