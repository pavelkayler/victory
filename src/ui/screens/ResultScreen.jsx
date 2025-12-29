import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Container,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";

import { QuizContext } from "../../core/context/Context.jsx";
import { useAuthGuard } from "../../core/hooks/useAuthGuard.js";

const ResultScreen = () => {
  const { score, errorsCount, initQuiz, isQuizFinished } = useContext(QuizContext);

  const navigate = useNavigate();

  useAuthGuard();

  useEffect(() => {
    if (!isQuizFinished) {
      navigate("/quiz", { replace: true });
    }
  }, [isQuizFinished, navigate]);

  const handleRestart = () => {
    initQuiz();
    navigate("/quiz");
  };

  return (
    <Container fluid className="page-section">
      <div className="page-wrap">
        <div className="d-flex flex-column gap-4">
          <Card className="shadow-sm page-card text-center">
            <CardBody>
              <CardTitle className="fs-3 mb-3">
                <i className="bi bi-trophy-fill me-2 text-warning" />Результат
              </CardTitle>
              <CardText className="fs-5 mb-2">
                Правильных ответов: {score}
              </CardText>
              <CardText className="mb-4">
                Неправильных ответов: {errorsCount}
              </CardText>
              <Button
                variant="success"
                type="button"
                onClick={handleRestart}
              >
                Пройти снова
              </Button>
            </CardBody>
          </Card>

          {/* <Card className="shadow-sm page-card">
            <CardBody>
              <CardTitle className="fs-4 mb-3">
                Вопросы и ответы викторины
              </CardTitle>

              <ListGroup>
                {questions.map((pair) => (
                  <ListGroupItem key={pair.id} className="mb-2">
                    <div className="fw-semibold mb-1">
                      {pair.left}
                    </div>
                    <div>{pair.right}</div>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card> */}
        </div>
      </div>
    </Container>
  );
};

export { ResultScreen };
