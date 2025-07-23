import { Route, Routes } from "react-router-dom";
import UserRoutes from "./Routes/user_routes/User.Routes";
import { Bounce, ToastContainer } from "react-toastify";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeProvider";
import { SocketContext } from "./context/SocketProvider";

function App() {
  const { theme } = useContext(ThemeContext);
  useContext(SocketContext);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        transition={Bounce}
      />
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </>
  );
}

export default App;
