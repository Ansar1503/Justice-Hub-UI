import { Route, Routes } from "react-router-dom";
import UserRoutes from "./Routes/user_routes/User.Routes";
import { useContext } from "react";
// import { ThemeContext } from "./context/ThemeProvider";
import { SocketContext } from "./context/SocketProvider";
import { Toaster } from "react-hot-toast";

function App() {
  // const { theme } = useContext(ThemeContext);
  useContext(SocketContext);
  return (
    <>
      <Toaster  position="bottom-right"  />
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </>
  );
}

export default App;
