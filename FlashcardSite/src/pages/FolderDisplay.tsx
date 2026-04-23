import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import Card from "../components/Card";
import EditFolder from "../popup/Popup.tsx";
import { getGlobalVariable } from "../variable/globalVar";
import { API_BASE_URL } from "../config";

import "../style/main.css";
function FolderDisplay() {
  interface Set {
    setId: number;
    setTitle: string;
    cardCount: number;
    userName: string;
    folderConnection: Array<number>;
  }
  const { folderId } = useParams();
  const [setsList, setSetsList] = useState<Set[]>([]);
  const [userSetsList, setUserSetsList] = useState<Set[]>([]);
  const navigate = useNavigate();
  const [buttonPopup, setButtonPopup] = useState(false);
  const [folderTitle, setFolderTitle] = useState("");

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

  const displaySet = (setId: number) => {
    navigate(`/displaySet/${setId}`); // Pass the setId as a URL parameter
  };

  //delete from folder
  const deleteFromFolder = (setId: number) => {
    axios
      .post(
        `${API_BASE_URL}/Flashcard/DeleteFolderFromSet?setID=` +
          setId +
          "&folderID=" +
          folderId
      )
      .then(() => {
        getSets();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //add set folder connection
  const addSetToFolder = (setId: number) => {
    axios
      .post(
        `${API_BASE_URL}/Flashcard/AddSetToFolder?setID=` +
          setId +
          "&folderID=" +
          folderId
      )
      .then(() => {
        // console.log(res.data);
        getSets();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  //get sets in user account
  const getSets = () => {
    axios
      .get(
        `${API_BASE_URL}/Flashcard/GetSetsOnUserAccount?userId=` +
          getGlobalVariable()
      )
      .then((res) => {
        // console.log(res.data.data);
        setUserSetsList(res.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  //const open popup
  const openPopup = () => {
    setButtonPopup(true);
    getSets();
  };
  //delete folder
  const deleteFolder = (folderId: number) => {
    axios
      .post(
        `${API_BASE_URL}/Flashcard/DeleteFolder?folderId=` + folderId
      )
      .then(() => {
        // console.log(res.data);
        navigate("../");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //get sets in folder from api call
  useEffect(() => {
    axios
      .get(
        `${API_BASE_URL}/Flashcard/GetFolderSets?folderId=` + folderId
      )
      .then((res) => {
        console.log(res.data);
        setSetsList(res.data.data);
        setFolderTitle(res.data.folderTitle);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [setsList]);
  return (
    <>
      <div className="header">
        <div className="go-back">
          <NavLink to="../">
            <i className="fa-solid fa-chevron-left center-icon"></i>
            <p>Go Back</p>
          </NavLink>
        </div>
        <h1 className="centered-h1">{folderTitle}</h1>
        <div className="buttons" onClick={openPopup}>
          <p>Edit Folder</p>
        </div>
      </div>
      <div className="set-cards">
        <div className="grid-card ">
          {setsList ? (
            setsList.map((set) => (
              <Card
                id={set.setId} // Make sure to provide a unique key for each Card
                title={set.setTitle}
                count={set.cardCount}
                owner={set.userName}
                type="Card"
                onClick={displaySet}
              />
            ))
          ) : (
            <p className="center">No Sets Avalaible</p>
          )}
        </div>
      </div>

      <EditFolder
        trigger={buttonPopup}
        title="Edit Folder"
        setTrigger={() => setButtonPopup(false)}
      >
        <div
          className="buttons center"
          onClick={() => deleteFolder(Number(folderId))}
        >
          <p>Delete Folder</p>
        </div>
        {userSetsList.map((set) => (
          <div className="card no-hover">
            <div className="card-body card-body-row">
              <div>
                <p>Title:{set.setTitle}</p>
                <p>Card Count:{set.cardCount}</p>
              </div>
              <div>
                {set.folderConnection.includes(Number(folderId)) ? (
                  <i
                    className="fa-solid fa-minus"
                    onClick={() => deleteFromFolder(set.setId)}
                  ></i>
                ) : (
                  <i
                    className="fa-solid fa-plus"
                    onClick={() => addSetToFolder(set.setId)}
                  ></i>
                )}
              </div>
            </div>
          </div>
        ))}
      </EditFolder>
    </>
  );
}

export default FolderDisplay;
