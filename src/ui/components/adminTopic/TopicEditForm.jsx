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
  return (
    <Row className="mt-2">
      <FormGroup controlId="topicTitleEdit" className="mb-2">
        <FormLabel className="fw-semibold">Название темы</FormLabel>
        <FormControl
          as="textarea"
          rows={2}
          value={titleDraft}
          onChange={(event) => onChangeTitle(event.target.value)}
          placeholder="Название темы"
        />
      </FormGroup>
      <FormGroup controlId="topicDescriptionEdit" className="mb-3">
        <FormLabel className="fw-semibold">Описание темы</FormLabel>
        <FormControl
          as="textarea"
          rows={3}
          value={descriptionDraft}
          onChange={(event) => onChangeDescription(event.target.value)}
          placeholder="Описание темы"
        />
      </FormGroup>
    </Row>
  );
};

export { TopicEditForm };
