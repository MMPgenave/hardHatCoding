import React, { useContext } from "react";
import { AppContext } from "./context";
function Modal() {
  const data = useContext(AppContext);
  const { haveTransaction } = { ...data };
  return (
    <div className={haveTransaction ? "haveTransaction" : "noTransaction"}>
      <div className="modalContainer">Transaction on the way...</div>
    </div>
  );
}

export default Modal;
