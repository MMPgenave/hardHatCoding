import React from "react";
import "./App.css";
import { useState, useEffect, useContext } from "react";
import { BigNumber, ethers, utils } from "ethers";
import { contractAddress, ABI } from "./data";
import { AppContext } from "./context";

const AdminPanel = () => {
  const [inputVale, setInputValue] = useState("");

  //Data from Context
  const data = useContext(AppContext);
  const { setHaveTransaction, setTxnError, setHaveTxnError } = { ...data };

  const addVoterHandler = async () => {
    try {
      setHaveTransaction((prev) => !prev);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const Txn = await contract.chooseVoters(inputVale);
      await Txn.wait();
      console.log(`Txn done with this Txn address:${Txn.hash}`);
      if (Txn.hash) {
        setHaveTransaction((prev) => !prev);
      }
      setInputValue("");
    } catch (e) {
      setHaveTransaction((prev) => !prev);
      setTxnError(e.message);
      setHaveTxnError((prev) => !prev);
    }
  };
  return (
    <div className="adminPanel">
      <h4 className="subHeader">Admin Panel</h4>
      <form>
        <input
          placeholder="Address : 0x..."
          value={inputVale}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>
      <button onClick={addVoterHandler}>Add voter</button>
    </div>
  );
};

export default AdminPanel;
