import { useEffect, useState, ChangeEvent } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Flashcard from "../components/Flashcard2";
import { getGlobalVariable } from "../variable/globalVar";
import FlippableCard from "../components/FlippableCard";
import Popup from "../popup/Popup.tsx";
import { API_BASE_URL } from "../config";

function DisplaySet() {
  interface Cards {
    cardId: number;
    setId: number;
    userId: number;
    cardFront: string;
    cardBack: string;
    starred: boolean;
  }

  const navigate = useNavigate();
  const { setId } = useParams();

  const [setName, setSetName] = useState("");
  const [cardsList, setCardsList] = useState<Cards[]>([]);
  const [editMode, setEditMode] = useState(false);

  const [selectedValue, setSelectedValue] = useState("0");

  const [slideLocation, setSlideLocation] = useState(0);
  const [slideList, setSlideList] = useState<Cards[]>([]);
  const [buttonPopup, setButtonPopup] = useState(false);

  const [isStarredSwitchToggled, setStarredSwitchToggled] = useState(false);
  const [isShuffleSwitchToggled, setShuffleSwitchToggled] = useState(false);

  const [isFlipped, setIsFlipped] = useState(false);

  // ✨ animation direction
  const [animateDirection, setAnimateDirection] = useState<
    "left" | "right" | null
  >(null);

  const triggerSwipe = (dir: "left" | "right") => {
    setAnimateDirection(dir);
    setTimeout(() => setAnimateDirection(null), 250);
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
  };

  // ---------------- AUTH ----------------
  useEffect(() => {
    const userId = getGlobalVariable();
    if (userId === "0" || userId == null) {
      navigate("/login");
    }
  }, [navigate]);

  // ---------------- FETCH DATA ----------------
  const getData = () => {
    axios
      .get(`${API_BASE_URL}/Flashcard/GetCardInSet?setId=${setId}`)
      .then((res) => {
        setSetName(res.data.setName);
        setCardsList(res.data.cardsList);
        setSlideList(res.data.cardsList);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (!setId) return;
    getData();
  }, [setId]);

  // ---------------- FILTER / SHUFFLE ----------------
  useEffect(() => {
    let updated = [...cardsList];

    if (isStarredSwitchToggled) {
      updated = updated.filter((c) => c.starred);
    }

    if (isShuffleSwitchToggled) {
      for (let i = updated.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [updated[i], updated[j]] = [updated[j], updated[i]];
      }
    }

    setSlideList(updated);
    setSlideLocation(0);
  }, [isStarredSwitchToggled, isShuffleSwitchToggled, cardsList]);

  // ---------------- ACTIONS ----------------
  const addCard = async () => {
    await axios.post(`${API_BASE_URL}/Flashcard/AddCard`, {
      setId,
      userId: getGlobalVariable(),
      cardFront: "",
      cardBack: "",
      starred: false,
    });

    getData();
  };

  const deleteSet = (id: number) => {
    axios
      .post(`${API_BASE_URL}/Flashcard/DeleteSet?setId=${id}`)
      .then(() => navigate("../"))
      .catch(console.error);
  };

  const onChange = () => getData();

  // ---------------- RENDER ----------------
  return (
    <div>
      <div className="header">
        <div className="go-back">
          <NavLink to="../">
            <i className="fa-solid fa-chevron-left center-icon"></i>
            <p>Go Back</p>
          </NavLink>
        </div>

        <h1 className="centered-h1">{setName}</h1>

        <div className="buttons" onClick={() => setEditMode(!editMode)}>
          <p>Edit Set</p>
        </div>
      </div>

      {editMode && (
        <div
          className="buttons center"
          onClick={() => deleteSet(Number(setId))}
        >
          <p>Delete Set</p>
        </div>
      )}

      {/* SLIDES */}
      {slideList.length > 0 && (
        <div className="centered-container">
          <div className="slides">
            {/* LEFT */}
            {slideLocation > 0 ? (
              <i
                className="fa-solid fa-arrow-left"
                onClick={() => {
                  setSlideLocation((p) => p - 1);
                  setIsFlipped(false);
                  triggerSwipe("left");
                }}
              />
            ) : (
              <i className="fa-solid fa-arrow-left disable" />
            )}

            {/* CARD */}
            {slideLocation === slideList.length ? (
              <div className="center reset-box">
                <div className="buttons" onClick={() => setSlideLocation(0)}>
                  Reset
                </div>
              </div>
            ) : (
              <div
                className={`slide-animate ${
                  animateDirection === "left"
                    ? "slide-left"
                    : animateDirection === "right"
                      ? "slide-right"
                      : ""
                }`}
              >
                <FlippableCard
                  frontText={slideList[slideLocation].cardFront}
                  backText={slideList[slideLocation].cardBack}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(!isFlipped)}
                />
              </div>
            )}

            {/* RIGHT */}
            {slideLocation < slideList.length ? (
              <i
                className="fa-solid fa-arrow-right"
                onClick={() => {
                  setSlideLocation((p) => p + 1);
                  setIsFlipped(false);
                  triggerSwipe("right");
                }}
              />
            ) : (
              <i className="fa-solid fa-arrow-right disable" />
            )}
          </div>

          <div className="slideBottom">
            {slideLocation < slideList.length && (
              <p>
                {slideLocation + 1}/{slideList.length}
              </p>
            )}

            <i
              className="fa-solid fa-gear"
              onClick={() => setButtonPopup(true)}
            />
          </div>
        </div>
      )}

      {/* POPUP */}
      <Popup
        trigger={buttonPopup}
        title="Slide Control"
        setTrigger={() => setButtonPopup(false)}
      >
        <div>
          <div className="form-check form-switch">
            <label className="form-check-label">Show Only Starred Items</label>
            <input
              type="checkbox"
              checked={isStarredSwitchToggled}
              onChange={() => setStarredSwitchToggled((p) => !p)}
            />
          </div>

          <div className="form-check form-switch">
            <label className="form-check-label">Shuffle List</label>
            <input
              type="checkbox"
              checked={isShuffleSwitchToggled}
              onChange={() => setShuffleSwitchToggled((p) => !p)}
            />
          </div>
        </div>
      </Popup>

      {/* VIEW SELECT */}
      <div className="container-right">
        <select
          className="form-select view-select"
          onChange={handleSelectChange}
        >
          <option value="0">View All</option>
          <option value="1">View Favorite</option>
        </select>
      </div>

      {/* CARDS LIST */}
      {cardsList.length > 0 ? (
        selectedValue === "1" ? (
          cardsList
            .filter((card) => card.starred)
            .map((card) => (
              <Flashcard
                key={card.cardId}
                id={card.cardId}
                front={card.cardFront}
                back={card.cardBack}
                starred={card.starred}
                edit={editMode}
                onChange={onChange}
              />
            ))
        ) : (
          cardsList.map((card) => (
            <Flashcard
              key={card.cardId}
              id={card.cardId}
              front={card.cardFront}
              back={card.cardBack}
              starred={card.starred}
              edit={editMode}
              onChange={onChange}
            />
          ))
        )
      ) : (
        <p>No card available</p>
      )}

      {editMode && (
        <div className="center-btn-container">
          <button onClick={addCard}>+Add Card</button>
        </div>
      )}
    </div>
  );
}

export default DisplaySet;
