import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ThemeProvider from "./context/ThemeProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthContextProvider from "./context/AuthContextPovider.tsx";
import { Provider } from "react-redux";
import { store, persistor } from "@/store/redux/store.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SocketProvider } from "./context/SocketProvider.tsx";
import { LawyerVerificationProvider } from "./context/LawyerVerificationContext.tsx";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: 3000,
      refetchOnWindowFocus: false,
    },
  },
});

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
  }
}

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <AuthContextProvider>
          <ThemeProvider>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_AUTH_CLIENT_ID}>
              <QueryClientProvider client={queryClient}>
                <SocketProvider>
                  <LawyerVerificationProvider>
                    <App />
                  </LawyerVerificationProvider>
                </SocketProvider>
              </QueryClientProvider>
            </GoogleOAuthProvider>
          </ThemeProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
