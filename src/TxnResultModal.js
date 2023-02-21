import React, { useContext, useEffect } from "react";
import { AppContext } from "./context";
function TxnResultModal() {
  const { state, dispatch } = useContext(AppContext);
  useEffect(() => {
    let timer;
    if (state.showTxnResult) {
      timer = setTimeout(() => {
        dispatch({ type: "SHUT_DOWN_TxnResultModal_COMPONENT" });
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [state.showTxnResult]);
  if (state.showTxnResult) {
    return (
      <div className="haveTransaction">
        <div className="modalContainer">{state.TxnResult}</div>
      </div>
    );
  }
}

export default TxnResultModal;
