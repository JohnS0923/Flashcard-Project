import { useState } from "react";
import "../style/main.css";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { setGlobalVariable } from "../variable/globalVar";
import { API_BASE_URL } from "../config";

function Login() {
  const [errorMsg, setErrorMsg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const checkPassword = () => {
    if (username != "" && password != "") {
      axios
        .post(`${API_BASE_URL}/Flashcard/LoginUser`, {
          username: username,
          password: password,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.isLoggedIn == true) {
            setGlobalVariable(res.data.userData.userId);
            navigate("../");
          } else {
            setErrorMsg("Login Failed");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle the error, e.g., display an error message to the user
        });
    } else {
      setErrorMsg("Please enter the required information");
    }
  };
  return (
    <>
      <div className="login-container">
        <h1 className="title">Login</h1>
        <form>
          <div className="mb-3">
            <label htmlFor="exampleInputText" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputText"
              aria-describedby="textHelp"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={checkPassword}
          >
            Submit
          </button>
        </form>
        <h6>{errorMsg}</h6>
        {/* <h1>{username}</h1>
        <h1>{password}</h1> */}
        <NavLink to="../signUp" className="signup-text">
          <p>Don't Have An Account? Click Here To Sign Up</p>
        </NavLink>
      </div>
    </>
  );
}

export default Login;
