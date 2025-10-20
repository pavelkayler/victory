import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../../core/context/Context.jsx";
import "./ResultsPage.css";

const formatDate = (date) => {
  if (!date) {
    return "Без даты";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const normalizeSubject = (subject) => {
  if (typeof subject !== "string") {
    return "Без предмета";
  }

  const trimmed = subject.trim();
  return trimmed.length > 0 ? trimmed : "Без предмета";
};

const formatParticipantsLabel = (value) => {
  const absolute = Math.abs(value);
  const mod100 = absolute % 100;
  const mod10 = absolute % 10;

  if (mod100 >= 11 && mod100 <= 19) {
    return "участников";
  }

  if (mod10 === 1) {
    return "участник";
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return "участника";
  }

  return "участников";
};

const getDateOrder = (date) => {
  if (!date) {
    return -Infinity;
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return -Infinity;
  }

  return parsed.getTime();
};

const ResultsPage = () => {
  const { results } = useContext(Context);

  const groupedResults = useMemo(() => {
    const groups = new Map();

    results.forEach((item) => {
      const subject = normalizeSubject(item.subject);
      if (!groups.has(subject)) {
        groups.set(subject, []);
      }

      groups.get(subject).push(item);
    });

    return Array.from(groups.entries()).map(([subject, items]) => ({
      subject,
      items: [...items].sort((first, second) =>
        getDateOrder(second.date) - getDateOrder(first.date),
      ),
    }));
  }, [results]);

  const totalParticipants = results.length;

  return (
    <div className="results-page">
      <div className="results-card">
        <header className="results-header">
          <div>
            <p className="results-subtitle">Статистика по предметам</p>
            <h1 className="results-title">Результаты прохождения викторин</h1>
            <p className="results-helper">
              Ниже собраны предметы, пользователи, прошедшие тестирование, и
              их результаты.
            </p>
          </div>
        </header>

        <section className="results-overview">
          <div className="results-summary">
            <span className="results-count">{totalParticipants}</span>
            <span className="results-count-label">
              {formatParticipantsLabel(totalParticipants)} завершили тестирование
            </span>
          </div>
        </section>

        <section className="results-groups" aria-live="polite">
          {groupedResults.length > 0 ? (
            groupedResults.map((group) => (
              <article key={group.subject} className="results-group">
                <header className="results-group-header">
                  <h2 className="results-group-title">{group.subject}</h2>
                  <span className="results-group-count">
                    {group.items.length} {formatParticipantsLabel(group.items.length)}
                  </span>
                </header>

                <ul className="results-list">
                  {group.items.map((item) => {
                    const userName = item.user || "Гость";

                    return (
                      <li key={item.id} className="results-list-item">
                        <div className="results-user">
                          <span className="results-avatar" aria-hidden="true">
                            {userName.slice(0, 1).toUpperCase()}
                          </span>
                          <div>
                            <p className="results-user-name">{userName}</p>
                            <p className="results-user-date">{formatDate(item.date)}</p>
                          </div>
                        </div>
                        <div className="results-score" aria-label="Количество правильных угадываний">
                          <span className="results-score-value">{item.score}</span>
                          <span className="results-score-total">из {item.total}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))
          ) : (
            <p className="results-empty">Ещё никто не проходил тесты.</p>
          )}
        </section>

        <footer className="results-footer">
          <Link className="results-link" to="/main">
            Вернуться к тренировке
          </Link>
          <Link className="results-link" to="/admin">
            Открыть страницу администратора
          </Link>
        </footer>
      </div>
    </div>
  );
};

export { ResultsPage };
