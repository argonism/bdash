import React from "react";
import classNames from "classnames";
import { remote } from "electron";
import { QueryType } from "../../../lib/Database/Query";

type Props = {
  readonly queries: QueryType[];
  readonly selectedQueryId: number | null;
  readonly onAddQuery: () => void;
  readonly onSelectQuery: (query: QueryType) => void;
  readonly onDuplicateQuery: (query: QueryType) => void;
  readonly onDeleteQuery: (queryId: number) => void;
};

const QueryList: React.FC<Props> = ({
  queries,
  selectedQueryId,
  onAddQuery,
  onSelectQuery,
  onDuplicateQuery,
  onDeleteQuery,
}) => {
  const handleClickNew = onAddQuery;

  const handleClickItem = onSelectQuery;

  const handleContextMenu = (query: QueryType): void => {
    onSelectQuery(query);
    setImmediate(() => {
      const menu = remote.Menu.buildFromTemplate([
        {
          label: "Duplicate",
          click: (): void => {
            onDuplicateQuery(query);
          },
        },
        {
          label: "Delete",
          click: (): void => {
            if (window.confirm("Are you sure?")) {
              onDeleteQuery(query.id);
            }
          },
        },
      ]);
      menu.popup({ window: remote.getCurrentWindow() });
    });
  };

  const items = queries.map((query) => {
    const className = classNames({
      "is-selected": selectedQueryId === query.id,
    });
    return (
      <li
        key={query.id}
        className={className}
        onClick={(): void => handleClickItem(query)}
        onContextMenu={(): void => handleContextMenu(query)}
      >
        <div className="QueryList-item">
          <div className="QueryList-item-title">{query.title}</div>
          <div className="QueryList-item-subtitle">{query.body.replace(/\s{2,}/g, " ").substring(0, 50)}</div>
          <div className="QueryList-item-time">{query.createdAt.format("YYYY-MM-DD")}</div>
        </div>
      </li>
    );
  });

  return (
    <div className="QueryList">
      <div className={classNames("QueryList-new", { darwin: process.platform === "darwin" })}>
        <i className="fas fa-plus" onClick={handleClickNew} />
      </div>
      <ul className="QueryList-list">{items}</ul>
    </div>
  );
};

export default QueryList;
