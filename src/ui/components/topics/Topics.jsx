import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Alert,
} from "react-bootstrap";

import { QuizContext, TopicsContext } from "../../../core/context/Context.jsx";
import { useAuthGuard } from "../../../core/hooks/useAuthGuard.js";
import { MIN_PAIRS } from "../../../core/constants/quiz.js";
import { isQuestionValid } from "../../../core/utils/questions.js";

const Topics = () => {
  const { initQuiz } = useContext(QuizContext);
  const { topics } = useContext(TopicsContext);
  const navigate = useNavigate();

  useAuthGuard();

  const handleSelect = (topic) => () => {
    const validCount = topic.questions.filter(isQuestionValid).length;

    if (validCount < MIN_PAIRS) {
      return;
    }

    initQuiz(topic);
    navigate("/quiz");
  };

  return (
    <Container fluid className="page-section">
      <div className="page-wrap">
        <Card className="shadow-sm page-card">
          <CardBody>
            <CardTitle className="fs-4 mb-3 text-center">
              <i className="bi bi-grid-3x3-gap-fill me-2 text-primary" />
              Выбор темы
            </CardTitle>

            {topics.length === 0 ? (
              <Alert variant="info" className="mb-0">
                Пока нет тем. Добавьте их в админ-кабинете.
              </Alert>
            ) : (
              topics.map((topic) => {
                const validCount = topic.questions.filter(isQuestionValid).length;
                const totalCount = topic.questions.length;
                const canStart = validCount >= MIN_PAIRS;

                return (
                  <Card key={topic.id} className="mb-3 border-primary">
                    <CardBody>
                      <CardTitle className="fs-5 mb-2 d-flex align-items-start gap-2">
                        <i className="bi bi-book-half text-primary" aria-hidden="true" />
                        <span>{topic.title}</span>
                      </CardTitle>
                      <CardText className="mb-3 text-muted">
                        {topic.description}
                      </CardText>
                      <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                        <span className="badge bg-light text-dark">
                          <i className="bi bi-list-check me-1" aria-hidden="true" />
                          {totalCount} вопросов
                        </span>
                      </div>
                      <Button
                        variant="primary"
                        type="button"
                        onClick={handleSelect(topic)}
                        disabled={!canStart}
                      >
                        Пройти тест
                      </Button>
                      {!canStart && (
                        <CardText className="text-danger small mt-2 mb-0">
                          Нужно минимум {MIN_PAIRS} заполненных вопросов для старта.
                        </CardText>
                      )}
                    </CardBody>
                  </Card>
                );
              })
            )}
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};

export { Topics };
