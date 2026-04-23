import "./FlippableCard.css";

interface Props {
  frontText?: string;
  backText?: string;
  isFlipped: boolean;
  onFlip: () => void;
}

function FlippableCard({ frontText, backText, isFlipped, onFlip }: Props) {
  return (
    <div className="center">
      <div
        className={`the-card ${isFlipped ? "flipped" : ""}`}
        onClick={onFlip}
      >
        <div className="the-card-inner">
          <div className="the-card-front">
            <p>{frontText}</p>
          </div>
          <div className="the-card-back">
            <p>{backText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlippableCard;
