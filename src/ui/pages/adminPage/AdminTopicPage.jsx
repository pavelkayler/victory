import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
  Form,
  Row,
  Stack,
} from "react-bootstrap";

import { TopicsContext } from "../../../core/context/Context.jsx";
import { useAdminGuard } from "../../../core/hooks/useAdminGuard.js";

const AdminTopicPage = () => {
  const { topicId } = useParams();
  const { getTopicById, updateQuestion, addQuestion } = useContext(TopicsContext);
  const location = useLocation();
  const isAllowed = useAdminGuard();

  const topic = useMemo(() => getTopicById(topicId), [getTopicById, topicId]);
  const [questions, setQuestions] = useState(topic?.questions ?? []);
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    setQuestions(topic?.questions ?? []);
  }, [topic]);

  useEffect(() => {
    if (location.state?.highlightQuestionId) {
      setHighlightedId(location.state.highlightQuestionId);
    }
  }, [location.state]);

  useEffect(() => {
    if (highlightedId === null) {
      return undefined;
    }

    const timeoutId = setTimeout(() => setHighlightedId(null), 1600);
    return () => clearTimeout(timeoutId);
  }, [highlightedId]);

  const handleFieldChange = (questionId, field) => (event) => {
    const value = event.target.value;
    setQuestions((prev) =>
      prev.map((question) =>
        question.id === questionId ? { ...question, [field]: value } : question,
      ),
    );
    if (topic) {
      updateQuestion(topic.id, questionId, { [field]: value });
    }
  };

  const handleAddQuestion = () => {
    if (!topic) {
      return;
    }
    const newQuestion = addQuestion(topic.id, { left: "", right: "" });
    if (newQuestion) {
      setQuestions((prev) => [...prev, newQuestion]);
      setHighlightedId(newQuestion.id);
    }
  };

  if (!isAllowed) {
    return null;
  }

  if (!topic) {
    return (
      <div className="app-shell">
        <Container className="py-5">
          <Card className="shadow-sm page-card p-4">
            <CardBody>
              <CardTitle className="fs-4">Тема не найдена</CardTitle>
              <CardSubtitle className="text-muted mb-4">
                Проверьте ссылку или вернитесь на список тем.
              </CardSubtitle>
              <Button as={Link} to="/qques" variant="primary">
                Назад к темам
              </Button>
            </CardBody>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Container className="py-4">
        <Row className="mb-3 align-items-center">
          <Col>
            <Button as={Link} to="/qques" variant="outline-primary">
              <i className="bi bi-arrow-left-short me-2" aria-hidden="true" />
              К списку тем
            </Button>
          </Col>
        </Row>

        <Card className="shadow-sm page-card p-4">
          <CardBody>
            <div className="d-flex align-items-start gap-3 mb-2 flex-wrap">
              <CardTitle className="fs-3 mb-0">{topic.title}</CardTitle>
              <Badge bg="light" text="dark" className="align-self-center">
                <i className="bi bi-list-check me-1" aria-hidden="true" />
                {questions.length} вопросов
              </Badge>
            </div>
            <CardSubtitle className="text-muted mb-4">
              Редактируйте карточки. Изменения сохраняются мгновенно.
            </CardSubtitle>

            <Stack gap={3} className="admin-questions-list">
              {questions.length === 0 && (
                <Alert variant="info" className="mb-0">
                  В этой теме ещё нет вопросов. Добавьте первый!
                </Alert>
              )}

              {questions.map((question) => (
                <Card
                  key={question.id}
                  className={`admin-question-card ${highlightedId === question.id ? "is-highlighted" : ""}`}
                >
                  <CardBody>
                    <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                      <span className="fw-semibold">
                        №{question.id.toString().padStart(2, "0")}
                      </span>
                    </div>

                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group controlId={`question-left-${question.id}`}>
                          <Form.Label>Левая колонка</Form.Label>
                          <Form.Control
                            type="text"
                            value={question.left}
                            placeholder="Фраза или вопрос"
                            onChange={handleFieldChange(question.id, "left")}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId={`question-right-${question.id}`}>
                          <Form.Label>Правая колонка</Form.Label>
                          <Form.Control
                            type="text"
                            value={question.right}
                            placeholder="Ответ или соответствие"
                            onChange={handleFieldChange(question.id, "right")}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              ))}
            </Stack>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="success" onClick={handleAddQuestion}>
                <i className="bi bi-plus-lg me-2" aria-hidden="true" />
                Добавить вопрос
              </Button>
            </div>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default AdminTopicPage;
