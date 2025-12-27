import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

const QuizStats = ({ timerText, isCounting, score, errorsCount, variant = "default" }) => {
  return (
    <Stack
      direction="horizontal"
      gap={2}
      className={`quiz-stats flex-nowrap w-100 ${variant === "overlay" ? "quiz-stats--overlay" : ""}`}
    >
      <div
        className={`quiz-timer flex-shrink-0 ${isCounting ? "is-counting" : ""} ${variant === "overlay" ? "quiz-timer--compact" : ""}`}
        aria-live="polite"
      >
        <span className="fw-semibold">{timerText}</span>
      </div>

      <div
        className={`quiz-scoreboard d-flex flex-nowrap align-items-center justify-content-center gap-2 flex-grow-1 ${variant === "overlay" ? "quiz-scoreboard--compact" : ""}`}
      >
        <div className="quiz-score quiz-score--ok flex-shrink-1">
          <span className="quiz-score__value">{score}</span>
        </div>
        <div className="quiz-score quiz-score--bad flex-shrink-1">
          <span className="quiz-score__value">{errorsCount}</span>
        </div>
      </div>
    </Stack>
  );
};

const QuizTopBar = ({
  timerText,
  isCounting,
  score,
  errorsCount,
  onFinish,
  isRunning,
}) => {
  return (
    <div className="quiz-top-bar d-flex flex-nowrap align-items-center gap-2 w-100">
      <QuizStats
        timerText={timerText}
        isCounting={isCounting}
        score={score}
        errorsCount={errorsCount}
      />

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
  );
};

const QuizOverlayBar = ({
  timerText,
  isCounting,
  score,
  errorsCount,
}) => {
  return (
    <div className="quiz-overlay-bar">
      <QuizStats
        timerText={timerText}
        isCounting={isCounting}
        score={score}
        errorsCount={errorsCount}
        variant="overlay"
      />
    </div>
  );
};

export { QuizOverlayBar, QuizStats, QuizTopBar };
