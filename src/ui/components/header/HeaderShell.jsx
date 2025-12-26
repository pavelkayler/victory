import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const HeaderShell = ({ children }) => {
  return (
    <Navbar bg="white" variant="light" expand="md" className="mb-2 shadow-sm app-navbar user-header">
      <Container fluid>{children}</Container>
    </Navbar>
  );
};

export { HeaderShell };
