import React, { useReducer, useState } from "react";
import { reducer } from "./reducer";
const AppContext = React.createContext();
const initialState = {
  haveTransaction: false,
  showTxnResult: false,
  TxnResult: "",
  VOTERS: [
    { id: 0, address: "0xeeAe9E36B9756eA6345A4CeF3B19c475c77529A8" },
    { id: 1, address: "0x500a0B9b5075032338dc1a918d32E11e9F5675Eb" },
    { id: 2, address: "0x501a0B9b5075032338dc1a918d33611e9F567576" },
    { id: 3, address: "0x174BB41E81BB39C1242962aeC675301967B788d1" },
    { id: 4, address: "0xC991Fca957E073707889f97D82f2F05228c6818E" },
    { id: 5, address: "0x5e1BF84160DC6eedE68Ad7127507cc1ce30bb8a2" },
    { id: 6, address: "0x8E3C3d8F0cbf7b824343B78CAE1689658bb14216" },
    { id: 7, address: "0x89462e2D1fa0764024d8FA7866B38Ff1f7Db55Ff" },
    { id: 8, address: "0x69e8AbC8e5F139B1765b5bEb73f1c31CBaC8DDfE" },
    { id: 9, address: "0x500a0B9b5075032338dc1a918d32E11e9F5675Eb" },
    { id: 10, address: "0xBA248E3398017cfBBdb26F9649ACF4F0388D85bD" },
    { id: 11, address: "0x320344d1af223123ec334b14e54c697efb317fce" },
  ],
};
const AppProvider = ({ children }) => {
  // const [haveTransaction, setHaveTransaction] = useState(false);
  // const [TxnError, setTxnError] = useState("");
  // const [haveTxnError, setHaveTxnError] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
