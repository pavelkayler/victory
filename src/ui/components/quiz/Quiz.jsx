import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, CardBody } from "react-bootstrap";

import { QuizContext } from "../../../core/context/Context.jsx";
import { useAuthGuard } from "../../../core/hooks/useAuthGuard.js";
import { QuizHeader } from "./header/QuizHeader.jsx";
import { QuizColumns } from "./questions/QuizColumns.jsx";
import { ScoreBurst } from "./effects/ScoreBurst.jsx";
import { ComboBurst } from "./effects/ComboBurst.jsx";

const Quiz = () => {
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
  } = useContext(QuizContext);

  useAuthGuard();
  const navigate = useNavigate();

  // при завершении квиза — на результат
  useEffect(() => {
    if (isQuizFinished && completedSessionId === sessionId) {
      navigate("/result");
    }
  }, [completedSessionId, isQuizFinished, navigate, sessionId]);

  // храним актуальные значения флагов в ref,
  // чтобы корректно завершать тест только при размонтировании компонента
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

  // авто-завершение при уходе со страницы квиза (unmount)
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

  // локальное состояние для "Начать" + отсчёт
  const handleStart = () => {
    startCountdown();
  };

  // анимация "+1" по изменению score
  const [showBurst, setShowBurst] = useState(false);
  const prevScoreRef = useRef(score);
  const [showCombo, setShowCombo] = useState(false);
  const prevStreakRef = useRef(streak);

  useEffect(() => {
    if (score > prevScoreRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  // вспышка комбо только на рост серии, а не постоянно
  useEffect(() => {
    const prevStreak = prevStreakRef.current;

    if (streak >= 3 && streak > prevStreak) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const showIntroCard = !wasStarted;

  return (
    <Container fluid className="py-4 px-2 px-md-4 quiz-container">
      <Row>
        <Col xs={12}>
          <Card className="shadow-sm page-card quiz-card">
            <CardBody className="quiz-body">
              <ScoreBurst visible={showBurst && streak < 3} />
              <ComboBurst streak={streak} visible={showCombo} />

              <div className="quiz-stage">
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

export { Quiz };
