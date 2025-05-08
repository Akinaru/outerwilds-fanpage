import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import App from "./App";
import MainMenu from "./pages/MainMenu";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound"; // 🔥 Ton composant personnalisé
import { languages } from "./lang/i18n";
import "./styles/tailwind.css";
import "./styles/app.scss";

// 🔤 Langues actives
const activeLangCodes = languages.filter(l => !l.disabled).map(l => l.code);

// 🌐 Langue navigateur
const detectBrowserLanguage = (): string => {
  const browserLang = navigator.language.slice(0, 2);
  return activeLangCodes.includes(browserLang) ? browserLang : activeLangCodes[0];
};

// 🔁 Redirection si pas de langue
const RedirectToLang = () => {
  const location = useLocation();
  const detectedLang = detectBrowserLanguage();
  const firstSegment = location.pathname.split("/")[1];
  if (activeLangCodes.includes(firstSegment)) {
    return <Navigate to={`/${detectedLang}`} replace />;
  }
  return <Navigate to={`/${detectedLang}${location.pathname}`} replace />;
};

// 🔁 Valide que la langue est correcte
const ValidateLangWrapper = () => {
  const { lang } = useParams();
  const fallbackLang = detectBrowserLanguage();
  if (!lang || !activeLangCodes.includes(lang)) {
    return <Navigate to={`/${fallbackLang}/404`} replace />;
  }
  return <App />;
};

// 📦 Routes d’app
const appRoutes = [
  { path: "", element: <MainMenu /> },
  { path: "home", element: <Home /> },
  { path: "404", element: <NotFound /> },
];

// 📦 Router complet
const router = createBrowserRouter([
  {
    path: "/:lang",
    element: <ValidateLangWrapper />,
    children: appRoutes,
  },
  ...appRoutes.map(route => ({
    path: `/${route.path}`,
    element: <RedirectToLang />,
  })),
  { path: "/", element: <RedirectToLang /> },
  {
    path: "*",
    element: <Navigate to={`/${detectBrowserLanguage()}/404`} replace />
  }
]);

// 🚀 Mount
const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
