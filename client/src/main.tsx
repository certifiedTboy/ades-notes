import { createRoot } from "react-dom/client";
import { AuthContextProvider } from "./features/context/auth-context";
import { PostContextProvider } from "./features/context/post-context";
import { AdminContextProvider } from "./features/context/admin-context";
import { CommentContextProvider } from "./features/context/comment-context";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "./features/store/store";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AuthContextProvider>
      <PostContextProvider>
        <CommentContextProvider>
          <AdminContextProvider>
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_APP_GOOGLE_OAUTH_CLIENT_ID}
            >
              <App />
            </GoogleOAuthProvider>
          </AdminContextProvider>
        </CommentContextProvider>
      </PostContextProvider>
    </AuthContextProvider>
  </Provider>,
);
