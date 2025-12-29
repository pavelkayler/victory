import { memo } from "react";

const AttemptCard = ({ attempt, formatDate, formatDuration }) => {
  return (
    <div className="history-card" key={attempt.id}>
      <div className="history-card__header">
        <div className="history-topic-block">
          <span className="history-topic">
            {attempt.topicTitle || "Выбранная тема"}
          </span>
          <span className="history-date">{formatDate(attempt.date)}</span>
        </div>
      </div>

      <div className="history-stats">
        <div className="history-stat history-stat--time">
          <span className="history-stat__label">Время</span>
          <span className="history-stat__value">
            <i className="bi bi-stopwatch text-warning" />
            {formatDuration(attempt.durationSec)}
          </span>
        </div>

        <div className="history-stat history-stat--combo">
          <span className="history-stat__label">Комбо</span>
          <span className="history-stat__value">
            <i className="bi bi-fire" />
            {attempt.streak ?? "-"}
          </span>
        </div>

        <div className="history-stat history-stat--success">
          <span className="history-stat__label">Верно</span>
          <span className="history-stat__value">
            <i className="bi bi-check-circle-fill" />
            {attempt.correct}
          </span>
        </div>

        <div className="history-stat history-stat--danger">
          <span className="history-stat__label">Ошибок</span>
          <span className="history-stat__value">
            <i className="bi bi-x-circle-fill" />
            {attempt.wrong}
          </span>
        </div>
      </div>
    </div>
  );
};

const AttemptCardMemo = memo(AttemptCard);

export { AttemptCardMemo as AttemptCard };
