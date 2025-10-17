import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

const Ques = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Container>
      <h1>WELCOME</h1>
      <p>Вы успешно вошли в систему</p>
      <Button variant="secondary" color="primary" onClick={handleLogout}>
        EXIT
      </Button>
    </Container>


  );
};

export { Ques };