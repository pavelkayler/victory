import { Col, FormLabel, FormSelect, Row } from "react-bootstrap";

const HistoryFilter = ({ selectedTopicId, topics, onChange }) => {
  return (
    <Row className="gy-2 gx-3 align-items-center">
      <Col xs={12} className="history-filter-wrap">
        <FormLabel className="fw-semibold d-block mb-1">Фильтр по теме</FormLabel>
        <FormSelect
          className="w-100 mt-2"
          value={selectedTopicId}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="all">Все темы</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.title}
            </option>
          ))}
        </FormSelect>
      </Col>
    </Row>
  );
};

export { HistoryFilter };
