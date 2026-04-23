import { useState, useEffect } from "react";
import Flashcard from "../components/Flashcard";
import { getGlobalVariable } from "../variable/globalVar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function CreateSet() {
  interface Cards {
    cardId: number;
    cardFront: string;
    cardBack: string;
  }
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [cardsList, setCardsList] = useState<Array<Cards>>([
    {
      cardId: 1,
      cardFront: "",
      cardBack: "",
    },
    {
      cardId: 2,
      cardFront: "",
      cardBack: "",
    },
    {
      cardId: 3,
      cardFront: "",
      cardBack: "",
    },
  ]);

  //check for authentication
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const userId = getGlobalVariable();

        if (userId === "0" || userId == null) {
          // User is not authenticated, navigate to the login page
          navigate("/login");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    checkAuthentication();
  }, [navigate]);

  const addSet = () => {
    // console.log({
    //   setTitle: title,
    //   setDescription: desc,
    //   userId: getGlobalVariable(),
    //   cardsList: cardsList,
    // });
    if (title != "" && title != null) {
      const dataToSend = {
        userID: getGlobalVariable(),
        setTitle: title,
        setDescription: desc,
        CardList: cardsList,
      };

      axios
        .post(`${API_BASE_URL}/Flashcard/CreateSetWithCard`, dataToSend)
        .then((res) => {
          console.log(res.data);
          navigate("../");

        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  // update card text in flashcard
  const updateCardText = (
    cardId: number,
    updatedFront: string,
    updatedBack: string
  ) => {
    // Find the card in cardsList and update its text
    const updatedCardsList = cardsList.map((card) =>
      card.cardId === cardId
        ? { ...card, cardFront: updatedFront, cardBack: updatedBack }
        : card
    );

    // Update state with the new cardsList
    setCardsList(updatedCardsList);
  };

  const addCard = () => {
    // Find the maximum cardId in the current cardsList
    const maxCardId = Math.max(...cardsList.map((card) => card.cardId));

    // Create a new card with an incremented cardId
    const newCard: Cards = {
      cardId: maxCardId + 1,
      cardFront: "",
      cardBack: "",
    };
    // Update state with the new cardsList
    setCardsList([...cardsList, newCard]);
  };
  const deleteCard = (cardIdToDelete: number) => {
    // Filter out the card with the specified cardId
    const updatedCardsList = cardsList.filter(
      (card) => card.cardId !== cardIdToDelete
    );

    // Update state with the new cardsList
    setCardsList(updatedCardsList);
  };
  return (
    <>
      <h1 className="center">Create Set</h1>
      <div className="finish-btn">
        <button className="btn btn-primary" onClick={() => addSet()}>
          Finish
        </button>
      </div>
      <div className="set-form">
        <form>
          <div className="mb-3">
            <label htmlFor="setTitle" className="form-label">
              Set Title
            </label>
            <input
              type="text"
              className="form-control"
              id="setTitle"
              aria-describedby="emailHelp"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="setDesc" className="form-label">
              Set Description
            </label>
            <input
              type="text"
              className="form-control"
              id="setDesc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </form>
      </div>
      {cardsList != null
        ? cardsList.map((card) => (
            <Flashcard
              key={card.cardId}
              id={card.cardId}
              front={card.cardFront}
              back={card.cardBack}
              edit={true}
              newSetCard={true}
              updateCardText={updateCardText}
              deleteCardFromList={deleteCard}
            />
          ))
        : ""}
      <div className="center-btn-container">
        <button onClick={addCard}>+Add Card</button>
      </div>
    </>
  );
}

export default CreateSet;
