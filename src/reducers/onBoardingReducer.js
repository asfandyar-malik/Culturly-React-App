export const initialState = {};

const SET_ONBOARDING_DATA = "SET_ON_BOARDING";

export const setOnBoardingData = (data) => {
  return {
    payload: data,
    type: SET_ONBOARDING_DATA,
  };
};

export const onBoardingDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ONBOARDING_DATA:
      return action.payload;

    default:
      return state;
  }
};

export default onBoardingDataReducer;
