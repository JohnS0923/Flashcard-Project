import { useState } from "react";
import "./Flashcard.css";
import axios from "axios";

interface Props {
  id: number;
  front: string;
  back: string;
  starred?: boolean;
  edit?: boolean;
  newSetCard?: boolean;
  editView?: boolean;
  updateCardText?: (
    cardId: number,
    updatedFront: string,
    updatedBack: string
  ) => void;
  deleteCardFromList?: (cardId: number) => void;
}
function Flashcard({
  id,
  front,
  back,
  starred,
  edit = false,
  editView = false,
  newSetCard = false,
  updateCardText,
  deleteCardFromList,
}: Props) {
  const [editMode, setEditMode] = useState(edit);
  const [isStarred, setIsStarred] = useState(starred);
  const [backText, setBackText] = useState(back);
  const [frontText, setFrontText] = useState(front);
  const deleteCard = () => {
    axios
      .post("https://localhost:7119/Flashcard/DeleteCard?cardId=" + id)
      .then((res) => {
        console.log(res.data);
        console.log("Card deleted successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const saveText = () => {
    setEditMode(!editMode);

    axios
      .post("https://localhost:7119/Flashcard/EditCard", {
        cardId: id,
        cardFront: frontText,
        cardBack: backText,
        starred: isStarred,
      })
      .then((res) => {
        setIsStarred(res.data.card.starred);
        setFrontText(res.data.card.cardFront);
        setBackText(res.data.card.cardBack);
        console.log(frontText);
        console.log(res.data.card);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFrontTextChange = (newFrontText: string) => {
    setFrontText(newFrontText);
    // Call the callback function to update cardsList
    updateCardText && updateCardText(id, newFrontText, backText);
  };

  const handleBackTextChange = (newBackText: string) => {
    setBackText(newBackText);
    // Call the callback function to update cardsList
    updateCardText && updateCardText(id, frontText, newBackText);
  };

  const deleteCardInList = () => {
    deleteCardFromList && deleteCardFromList(id);
  };
  return (
    <>
      <div className="flashcard">
        {editMode ? (
          <>
            <input
              type="text"
              value={frontText}
              onChange={(e) => handleFrontTextChange(e.target.value)}
            />
          </>
        ) : (
          <p className="front">{frontText}</p>
        )}

        {editMode ? (
          <>
            <input
              type="text"
              value={backText}
              onChange={(e) => handleBackTextChange(e.target.value)}
            />
          </>
        ) : (
          <p className="back">{backText}</p>
        )}

        <div className="option">
          {editMode ? (
            <>
              {newSetCard ? (
                <div className="trash-container">
                  <i
                    className="fa-solid fa-trash"
                    onClick={() => deleteCardInList()}
                  ></i>
                </div>
              ) : (
                <div>
                  <div className="trash-container">
                    <i
                      className="fa-solid fa-trash"
                      onClick={() => deleteCard()}
                    ></i>
                  </div>
                  <button onClick={() => saveText()}>Save</button>
                </div>
              )}
            </>
          ) : editView ? (
            <button onClick={() => setEditMode(!editMode)}>
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default Flashcard;
