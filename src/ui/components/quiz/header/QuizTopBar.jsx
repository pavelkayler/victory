import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

const QuizTopBar = ({
  timerText,
  isCounting,
  score,
  errorsCount,
  onFinish,
  isRunning,
}) => {
  const [isScrolled, setIsScrolled] = useState(
    () => (typeof window !== "undefined" ? window.scrollY > 12 : false),
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`quiz-top-bar d-flex flex-nowrap align-items-center gap-2 w-100 ${isScrolled ? "is-scrolled" : ""}`.trim()}>
      <div className="quizbar__timer">
        <div
          className={`quiz-timer flex-shrink-0 ${isCounting ? "is-counting" : ""}`}
          aria-live="polite"
        >
          <span className="fw-semibold">{timerText}</span>
        </div>
      </div>

      <div className="quizbar__stats">
        <div className="quiz-scoreboard d-flex flex-nowrap align-items-center justify-content-center gap-2 flex-grow-1">
          <div className="quiz-score quiz-score--ok flex-shrink-1">
            <span className="quiz-score__value">{score}</span>
          </div>
          <div className="quiz-score quiz-score--bad flex-shrink-1">
            <span className="quiz-score__value">{errorsCount}</span>
          </div>
        </div>
      </div>

      <div className="quizbar__actions">
        <Button
          variant="outline-danger"
          className="header-finish-btn flex-shrink-0"
          type="button"
          onClick={onFinish}
          disabled={!isRunning}
        >
          Завершить
        </Button>
      </div>
    </div>
  );
};

export { QuizTopBar };
