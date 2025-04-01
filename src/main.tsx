import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ThemeProvider from "./context/ThemeProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContextPovider.tsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <ThemeProvider>
        <ToastContainer />
        <App />
      </ThemeProvider>
    </AuthContextProvider>
  </BrowserRouter>
);
