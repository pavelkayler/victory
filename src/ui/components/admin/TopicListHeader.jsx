import { CardTitle } from "react-bootstrap";

const TopicListHeader = ({ total }) => {
  return (
    <CardTitle as="h3" className="fs-5 mb-3">
      Список тем (всего: {total})
    </CardTitle>
  );
};

export { TopicListHeader };
