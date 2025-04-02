import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ThemeProvider from "./context/ThemeProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContextPovider.tsx";
import { Provider } from "react-redux";
import store from "./Redux/store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthContextProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </Provider>
);
