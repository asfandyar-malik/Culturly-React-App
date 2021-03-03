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
  <AccountDataProvider initialState={accountData} reducer={accountDataReducer}>
    <AppRouter />
  </AccountDataProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
