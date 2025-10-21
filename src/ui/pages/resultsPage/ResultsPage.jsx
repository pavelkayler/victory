import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../../core/context/Context.jsx";
import "./ResultsPage.css";

const SUBJECT = "Инженерная графика";

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

const ResultsPage = () => {
  const { results } = useContext(Context);

  const subjectResults = useMemo(
    () => results.filter((item) => item.subject === SUBJECT),
    [results],
  );

  return (
    <div className="results-page">
      <div className="results-card">
        <header className="results-header">
          <div>
            <p className="results-subtitle">Статистика по предмету</p>
            <h1 className="results-title">Вопросы по теме &laquo;{SUBJECT}&raquo;</h1>
            <p className="results-helper">
              Ниже собраны пользователи, прошедшие тестирование, и количество
              верных совпадений.
            </p>
          </div>
        </header>

        <section className="results-section">
          <div className="results-summary">
            <span className="results-count">{subjectResults.length}</span>
            <span className="results-count-label">участников завершили тест</span>
          </div>

          <ul className="results-list">
            {subjectResults.map((item) => {
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
                  <div className="results-score" aria-label="Количество совпадений">
                    <span className="results-score-value">{item.score}</span>
                    <span className="results-score-total">из {item.total}</span>
                  </div>
                </li>
              );
            })}
            {subjectResults.length === 0 && (
              <li className="results-empty">Ещё никто не проходил этот тест.</li>
            )}
          </ul>
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
