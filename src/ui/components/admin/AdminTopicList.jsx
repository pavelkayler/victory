import { memo } from "react";
import { Card, CardBody, Stack } from "react-bootstrap";

import { AdminTopicCard } from "./AdminTopicCard.jsx";

const AdminTopicList = ({ topics, onEditTopic }) => {
  if (topics.length === 0) {
    return (
      <Card className="border-0 bg-light-subtle admin-form-card mb-4">
        <CardBody>
          <div className="text-muted">
            Тем пока нет. Создайте первую тему через форму ниже.
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="border-0 mb-4">
      <CardBody>
        <Stack gap={3} className="admin-topics-list">
          {topics.map((topic) => (
            <AdminTopicCard key={topic.id} topic={topic} onEdit={onEditTopic} />
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
};

const AdminTopicListMemo = memo(AdminTopicList);

export { AdminTopicListMemo as AdminTopicList };
