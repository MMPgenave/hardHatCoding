export const reducer = (state, action) => {
  if (action.type === "TXN_ON") {
    return { ...state, haveTransaction: true };
  }
  if (action.type === "TXN_OFF") {
    return { ...state, haveTransaction: false };
  }
  if (action.type === "TXN_RESULT") {
    return { ...state, showTxnResult: true, TxnResult: action.payload };
  }
  if (action.type === "SHUT_DOWN_TxnResultModal_COMPONENT") {
    return { ...state, showTxnResult: false };
  }
  if (action.type === "ADD_VOTERS") {
    const newVoters = [...state.VOTERS];
    newVoters.push({
      id: new Date().getTime().toString(),
      address: action.payload,
    });
    return { ...state, VOTERS: newVoters };
  }
  throw new Error("this action did't include in MMP PROGRAMS");
};
