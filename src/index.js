import React from "react";
import ReactDOM from "react-dom";
import AppRouter from "./App";
import reportWebVitals from "./reportWebVitals";

import {
  accountDataReducer,
  initialState as accountData,
} from "./reducers/accountDataReducer";
import {
  onBoardingDataReducer,
  initialState as onBoardingData,
} from "./reducers/onBoardingReducer";

import { AccountDataProvider } from "./context/accountData";
import { OnBoardingDataProvider } from "./context/onBoardingData";

ReactDOM.render(
  <AccountDataProvider initialState={accountData} reducer={accountDataReducer}>
    <OnBoardingDataProvider
      initialState={onBoardingData}
      reducer={onBoardingDataReducer}
    >
      <AppRouter />
    </OnBoardingDataProvider>
  </AccountDataProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
