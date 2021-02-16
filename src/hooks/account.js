import React from "react";

import { AccountDataConsumer } from "../context/accountData";
import { setAccountData as accountSetter } from "../reducers/accountDataReducer";

const AccountHook = (BaseComponent) => (props) => {
  const [accountDataConsumer, dispatch] = AccountDataConsumer();
  const accountData = accountDataConsumer.detail || {};

  function setAccountData(data) {
    dispatch(accountSetter(data));
  }

  return (
    <BaseComponent
      {...props}
      accountData={accountData}
      setAccountData={(data) => setAccountData(data)}
    />
  );
};

export default AccountHook;
