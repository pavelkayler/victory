import { useCallback, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/CardBody";
import CardText from "react-bootstrap/CardText";
import CardTitle from "react-bootstrap/CardTitle";
import Container from "react-bootstrap/Container";

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

  const availableTopics = useMemo(() => {
    return topics
      .map((topic) => {
        const validQuestions = topic.questions.filter(isQuestionValid);
        const validCount = validQuestions.length;
        const totalCount = topic.questions.length;
        const canStart = validCount >= MIN_PAIRS;
        const badgeText = `${totalCount} ${pluralRu(totalCount, ["вопрос", "вопроса", "вопросов"])}`;
        const timeLimitText = `${topic.timeLimitMin ?? 5} минут`;

        return {
          topic,
          validCount,
          totalCount,
          canStart,
          badgeText,
          timeLimitText,
        };
      })
      .filter((item) => item.validCount >= MIN_PAIRS);
  }, [topics]);

  const handleSelect = useCallback((topicId) => {
    const selected = availableTopics.find((item) => item.topic.id === topicId);
    if (!selected) {
      return;
    }

    initQuiz(selected.topic);
    navigate("/quiz");
  }, [availableTopics, initQuiz, navigate]);

  const handleSelectClick = useCallback((event) => {
    const topicId = event.currentTarget.dataset.topicId;
    if (!topicId) {
      return;
    }

    handleSelect(topicId);
  }, [handleSelect]);

  return (
    <Container fluid className="page-section">
      <div className="page-wrap">
        <Card className="shadow-sm page-card">
          <CardBody>
            <CardTitle className="fs-4 mb-3 text-center">
              <i className="bi bi-grid-3x3-gap-fill me-2 text-primary" />
              Выбор темы
            </CardTitle>

            {availableTopics.length === 0 ? (
              <Card className="border-0 bg-light-subtle mb-0">
                <CardBody>
                  <div className="text-muted">Пока нет доступных тем. Добавьте их в админ-кабинете.</div>
                </CardBody>
              </Card>
            ) : (
              availableTopics.map(({ topic, badgeText, timeLimitText, canStart }) => (
                <Card key={topic.id} className="mb-3 border-primary">
                  <CardBody>
                    <CardTitle className="fs-5 mb-2">
                      <div className="topic-card-header">
                        <div className="topic-card-title d-flex align-items-start gap-2">
                          <i className="bi bi-book-half text-primary" aria-hidden="true" />
                          <span className="text-break">{topic.title}</span>
                        </div>
                        <div className="topic-card-meta">
                          <Badge bg="light" text="dark" className="fw-semibold topic-meta-badge topic-card-timer">
                            {timeLimitText}
                          </Badge>
                          <Badge bg="light" text="dark" className="fw-semibold topic-meta-badge topic-card-count">
                            {badgeText}
                          </Badge>
                        </div>
                      </div>
                    </CardTitle>
                    <CardText className="mb-3 text-muted">
                      {topic.description}
                    </CardText>
                    <div className="topic-card-actions d-flex gap-2 align-items-center topic-card-actions-row">
                      <Button
                        variant="primary"
                        type="button"
                        data-topic-id={topic.id}
                        onClick={handleSelectClick}
                        disabled={!canStart}
                      >
                        Пройти тест
                      </Button>
                      <Button
                        variant="outline-secondary"
                        as={Link}
                        to={`/rating/${topic.id}`}
                        type="button"
                        className="topic-card-rating"
                      >
                        Рейтинг
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};

export { TopicsScreen };
