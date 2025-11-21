import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/authContext";
import App from "./App.tsx";
import "./index.css";
// import { Auth0Provider } from "@auth0/auth0-react";

// createRoot(document.getElementById("root")!).render(
//   <Auth0Provider
//     domain={import.meta.env.VITE_AUTH0_DOMAIN}
//     clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
//     authorizationParams={{
//       redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
//     }}
//   >
//     <App />
//   </Auth0Provider>
// );
createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <App />
    </AuthProvider>
);