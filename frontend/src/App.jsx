import Home from "./home/Home.jsx";
import Login from "./login/Login.jsx";
import Register from "./register/Register.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes } from "react-router-dom";
import { VerifyUser } from "./utils/VerifyUser.jsx";

function App() {
  return (
    <>
      <div className="p-2 w-screen h-screen flex items-center justify-center">
        <div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<VerifyUser />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default App;
