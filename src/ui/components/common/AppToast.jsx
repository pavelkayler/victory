import { Toast, ToastBody, ToastContainer } from "react-bootstrap";

const AppToast = ({ show, message, onClose, delay = 2800, bg = "success" }) => {
  return (
    <ToastContainer position="bottom-center" className="mb-3">
      <Toast bg={bg} onClose={onClose} show={show} delay={delay} autohide>
        <ToastBody className="text-white">{message}</ToastBody>
      </Toast>
    </ToastContainer>
  );
};

export { AppToast };
