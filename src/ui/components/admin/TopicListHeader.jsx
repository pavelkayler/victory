import { memo } from "react";
import Button from "react-bootstrap/Button";
import CardTitle from "react-bootstrap/CardTitle";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const TopicListHeader = ({ total, onExportClick, onImportClick }) => {
  return (
    <div className="admin-topic-list-header">
      <CardTitle as="h3" className="fs-5 mb-0">
        Список тем (всего: {total})
      </CardTitle>
      <div className="admin-topic-list-header__actions">
        <div className="admin-topic-list-header__item">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="export-topics-tooltip">Экспорт</Tooltip>}
          >
            <Button
              variant="outline-primary"
              type="button"
              aria-label="Экспорт тем"
              onClick={onExportClick}
              className="admin-topic-list-header__btn"
            >
              <i className="bi bi-box-arrow-down" aria-hidden="true" />
            </Button>
          </OverlayTrigger>
          <span className="admin-topic-list-header__hint">экспорт</span>
        </div>
        <div className="admin-topic-list-header__item">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="import-topics-tooltip">Импорт</Tooltip>}
          >
            <Button
              variant="outline-primary"
              type="button"
              aria-label="Импорт тем"
              onClick={onImportClick}
              className="admin-topic-list-header__btn"
            >
              <i className="bi bi-cloud-arrow-up" aria-hidden="true" />
            </Button>
          </OverlayTrigger>
          <span className="admin-topic-list-header__hint">импорт</span>
        </div>
      </div>
    </div>
  );
};

const TopicListHeaderMemo = memo(TopicListHeader);

export { TopicListHeaderMemo as TopicListHeader };
