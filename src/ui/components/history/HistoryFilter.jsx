import { memo, useCallback } from "react";
import Col from "react-bootstrap/Col";
import FormLabel from "react-bootstrap/FormLabel";
import FormSelect from "react-bootstrap/FormSelect";
import Row from "react-bootstrap/Row";

const HistoryFilterComponent = ({ selectedTopicId, topics, onChange }) => {
  const handleChange = useCallback((event) => {
    onChange(event.target.value);
  }, [onChange]);

  return (
    <Row className="gy-2 gx-3 align-items-center mb-3">
      <Col xs={12} className="history-filter-wrap">
        <FormLabel className="fw-semibold d-block mb-2">Фильтр по теме</FormLabel>
        <FormSelect
          className="w-100"
          value={selectedTopicId}
          onChange={handleChange}
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

const HistoryFilter = memo(HistoryFilterComponent);

export { HistoryFilter };
