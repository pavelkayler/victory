import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../../core/context/Context.jsx";
import "./Ques.css";

const SUBJECT = "Инженерная графика";

const QUESTION_PAIRS = [
  {
    id: "ig-1",
    question:
      "Какая система проекций применяется при выполнении чертежей в машиностроении по ГОСТ?",
    answer: "Прямоугольная система проекций",
  },
  {
    id: "ig-2",
    question:
      "Как обозначается масштаб изображения, если предмет показан в половинном размере?",
    answer: "1:2",
  },
  {
    id: "ig-3",
    question: "Какая линия используется для контуров видимых элементов детали?",
    answer: "Сплошная толстая основная линия",
  },
  {
    id: "ig-4",
    question: "Какая линия показывает невидимые контуры предмета?",
    answer: "Штриховая линия",
  },
  {
    id: "ig-5",
    question:
      "Какой шрифт требуется для надписей на чертежах согласно ГОСТ 2.304?",
    answer: "Стандартный без засечек тип Б",
  },
  {
    id: "ig-6",
    question:
      "Как называется изображение, получаемое мысленным рассечением детали плоскостью и удалением одной части?",
    answer: "Разрез",
  },
  {
    id: "ig-7",
    question:
      "Как называется изображение, отображающее форму фигуры в плоскости сечения?",
    answer: "Сечение",
  },
  {
    id: "ig-8",
    question:
      "Как называется комбинация вида и разреза для симметричных деталей, где половина заменена разрезом?",
    answer: "Полуразрез",
  },
  {
    id: "ig-9",
    question:
      "Какая линия применяется для обозначения осей симметрии и центров отверстий?",
    answer: "Штрихпунктирная тонкая линия",
  },
  {
    id: "ig-10",
    question: "Какой формат имеет размеры 297×210 мм?",
    answer: "Формат A4",
  },
  {
    id: "ig-11",
    question:
      "Как называется основная подпись на поле чертежа, содержащая данные об изделии?",
    answer: "Основная надпись",
  },
  {
    id: "ig-12",
    question: "Какой знак ставят перед размером диаметра отверстия?",
    answer: "Знак диаметра ⌀",
  },
  {
    id: "ig-13",
    question: "Как обозначается радиус скругления на чертеже?",
    answer: "Буква R перед размером",
  },
  {
    id: "ig-14",
    question:
      "Какой элемент размерной цепи показывает величину измеряемого отрезка?",
    answer: "Размерная линия",
  },
  {
    id: "ig-15",
    question:
      "Как называется вспомогательная тонкая линия, на концах которой стоят стрелки размерной линии?",
    answer: "Выносная линия",
  },
  {
    id: "ig-16",
    question:
      "Как обозначается шероховатость поверхности без удаления материала?",
    answer: "Знак в виде треугольника без горизонтальной полки",
  },
  {
    id: "ig-17",
    question:
      "Как обозначается шероховатость поверхности с обязательной обработкой?",
    answer: "Знак шероховатости с горизонтальной полкой",
  },
  {
    id: "ig-18",
    question: "Как называется упрощённое изображение резьбы на чертеже?",
    answer: "Условное изображение резьбы",
  },
  {
    id: "ig-19",
    question:
      "Какой документ сопровождает сборочный чертёж и перечисляет входящие детали?",
    answer: "Спецификация",
  },
  {
    id: "ig-20",
    question: "Какая проекция используется для изображения вида слева?",
    answer: "Профильная проекция",
  },
];

const shuffle = (items) => {
  const buffer = [...items];

  for (let index = buffer.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [buffer[index], buffer[randomIndex]] = [buffer[randomIndex], buffer[index]];
  }

  return buffer;
};

const Ques = () => {
  const { email, addResult } = useContext(Context);
  const navigate = useNavigate();

  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [answersOrder] = useState(() => shuffle(QUESTION_PAIRS));
  const [isLocked, setIsLocked] = useState(false);
  const resetTimerRef = useRef(null);

  useEffect(() => {
    if (!selectedQuestionId || !selectedAnswerId || isLocked) {
      return undefined;
    }

    const isCorrect = selectedQuestionId === selectedAnswerId;
    setFeedback({
      questionId: selectedQuestionId,
      answerId: selectedAnswerId,
      isCorrect,
    });
    setIsLocked(true);
    setAttempts((previous) => previous + 1);

    if (isCorrect) {
      setScore((previous) => previous + 1);
    }

    resetTimerRef.current = setTimeout(() => {
      setFeedback(null);
      setSelectedQuestionId(null);
      setSelectedAnswerId(null);
      setIsLocked(false);
    }, 1200);

    return undefined;
  }, [selectedQuestionId, selectedAnswerId, isLocked]);

  useEffect(() => () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }
  }, []);

  const greetingName = email || "Участник";

  const handleQuestionSelect = (id) => {
    if (isLocked) {
      return;
    }

    setSelectedQuestionId((previous) => (previous === id ? null : id));
  };

  const handleAnswerSelect = (id) => {
    if (isLocked) {
      return;
    }

    setSelectedAnswerId((previous) => (previous === id ? null : id));
  };

  const handleFinish = () => {
    addResult({
      user: email || "Гость",
      score,
      total: QUESTION_PAIRS.length,
      subject: SUBJECT,
      date: new Date().toISOString().slice(0, 10),
    });
    navigate("/results");
  };

  const handleLogout = () => {
    navigate("/");
  };

  const getStatus = (id, type) => {
    if (feedback) {
      const isMatch =
        (type === "question" && feedback.questionId === id) ||
        (type === "answer" && feedback.answerId === id);

      if (isMatch) {
        return feedback.isCorrect ? "correct" : "incorrect";
      }
    }

    if (type === "question" && selectedQuestionId === id) {
      return "selected";
    }

    if (type === "answer" && selectedAnswerId === id) {
      return "selected";
    }

    return "idle";
  };

  const correctLabel = (() => {
    const mod10 = score % 10;
    const mod100 = score % 100;

    if (mod10 === 1 && mod100 !== 11) {
      return "совпадение";
    }

    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
      return "совпадения";
    }

    return "совпадений";
  })();

  return (
    <div className="match-quiz">
      <div className="match-quiz__card">
        <header className="match-quiz__header">
          <div className="match-quiz__header-meta">
            <p className="match-quiz__greeting">Здравствуйте, {greetingName}</p>
            <h1 className="match-quiz__title">Вопросы по теме &laquo;{SUBJECT}&raquo;</h1>
          </div>
          <div className="match-quiz__header-actions">
            <button type="button" className="match-quiz__link" onClick={handleLogout}>
              Выйти
            </button>
            <Link className="match-quiz__link" to="/admin">
              Администрирование
            </Link>
          </div>
        </header>

        <section className="match-quiz__stats">
          <div className="match-quiz__stat">
            <span className="match-quiz__stat-value">{score}</span>
            <span className="match-quiz__stat-label">{correctLabel}</span>
          </div>
          <div className="match-quiz__stat">
            <span className="match-quiz__stat-value">{attempts}</span>
            <span className="match-quiz__stat-label">попыток</span>
          </div>
          <button type="button" className="match-quiz__finish" onClick={handleFinish}>
            Завершить и сохранить результат
          </button>
        </section>

        <section className="match-quiz__body">
          <div className="match-quiz__column">
            <h2 className="match-quiz__column-title">Вопросы</h2>
            <div className="match-quiz__list" role="list">
              {QUESTION_PAIRS.map((item) => {
                const status = getStatus(item.id, "question");

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`match-quiz__item match-quiz__item--${status}`}
                    onClick={() => handleQuestionSelect(item.id)}
                    aria-pressed={selectedQuestionId === item.id}
                  >
                    <span className="match-quiz__indicator" aria-hidden="true" />
                    <span className="match-quiz__item-text">{item.question}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="match-quiz__column">
            <h2 className="match-quiz__column-title">Ответы</h2>
            <div className="match-quiz__list" role="list">
              {answersOrder.map((item) => {
                const status = getStatus(item.id, "answer");

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`match-quiz__item match-quiz__item--${status}`}
                    onClick={() => handleAnswerSelect(item.id)}
                    aria-pressed={selectedAnswerId === item.id}
                  >
                    <span className="match-quiz__indicator" aria-hidden="true" />
                    <span className="match-quiz__item-text">{item.answer}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="match-quiz__footer">
          <Link className="match-quiz__results-link" to="/results">
            Перейти к результатам студентов
          </Link>
        </footer>
      </div>
    </div>
  );
};

export { Ques };
