import { useState } from "react";
import "../style/main.css";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { setGlobalVariable } from "../variable/globalVar";
import { API_BASE_URL } from "../config";

function SignUp() {
  const navigate = useNavigate();

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const signUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fName || !lName || !email || !username || !password) {
      setErrorMsg("Please fill in all the required fields.");
      return;
    }

    if (username.length < 5) {
      setErrorMsg("Username must be at least 5 characters long.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    axios
      .post(`${API_BASE_URL}/Flashcard/SignUp`, {
        email,
        firstName: fName,
        lastName: lName,
        username,
        password,
      })
      .then((res) => {
        setErrorMsg("");
        setGlobalVariable(res.data.userId);
        navigate("../");
      })
      .catch(() => {
        setErrorMsg("Signup failed. Please try again.");
      });
  };

  return (
    <>
      <div className="signup-container">
        <h1 className="title">Sign Up</h1>
        <p>{errorMsg}</p>
        <form onSubmit={signUp}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              value={lName}
              onChange={(e) => setLName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
        <NavLink to="../login" className="login-text">
          <p>Have An Account? Click Here To Login</p>
        </NavLink>
      </div>
    </>
  );
}

export default SignUp;
