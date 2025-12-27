import Toast from "react-bootstrap/Toast";
import ToastBody from "react-bootstrap/ToastBody";
import ToastContainer from "react-bootstrap/ToastContainer";

const AppToast = ({ show, message, onClose, delay = 2800, bg = "success" }) => {
  return (
    <ToastContainer
      position="bottom-center"
      className="app-toast-container position-fixed"
    >
      <Toast bg={bg} onClose={onClose} show={show} delay={delay} autohide>
        <ToastBody className="text-white">{message}</ToastBody>
      </Toast>
    </ToastContainer>
  );
};

export { AppToast };
