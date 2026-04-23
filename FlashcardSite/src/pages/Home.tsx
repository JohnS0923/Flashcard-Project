import { useEffect, useState } from "react";
import { getGlobalVariable } from "../variable/globalVar";
import Card from "../components/Card";
import axios from "axios";
import "../style/main.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";


function Home() {
  interface Set {
    setId: number;
    setTitle: string;
    cardCount: number;
    userName: string;
  }
  interface Folder {
    folderId: number;
    folderTitle: string;
    setCount: number;
    userName: string;
  }
  const navigate = useNavigate();

  const [setsList, setSetsList] = useState<Set[]>([]);
  const [foldersList, setfoldersList] = useState<Folder[]>([]);

  const displaySet = (setId: number) => {
    navigate(`/displaySet/${setId}`); // Pass the setId as a URL parameter
  };
  const displayFolder = (folderId: number) => {
    navigate(`/displayFolder/${folderId}`); // Pass the setId as a URL parameter
  };

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

  useEffect(() => {
    axios
      .get(
        `${API_BASE_URL}/Flashcard/GetSetsOnUserAccount?userId=` +
          getGlobalVariable()
      )
      .then((res) => {
        console.log(res.data.data);
        setSetsList(res.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    axios
      .get(
        `${API_BASE_URL}/Flashcard/GetFoldersOnUserAccount?userId=` +
          getGlobalVariable()
      )
      .then((res) => {
        console.log(res.data.data);
        setfoldersList(res.data.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <>
      {getGlobalVariable() ? (
        <>
          <div className="set-cards">
            <h2>Sets</h2>
            <div className="cardList">
              {setsList
                ? setsList.map((set) => (
                    <Card
                      id={set.setId}
                      title={set.setTitle}
                      count={set.cardCount}
                      owner={set.userName}
                      type="Card"
                      onClick={displaySet}
                    />
                  ))
                : "No Sets Available"}
            </div>
          </div>
          <div className="folder-cards">
            <h2>Folders</h2>
            <div className="cardList">
              {foldersList
                ? foldersList.map((folder) => (
                    <Card
                      id={folder.folderId}
                      title={folder.folderTitle}
                      count={folder.setCount}
                      owner={folder.userName}
                      type="Set"
                      onClick={displayFolder}
                    />
                  ))
                : "No Folders Available"}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

export default Home;
