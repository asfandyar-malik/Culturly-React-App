/*eslint-disable*/
import React, { useReducer, useContext, createContext } from "react";

const OnBoardingContext = createContext();

export const OnBoardingDataProvider = ({ reducer, initialState, children }) => {
  const contextValue = useReducer(reducer, initialState);
  return (
    <OnBoardingContext.Provider value={contextValue}>
      {children}
    </OnBoardingContext.Provider>
  );
};

export const OnBoardingDataConsumer = () => {
  const contextValue = useContext(OnBoardingContext);
  return contextValue;
};
