import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";
import App from "./App";
import MainMenu from "./pages/MainMenu";
import Test from "./pages/Test";
import DynamicPostPage from "./components/DynamicPostPage";
import ArchivePage from "./components/ArchivePage";
import { languages } from "./lang/i18n";
import { postTypes } from "./hooks/postTypes";
import "./styles/tailwind.css";
import "./styles/app.scss";
import Home from "./pages/Home";

// 🔤 Langues actives
const activeLangCodes = languages.filter(l => !l.disabled).map(l => l.code);

// 🌐 Langue navigateur
const detectBrowserLanguage = (): string => {
  const browserLang = navigator.language.slice(0, 2);
  const lang = activeLangCodes.includes(browserLang) ? browserLang : activeLangCodes[0];
  return lang;
};

// 🔁 Redirection si langue absente
const RedirectToLang = () => {
  const location = useLocation();
  const detectedLang = detectBrowserLanguage();
  return <Navigate to={`/${detectedLang}${location.pathname}`} replace />;
};

// 📦 Routes d’app
const appRoutes = [
  { path: "", element: <MainMenu /> },
  { path: "home", element: <Home /> },
];

// 📦 Routes postTypes avec archive + single
const postTypeRoutes = postTypes.flatMap((postType) => [
  {
    path: `${postType.path}`,
    element: <ArchivePage postType={postType} />
  },
  {
    path: `${postType.path}/:slug`,
    element: <DynamicPostPage postType={postType} />
  }
]);

// 📦 Router complet
const router = createBrowserRouter([
  {
    path: "/:lang",
    element: <App />,
    children: [
      ...appRoutes,
      ...postTypeRoutes,
    ],
  },
  ...[...appRoutes, ...postTypeRoutes].map(route => ({
    path: `/${route.path}`,
    element: <RedirectToLang />,
  })),
  { path: "/", element: <RedirectToLang /> },
  { path: "*", element: <RedirectToLang /> },
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
