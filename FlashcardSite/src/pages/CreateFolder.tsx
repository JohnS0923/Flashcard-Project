import { useState, useEffect } from "react";
import { getGlobalVariable } from "../variable/globalVar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";

function CreateFolder() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

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

  const CreateFolder = () => {
    if (title != "" && title != null) {
      const dataToSend = {
        userID: getGlobalVariable(),
        folderTitle: title,
        folderDescription: desc,
      };
      axios
        .post(`${API_BASE_URL}/Flashcard/AddFolder`, dataToSend)
        .then(() => {
          // console.log(res.data);
          navigate("../");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  return (
    <>
      <div style={{ height: "100%" }}>
        <h1 className="center">Create Folder</h1>
        <div className="finish-btn">
          <button className="btn btn-primary" onClick={CreateFolder}>
            Finish
          </button>
        </div>
        <div className="folder-form">
          <form>
            <div className="mb-3">
              <label htmlFor="folderTitle" className="form-label">
                Set Title
              </label>
              <input
                type="text"
                className="form-control"
                id="folderTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="folderDesc" className="form-label">
                Set Description
              </label>
              <input
                type="text"
                className="form-control"
                id="folderDesc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateFolder;
