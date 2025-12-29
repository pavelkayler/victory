import { memo } from "react";

import { AttemptCard } from "./AttemptCard.jsx";

const HistoryAttemptList = ({ attempts, formatDate, formatDuration }) => {
  if (attempts.length === 0) {
    return <p className="mb-0 history-attempts-section">Пока нет ни одной попытки.</p>;
  }

  return (
    <div className="history-grid history-attempts-section">
      {attempts.map((attempt) => (
        <AttemptCard
          key={attempt.id}
          attempt={attempt}
          formatDate={formatDate}
          formatDuration={formatDuration}
        />
      ))}
    </div>
  );
};

const HistoryAttemptListMemo = memo(HistoryAttemptList);

export { HistoryAttemptListMemo as HistoryAttemptList };
