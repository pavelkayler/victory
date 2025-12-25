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

const Topics = () => {
  const { initQuiz } = useContext(QuizContext);
  const { topics } = useContext(TopicsContext);
  const navigate = useNavigate();

  useAuthGuard();

  const handleSelect = (topic) => () => {
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
              topics.map((topic) => (
                <Card key={topic.id} className="mb-3 border-primary">
                  <CardBody>
                    <CardTitle className="fs-5 mb-2 d-flex align-items-start gap-2">
                      <i className="bi bi-book-half text-primary" aria-hidden="true" />
                      <span>{topic.title}</span>
                    </CardTitle>
                    <CardText className="mb-3 text-muted">
                      {topic.description}
                    </CardText>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={handleSelect(topic)}
                    >
                      Выбрать тему
                    </Button>
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

export { Topics };
