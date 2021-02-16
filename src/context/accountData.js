/*eslint-disable*/
import React, { useReducer, useContext, createContext } from "react";

const AccountDataContext = createContext();

export const AccountDataProvider = ({
  reducer,
  initialState,
  children,
}) => {
  const contextValue = useReducer(reducer, initialState);
  return (
    <AccountDataContext.Provider value={contextValue}>
      {children}
    </AccountDataContext.Provider>
  );
};

export const AccountDataConsumer = () => {
  const contextValue = useContext(AccountDataContext);
  return contextValue;
};
