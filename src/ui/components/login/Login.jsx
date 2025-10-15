import { useContext, useState } from "react";
import { Context } from "../../../core/context/Context.jsx";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { email, setEmail, password, setPassword } = useContext(Context);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();

    if (email === "admin@admin.ru" && password === "admin") {
      setError("");
      console.log("Login successfull");
      navigate("/main");
    } else {
      setError("Неверный логин или пароль");
    }
    console.log("Login attempt with:", { email, password });
  };

  return (
    <>
      <h1>Login Page</h1>
      <Container>
        <Card>
          <Card.Body>
            <h2>LoginForm</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export { Login };
