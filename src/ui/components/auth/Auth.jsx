import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, CardTitle, Form, FormGroup, FormLabel, FormControl, Button } from "react-bootstrap";

import { UserContext } from "../../../core/context/Context.jsx";

const Auth = () => {
  const { isAuth, login } = useContext(UserContext);

  const [name, setName] = useState("");
  const navigate = useNavigate();

  if (isAuth) {
    return <Navigate to="/topics" replace />;
  }

  const handleLogin = (event) => {
    event.preventDefault();
    const trimmed = name.trim();

    login(trimmed);
    navigate("/topics");
  };

  return (
    <Container fluid className="auth-screen">
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={8} xl={6}>
          <Card className="shadow-lg page-card w-100">
            <CardBody>
              <CardTitle className="mb-4 text-center fs-3">Вход в систему</CardTitle>

              <Form onSubmit={handleLogin}>
                <FormGroup controlId="userName" className="mb-3">
                  <FormLabel>Имя пользователя</FormLabel>
                  <FormControl
                    type="text"
                    placeholder="Введите имя"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </FormGroup>

                <div className="d-flex justify-content-center">
                  <Button variant="primary" type="submit">
                    Войти
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export { Auth };
