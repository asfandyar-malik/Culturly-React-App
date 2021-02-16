import React from "react";
import ReactDOM from "react-dom";
import AppRouter from "./App";
import reportWebVitals from "./reportWebVitals";

import {
  accountDataReducer,
  initialState as accountData,
} from "./reducers/accountDataReducer";
import { AccountDataProvider } from "./context/accountData";

ReactDOM.render(
  // <React.StrictMode>
  <AccountDataProvider initialState={accountData} reducer={accountDataReducer}>
    <AppRouter />
  </AccountDataProvider>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
