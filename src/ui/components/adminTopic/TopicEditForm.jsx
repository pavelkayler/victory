import { useEffect, useRef } from "react";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";
import Row from "react-bootstrap/Row";

const TopicEditForm = ({
  titleDraft,
  descriptionDraft,
  onChangeTitle,
  onChangeDescription,
}) => {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const autoResize = (element) => {
    if (!element) {
      return;
    }
    element.style.height = "auto";
    element.style.overflow = "hidden";
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    autoResize(titleRef.current);
  }, [titleDraft]);

  useEffect(() => {
    autoResize(descriptionRef.current);
  }, [descriptionDraft]);

  return (
    <Row className="mt-2">
      <FormGroup controlId="topicTitleEdit" className="mb-2">
        <FormLabel className="fw-semibold">Название темы</FormLabel>
        <FormControl
          as="textarea"
          rows={2}
          ref={titleRef}
          value={titleDraft}
          onChange={(event) => onChangeTitle(event.target.value)}
          placeholder="Название темы"
          className="auto-resize-textarea"
        />
      </FormGroup>
      <FormGroup controlId="topicDescriptionEdit" className="mb-3">
        <FormLabel className="fw-semibold">Описание темы</FormLabel>
        <FormControl
          as="textarea"
          rows={3}
          ref={descriptionRef}
          value={descriptionDraft}
          onChange={(event) => onChangeDescription(event.target.value)}
          placeholder="Описание темы"
          className="auto-resize-textarea"
        />
      </FormGroup>
    </Row>
  );
};

export { TopicEditForm };
