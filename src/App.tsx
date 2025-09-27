import { Route, Routes } from "react-router-dom";
import UserRoutes from "./Routes/user_routes/User.Routes";
import { Toaster } from "sonner";
import { useContext } from "react";
import { ThemeContext } from "./context/ThemeProvider";
import { ThemeEnum } from "./types/enums/theme_enum";

function App() {
  const theme = useContext(ThemeContext);
  const toasterTheme =
    theme.theme === ThemeEnum.Dark
      ? "dark"
      : theme.theme === ThemeEnum.Light
      ? "light"
      : "system";
  return (
    <>
      {/* <Toaster position="bottom-right" /> */}
      <Toaster position="bottom-right" theme={toasterTheme} />

      <Routes>
        <Route path="/*" element={<UserRoutes />} />
      </Routes>
    </>
  );
}

export default App;
