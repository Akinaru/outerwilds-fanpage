import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Test from "./pages/Test";
import './styles/tailwind.css';
import './styles/app.scss';

const detectBrowserLanguage = () => {
  return navigator.language.startsWith("fr") ? "fr" : "en";
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={`/${detectBrowserLanguage()}`} replace />,
  },
  {
    path: "/:lang",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "test",
        element: <Test />,
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to={`/${detectBrowserLanguage()}`} replace />,
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}