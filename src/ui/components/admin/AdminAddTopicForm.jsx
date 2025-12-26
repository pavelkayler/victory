import { Button, Card, CardBody, CardTitle, Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";

const AdminAddTopicForm = ({ topicTitle, topicDescription, onChangeTitle, onChangeDescription, onSubmit, topicError }) => {
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
