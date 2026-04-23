import "./Navbar.css";
import logo from "../imgs/logo.png";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav className="nav">
        <div className="logo">
          <NavLink to="/">
            <img src={logo} alt="Logo" />
          </NavLink>
        </div>
        <div className="library">
          <NavLink to="/">
            <p>Your Library</p>
          </NavLink>
        </div>
        <div className="nav-btn">
          <NavLink to="../createset">
            <p>Create Set</p>
          </NavLink>
        </div>
        <div className="nav-btn">
          <NavLink to="../createfolder">
            <p>Create Folder</p>
          </NavLink>
        </div>
        <div className="search">
          <input type="text" placeholder="Search...(WIP)"></input>
          <i className="fa-solid fa-magnifying-glass icon"></i>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
