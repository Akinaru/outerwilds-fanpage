import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Test from "./pages/Test";
import i18n, { languages } from "./lang/i18n";
import "./styles/tailwind.css";
import "./styles/app.scss";

// Langues actives
const activeLangCodes = languages.filter(l => !l.disabled).map(l => l.code);

// Détection de langue
const detectBrowserLanguage = (): string => {
  const browserLang = navigator.language.slice(0, 2);
  const lang = activeLangCodes.includes(browserLang) ? browserLang : activeLangCodes[0];
  console.debug("[🌍] Langue navigateur détectée :", browserLang, "→ utilisée :", lang);
  return lang;
};

// Redirection automatique
const RedirectToLang = () => {
  const location = useLocation();
  const detectedLang = detectBrowserLanguage();

  const newPath = `/${detectedLang}${location.pathname}`;
  console.debug("[🔁] Redirection vers", newPath);
  return <Navigate to={newPath} replace />;
};

// 📦 Liste centralisée des routes internes
const appRoutes = [
  { path: "", element: <Home /> },
  { path: "test", element: <Test /> },
];

// 📦 Création dynamique du router
const router = createBrowserRouter([
  // Routes avec langue explicite
  {
    path: "/:lang",
    element: <App />,
    children: appRoutes,
  },
  // Redirection depuis les mêmes routes sans langue
  ...appRoutes.map(route => ({
    path: `/${route.path}`, // ex: "/test"
    element: <RedirectToLang />,
  })),
  // Redirection depuis racine ou wildcard
  { path: "/", element: <RedirectToLang /> },
  { path: "*", element: <RedirectToLang /> },
]);

// 📦 Mount
const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
  );
}