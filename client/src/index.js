import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "./index.css";
import SignIn from "./containers/SignIn";
import Dashboard from "./containers/Dashboard/Dashboard";
import { ThemeProvider } from "@material-tailwind/react";

import { CookiesProvider } from "react-cookie";
import store from "./app/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <CookiesProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </CookiesProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
