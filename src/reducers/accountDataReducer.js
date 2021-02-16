export const initialState = {};

const SET_ACCOUNT_DATA = "SET_ACCOUNT_DATA";

export const setAccountData = (data) => {
  return {
    payload: data,
    type: SET_ACCOUNT_DATA,
  };
};

export const accountDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_DATA:
      return {
        detail: action.payload,
      };
    default:
      return { detail: state };
  }
};

export default accountDataReducer;
