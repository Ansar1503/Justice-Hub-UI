import { Route, Routes } from "react-router-dom";
import UserRoutes from "./Routes/user_routes/UserRoutes";
import { Bounce, ToastContainer } from "react-toastify";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeProvider";

function App() {
  const { theme } = useContext(ThemeContext);
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
