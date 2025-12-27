import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CardBody from "react-bootstrap/CardBody";
import CardTitle from "react-bootstrap/CardTitle";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import FormLabel from "react-bootstrap/FormLabel";

const AdminAddTopicForm = ({
  topicTitle,
  topicDescription,
  timeLimit,
  onChangeTitle,
  onChangeDescription,
  onChangeTimeLimit,
  onSubmit,
  topicError,
}) => {
  return (
    <Card className="border-0 bg-light-subtle admin-form-card">
      <CardBody>
        <CardTitle className="fs-5 mb-3">Добавить новую тему</CardTitle>
        <Form onSubmit={onSubmit}>
          <FormGroup controlId="topicTitle" className="mb-3">
            <FormLabel>Название</FormLabel>
            <FormControl
              type="text"
              value={topicTitle}
              onChange={(event) => onChangeTitle(event.target.value)}
              placeholder='Например, "JavaScript"'
              required
            />
          </FormGroup>

          <FormGroup controlId="topicDescription" className="mb-3">
            <FormLabel>Описание</FormLabel>
            <FormControl
              as="textarea"
              rows={3}
              value={topicDescription}
              onChange={(event) => onChangeDescription(event.target.value)}
              placeholder="Кратко о теме"
            />
          </FormGroup>

          <FormGroup controlId="topicTimeLimit" className="mb-3">
            <FormLabel>Время (минуты)</FormLabel>
            <FormControl
              type="number"
              min={1}
              max={60}
              value={timeLimit}
              onChange={(event) => onChangeTimeLimit(event.target.value)}
              placeholder="5"
            />
          </FormGroup>

          {topicError && (
            <div className="text-warning mb-3">{topicError}</div>
          )}

          <Button variant="success" type="submit" className="w-100">
            Добавить тему
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export { AdminAddTopicForm };
