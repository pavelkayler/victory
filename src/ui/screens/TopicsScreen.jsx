import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Container,
} from "react-bootstrap";

import { QuizContext, TopicsContext } from "../../core/context/Context.jsx";
import { useAuthGuard } from "../../core/hooks/useAuthGuard.js";
import { MIN_PAIRS } from "../../core/constants/quiz.js";
import { isQuestionValid } from "../../core/utils/questions.js";
import { pluralRu } from "../../core/utils/pluralRu.js";

const TopicsScreen = () => {
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
              <Card className="border-0 bg-light-subtle mb-0">
                <CardBody>
                  <div className="text-muted">Пока нет тем. Добавьте их в админ-кабинете.</div>
                </CardBody>
              </Card>
            ) : (
              topics.map((topic) => {
                const validCount = topic.questions.filter(isQuestionValid).length;
                const totalCount = topic.questions.length;
                const canStart = validCount >= MIN_PAIRS;
                const badgeText = `${totalCount} ${pluralRu(totalCount, ["вопрос", "вопроса", "вопросов"])}`;

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
                      <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                        <Badge bg="light" text="dark" className="fw-semibold">
                          {badgeText}
                        </Badge>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="primary"
                          type="button"
                          onClick={handleSelect(topic)}
                          disabled={!canStart}
                        >
                          Пройти тест
                        </Button>
                        <Button
                          variant="outline-secondary"
                          as={Link}
                          to={`/rating/${topic.id}`}
                          type="button"
                        >
                          Рейтинг
                        </Button>
                      </div>
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

export { TopicsScreen };
