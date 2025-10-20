import { Link } from "react-router-dom";
import "./AdminPage.css";

const ADMIN_TESTS = [
  {
    subject: "Инженерная графика",
    tests: [
      {
        id: "ig-2024-03-19",
        date: "2024-03-19",
        title: "Тест от 19.03.2024",
        notes: "20 вопросов по основам выполнения чертежей по ГОСТ",
      },
      {
        id: "ig-2024-04-09",
        date: "2024-04-09",
        title: "Тест от 09.04.2024",
        notes: "Материалы по условным обозначениям и штриховкам",
      },
    ],
  },
  {
    subject: "Сопротивление материалов",
    tests: [
      {
        id: "sopromat-2024-03-28",
        date: "2024-03-28",
        title: "Тест от 28.03.2024",
        notes: "Базовые определения и формулы для растяжения-сжатия",
      },
    ],
  },
];

const formatDate = (date) => {
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

const AdminPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-card">
        <header className="admin-header">
          <h1 className="admin-title">Администрирование тестов</h1>
          <p className="admin-helper">
            Выберите предмет и дату, чтобы отредактировать вопросы и ответы для
            соответствующего теста.
          </p>
        </header>

        <div className="admin-content">
          {ADMIN_TESTS.map((section) => (
            <section key={section.subject} className="admin-section">
              <h2 className="admin-section-title">{section.subject}</h2>
              <div className="admin-tests-grid">
                {section.tests.map((test) => (
                  <article key={test.id} className="admin-test-card">
                    <header className="admin-test-header">
                      <span className="admin-test-date">{formatDate(test.date)}</span>
                      <h3 className="admin-test-title">{test.title}</h3>
                    </header>
                    <p className="admin-test-notes">{test.notes}</p>
                    <div className="admin-test-actions">
                      <button type="button" className="admin-button">
                        Редактировать вопросы
                      </button>
                      <button type="button" className="admin-button admin-button--secondary">
                        Обновить ответы
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="admin-footer">
          <Link to="/main" className="admin-link">
            Вернуться к тесту
          </Link>
          <Link to="/results" className="admin-link">
            Посмотреть результаты студентов
          </Link>
        </footer>
      </div>
    </div>
  );
};

export { AdminPage };
