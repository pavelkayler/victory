import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const HeaderShell = ({ children, className = "" }) => {
  return (
    <Navbar
      bg="white"
      variant="light"
      expand="md"
      className={`mb-2 shadow-sm app-navbar user-header ${className}`.trim()}
    >
      <Container fluid className="w-100">{children}</Container>
    </Navbar>
  );
};

export { HeaderShell };
