// src/ui/components/quiz/header/QuizHeader.jsx
import { useContext } from "react";
import { Button } from "react-bootstrap";

import { QuizContext } from "../../../../core/context/Context.jsx";

const QuizHeader = ({
  hasStarted,
  countdown,
  onStart,
  isFadingOut,
  showIntroCard,
}) => {
  const { currentPrompt, topic, startError } = useContext(QuizContext);

  const centerText = !hasStarted && currentPrompt ? currentPrompt.text : "";
  const titleText = topic?.title || "Подборка вопросов";
  const subtitleText = topic?.description
    || "Сопоставьте карточки, чтобы начать тренировку.";

  const shouldRender = showIntroCard && !hasStarted;

  return (
    <div className={`quiz-header ${isFadingOut ? "is-fading" : ""}`}>
      {shouldRender && (
        <div className="prompt-card">
          <p className="prompt-subtitle">{titleText}</p>
          <p className="prompt-description">{subtitleText}</p>
          <div className="prompt-word">
            {centerText || "Нажмите \"Начать\""}
          </div>

          <div className="prompt-actions">
            <Button
              variant="primary"
              size="lg"
              type="button"
              onClick={onStart}
              disabled={countdown !== null}
            >
              Начать
            </Button>
            {startError && (
              <p className="text-danger small mt-2 mb-0 text-center w-100">
                {startError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { QuizHeader };
