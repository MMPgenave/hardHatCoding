import React from "react";
import "./App.css";
import { useState, useContext } from "react";
import { BigNumber, ethers, utils } from "ethers";
import { contractAddress, ABI } from "./data";
import { AppContext } from "./context";

const AdminPanel = () => {
  console.log(`ADMIN-PANEL`);
  const [inputVale, setInputValue] = useState("");

  //Data from Context
  const data = useContext(AppContext);
  const { state, dispatch } = { ...data };

  const addVoterHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "TXN_ON" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const Txn = await contract.chooseVoters(inputVale);
      await Txn.wait();

      if (Txn.hash) {
        // setHaveTransaction((prev) => !prev);
        dispatch({ type: "TXN_OFF" });
        dispatch({ type: "TXN_RESULT", payload: Txn.hash });
      }
      setInputValue("");
      dispatch({ type: "ADD_VOTERS", payload: inputVale });
    } catch (e) {
      // setHaveTransaction((prev) => !prev);
      dispatch({ type: "TXN_OFF" });
      // setTxnError(e.message);
      dispatch({ type: "TXN_RESULT", payload: e.message });
      // setHaveTxnError((prev) => !prev);
    }
  };
  return (
    <div className="adminPanel">
      <h4>Admin Panel</h4>
      <form>
        <input
          placeholder="Address : 0x..."
          value={inputVale}
          onChange={(e) => setInputValue(e.target.value)}
          required
        />
        <button onClick={addVoterHandler}>Add voter</button>
      </form>
    </div>
  );
};

export default AdminPanel;
