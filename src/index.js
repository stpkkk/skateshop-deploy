import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"
import "./index.scss";
import "macro-css"; //библиотека кастомных наборов стилей по типу bootsrap документация тут https://github.com/Archakov06/macro-css
import { HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<HashRouter>
    <App />
  </HashRouter>,
);
