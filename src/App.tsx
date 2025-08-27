import { Route, Routes } from "react-router-dom";
import UserRoutes from "./Routes/user_routes/User.Routes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </>
  );
}

export default App;
