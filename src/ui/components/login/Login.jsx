import { useContext, useState } from "react";
import { Context } from "../../../core/context/Context.jsx";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const DEMO_EMAIL = "admin@admin.ru";
const DEMO_PASSWORD = "admin";

const Login = () => {
  const { email, setEmail, password, setPassword } = useContext(Context);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const resetError = () => {
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    setEmail(trimmedEmail);
    setPassword(trimmedPassword);

    if (trimmedEmail === DEMO_EMAIL && trimmedPassword === DEMO_PASSWORD) {
      navigate("/main");
    } else {
      setError("Неверный логин или пароль");
    }
  };

  const handlePrefill = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    resetError();
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={5} xl={4}>
            <Card className="shadow-lg border-0 login-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <span className="brand-title">Victory Quiz</span>
                  <h1 className="h3 fw-bold mt-3">Войдите, чтобы начать игру</h1>
                  <p className="login-helper">
                    Используйте демо-аккаунт или введите собственные данные, чтобы
                    попасть на страницу викторины.
                  </p>
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4" data-testid="login-error">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className="login-form-label">Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      autoComplete="email"
                      onChange={(event) => {
                        resetError();
                        setEmail(event.target.value);
                      }}
                      className="login-form-control"
                      isInvalid={Boolean(error)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Пожалуйста, введите корректный email.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label className="login-form-label">Пароль</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Введите пароль"
                      value={password}
                      autoComplete="current-password"
                      onChange={(event) => {
                        resetError();
                        setPassword(event.target.value);
                      }}
                      className="login-form-control"
                      isInvalid={Boolean(error)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Не забудьте указать пароль.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="login-actions d-grid gap-2">
                    <Button variant="primary" type="submit" size="lg">
                      Начать викторину
                    </Button>
                    <Button
                      variant="outline-secondary"
                      type="button"
                      size="lg"
                      onClick={handlePrefill}
                    >
                      Заполнить демо-данные
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export { Login };
