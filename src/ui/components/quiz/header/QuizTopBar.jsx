import Button from "react-bootstrap/Button";

const QuizTopBar = ({
  timerText,
  isCounting,
  score,
  errorsCount,
  onFinish,
  isRunning,
  isScrolled = false,
}) => {
  return (
    <div className={`quiz-top-bar d-flex flex-nowrap align-items-center gap-2 w-100 ${isScrolled ? "is-scrolled" : ""}`.trim()}>
      <div className="quiz-top-bar__side">
        <div
          className={`quiz-timer flex-shrink-0 ${isCounting ? "is-counting" : ""}`}
          aria-live="polite"
        >
          <span className="fw-semibold">{timerText}</span>
        </div>
      </div>

      <div className="quiz-top-bar__center">
        <div className="quiz-scoreboard d-flex flex-nowrap align-items-center justify-content-center gap-2 flex-grow-1">
          <div className="quiz-score quiz-score--ok flex-shrink-1">
            <span className="quiz-score__value">{score}</span>
          </div>
          <div className="quiz-score quiz-score--bad flex-shrink-1">
            <span className="quiz-score__value">{errorsCount}</span>
          </div>
        </div>
      </div>

      <div className="quiz-top-bar__side quiz-top-bar__side--right">
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
