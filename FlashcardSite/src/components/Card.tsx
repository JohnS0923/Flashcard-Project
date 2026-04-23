import "./Card.css";
interface Props {
  id: number;
  title: string;
  count: number;
  owner: string;
  type: string;
  onClick: (setId: number) => void;
}
function CardList({ id, title, count, owner, type, onClick }: Props) {
  return (
    <>
      <div
        className="col-sm-2  mb-3 mb-sm-3 card-container"
        onClick={() => onClick(id)}
      >
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{type + " Count:" + count}</p>
            <p className="card-text">{"Created by:" + owner}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CardList;
