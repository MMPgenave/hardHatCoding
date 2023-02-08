import React, { useState, useContext } from "react";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [haveTransaction, setHaveTransaction] = useState(false);
  const [TxnError, setTxnError] = useState("");
  const [haveTxnError, setHaveTxnError] = useState(false);
  return (
    <AppContext.Provider
      value={{
        haveTransaction,
        setHaveTransaction,
        TxnError,
        setTxnError,
        haveTxnError,
        setHaveTxnError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
