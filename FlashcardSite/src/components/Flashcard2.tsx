import { useState, useEffect } from "react";
import "./Flashcard.css";
import axios from "axios";

interface Props {
  id: number;
  front: string;
  back: string;
  starred?: boolean;
  edit?: boolean;
  onChange?: () => void;
}

function Flashcard2({
  id,
  front,
  back,
  starred,
  edit = false,
  onChange,
}: Props) {
  const [isStarred, setIsStarred] = useState(starred);
  const [backText, setBackText] = useState(back);
  const [frontText, setFrontText] = useState(front);

  const deleteCard = () => {
    axios
      .post("https://localhost:7119/Flashcard/DeleteCard?cardId=" + id)
      .then((res) => {
        console.log(res.data);
        console.log("Card deleted successfully");
        if (onChange) {
          onChange();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const saveText = () => {
    axios
      .post("https://localhost:7119/Flashcard/EditCard", {
        cardId: id,
        cardFront: frontText,
        cardBack: backText,
        starred: isStarred,
      })
      .then(() => {
        console.log("saved card successfully");
        if (onChange) {
          onChange();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    // This effect will run whenever frontText, backText, or isStarred changes
    saveText();
  }, [frontText, backText, isStarred]);

  return (
    <div className="flashcard">
      {edit ? (
        <>
          <input
            type="text"
            value={frontText}
            onChange={(e) => setFrontText(e.target.value)}
          />
        </>
      ) : (
        <p className="front">{frontText}</p>
      )}

      {edit ? (
        <>
          <input
            type="text"
            value={backText}
            onChange={(e) => setBackText(e.target.value)}
          />
        </>
      ) : (
        <p className="back">{backText}</p>
      )}

      <div className="option">
        {edit ? (
          <div className="trash-container">
            <i className="fa-solid fa-trash" onClick={() => deleteCard()}></i>
          </div> // {/* <button onClick={() => saveText()}>Save</button> */}
        ) : starred ? (
          <i
            className="fa-solid fa-star"
            onClick={() => setIsStarred(false)}
          ></i>
        ) : (
          <i
            className="fa-regular fa-star"
            onClick={() => setIsStarred(true)}
          ></i>
        )}
      </div>
    </div>
  );
}

export default Flashcard2;
