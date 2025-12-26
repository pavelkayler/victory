import { useContext } from "react";
import { ListGroupItem } from "react-bootstrap";

import { QuizContext } from "../../../../core/context/Context.jsx";

const QuizColumns = ({ hasStarted }) => {
  const {
    leftItems,
    rightItems,
    currentPrompt,
    feedback,
    isRunning,
    isQuizFinished,
    handleItemClick,
  } = useContext(QuizContext);

  const renderItem = (item, side) => {
    const isPromptItem =
      currentPrompt && currentPrompt.itemId === item.id;

    const isFeedbackItem =
      feedback &&
      feedback.side === side &&
      feedback.itemId === item.id;

    let variant;

    if (isFeedbackItem) {
      variant = feedback.result === "correct" ? "success" : "danger";
    } else if (isPromptItem) {
      variant = "success";
    } else {
      variant = undefined;
    }

    const handleClick = () => {
      if (!isQuizFinished && isRunning && hasStarted) {
        handleItemClick(side, item.id);
      }
    };

    const text = hasStarted ? item.text : "";
    const textClass = hasStarted
      ? "quiz-text-visible"
      : "quiz-text-hidden";

    const isLeft = side === "left";
    const matchSideClass = isLeft ? "match-card--left" : "match-card--right";

    return (
      <ListGroupItem
        key={item.id}
        variant={variant}
        className={`quiz-item ${isLeft ? "quiz-item-left" : "quiz-item-right"} ${matchSideClass}`}
        onClick={handleClick}
      >
        <span className={`quiz-text ${isLeft ? "text-end" : "text-start"} ${textClass}`}>
          {text}
        </span>
      </ListGroupItem>
    );
  };

  const pairCount = Math.max(leftItems.length, rightItems.length);
  const pairedRows = Array.from({ length: pairCount }, (_, index) => ({
    left: leftItems[index],
    right: rightItems[index],
  }));

  return (
    <div className={`quiz-columns ${hasStarted ? "is-visible" : ""}`}>
      <div className="quiz-grid shadow-sm">
        {pairedRows.map((pair, index) => (
          <div className="quiz-grid-row" key={pair.left?.id ?? pair.right?.id ?? index}>
            <div className="quiz-grid-cell">
              {pair.left && renderItem(pair.left, "left")}
            </div>
            <div className="quiz-grid-cell">
              {pair.right && renderItem(pair.right, "right")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { QuizColumns };
