import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ThemeProvider from "./context/ThemeProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContextPovider.tsx";
import { Provider } from "react-redux";
import store from "./Redux/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";



createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthContextProvider>
        <ThemeProvider>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_AUTH_CLIENT_ID}>
            <App />
          </GoogleOAuthProvider>
        </ThemeProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </Provider>
);
