import { AttemptCard } from "./AttemptCard.jsx";

const HistoryAttemptList = ({ attempts, formatDate, formatDuration }) => {
  if (attempts.length === 0) {
    return <p className="mb-0">Пока нет ни одной попытки.</p>;
  }

  return (
    <div className="history-grid">
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

export { HistoryAttemptList };
