import React, { useContext } from "react";
import { AppContext } from "./context";
function ErroModal() {
  const data = useContext(AppContext);
  const { TxnError } = { ...data };
  return (
    <div className="ErrorModalContainer">
      <div className="ErrorMessage">
        {TxnError}
        <div>Please refresh the App.</div>
      </div>
    </div>
  );
}

export default ErroModal;
