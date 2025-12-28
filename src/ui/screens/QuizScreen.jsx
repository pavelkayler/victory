/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useRef, useState } from "react";
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

  const showIntroCard = !wasStarted;

  return (
    <Container fluid className="py-4 px-2 px-md-4 quiz-container quiz-page">
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

export { QuizScreen };
