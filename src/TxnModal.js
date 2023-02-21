import React, { useContext } from "react";
import { AppContext } from "./context";
function TxnModal() {
  const data = useContext(AppContext);
  const { state } = { ...data };
  return (
    <div
      className={state.haveTransaction ? "haveTransaction" : "noTransaction"}
    >
      <div className="modalContainer">
        <p>Txn on the way</p>
        <p>Please Wait...</p>
      </div>
    </div>
  );
}

export default TxnModal;
