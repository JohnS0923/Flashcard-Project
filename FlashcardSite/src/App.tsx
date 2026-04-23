import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateSet from "./pages/CreateSet";
import CreateFolder from "./pages/CreateFolder";
import SetDisplay from "./pages/SetDisplay";
import FolderDisplay from "./pages/FolderDisplay";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <>
      {/* <BrowserRouter basename="/Flashcard-Site"> */}
      <BrowserRouter>
        <Routes>
          <Route index path="login" element={<Login />}></Route>
          <Route path="signup" element={<SignUp />}></Route>
          <Route
            path="/"
            element={
              <>
                <Navbar></Navbar>
                <Home></Home>
                <Footer></Footer>
              </>
            }
          ></Route>
          <Route
            path="createSet"
            element={
              <>
                <Navbar></Navbar>
                <CreateSet></CreateSet>
                <Footer></Footer>
              </>
            }
          ></Route>
          <Route
            path="createFolder"
            element={
              <>
                <Navbar></Navbar>
                <CreateFolder></CreateFolder>
                <Footer></Footer>
              </>
            }
          ></Route>
          <Route
            path="displaySet"
            element={
              <>
                <Navbar></Navbar>
                <SetDisplay></SetDisplay>
                <Footer></Footer>
              </>
            }
          ></Route>
          <Route
            path="displaySet/:setId"
            element={
              <>
                <Navbar></Navbar>
                <SetDisplay></SetDisplay>
                <Footer></Footer>
              </>
            }
          ></Route>
          <Route
            path="displayFolder"
            element={
              <>
                <Navbar></Navbar>
                <FolderDisplay></FolderDisplay>
                <Footer></Footer>
              </>
            }
          ></Route>
          <Route
            path="displayFolder/:folderId"
            element={
              <>
                <Navbar></Navbar>
                <FolderDisplay></FolderDisplay>
                <Footer></Footer>
              </>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
