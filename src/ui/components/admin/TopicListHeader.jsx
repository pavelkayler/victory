import Button from "react-bootstrap/Button";
import CardTitle from "react-bootstrap/CardTitle";

const TopicListHeader = ({ total, onExportClick, onImportClick }) => {
  return (
    <div className="admin-topic-list-header">
      <CardTitle as="h3" className="fs-5 mb-0">
        Список тем (всего: {total})
      </CardTitle>
      <div className="admin-topic-list-header__actions">
        <Button
          variant="outline-primary"
          type="button"
          aria-label="Экспорт тем"
          onClick={onExportClick}
          className="admin-topic-list-header__btn"
        >
          <i className="bi bi-download" aria-hidden="true" />
        </Button>
        <Button
          variant="outline-primary"
          type="button"
          aria-label="Импорт тем"
          onClick={onImportClick}
          className="admin-topic-list-header__btn"
        >
          <i className="bi bi-upload" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

export { TopicListHeader };
