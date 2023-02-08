import "./App.css";
import { useState, useEffect, useContext } from "react";
import { BigNumber, ethers, utils } from "ethers";
import { contractAddress, ABI } from "./data";
import AdminPanel from "./AdminPanel";
import ErroModal from "./ErroModal";
import Modal from "./Modal";
import { AppContext } from "./context";
function App() {
  console.log("app rendered");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [IsMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isContractOwner, setIsContractOwner] = useState(false);
  const [dataFromContract, setDataFromContract] = useState({
    numOfVoter: 0,
    proposals: [],
    contractAddress: "",
    NumberOfVotes: [],
  });
  const [PlayerIndex, setPlayerIndex] = useState("");
  const [winner, setWinner] = useState(
    "App not connected to the contract yet!"
  );

  //Data from Context
  const data = useContext(AppContext);
  const { setHaveTransaction, haveTxnError, setTxnError, setHaveTxnError } = {
    ...data,
  };

  //functions
  async function walletConnectorHandler() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];
      setWalletAddress(address);
      setIsWalletConnected(true);
    } else {
      console.log("You havn't any wallet extension installed on your browser!");
    }
  }

  //check if this wallet address deployed the contract or not!(you are the owner of the contract?)
  async function OwnerChecker() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);
    const contractOwner = await contract.Owner();
    console.log(`iscontractOwner:${isContractOwner}`);

    if (contractOwner.toLowerCase() === walletAddress.toLowerCase()) {
      setIsContractOwner(true);
    }
    console.log(`iscontractOwner:${isContractOwner}`);
  }
  function MetaMaskChecker() {
    if (window.ethereum) {
      setIsMetaMaskInstalled(true);
    } else {
      setIsMetaMaskInstalled(false);
    }
  }

  async function getDataFromContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);
    let proposal1 = await contract.senators(0);
    let proposal2 = await contract.senators(1);
    let proposal3 = await contract.senators(2);
    let newNames = [];
    //I use the following object for have a key in rendering with map() method
    let Name1 = { key: 0, Name: proposal1 };
    let Name2 = { key: 1, Name: proposal2 };
    let Name3 = { key: 2, Name: proposal3 };
    newNames.push(Name1, Name2, Name3);
    //get number of voter that can vote to proposals
    let numOfVos = await contract.numberOfVoters();
    numOfVos = numOfVos.toNumber();
    let newdata = { ...dataFromContract };
    newdata.numOfVoter = numOfVos;
    newdata.proposals = newNames;
    console.log(` get Data from contract `);
    newdata.contractAddress = contract.address;

    let numberOfVoteForRonaldo = await contract.NumOfVote(0);
    let numberOfVoteForMessi = await contract.NumOfVote(1);
    let numberOfVoteForMbappe = await contract.NumOfVote(2);
    let array = [
      numberOfVoteForRonaldo.toNumber(),
      numberOfVoteForMessi.toNumber(),
      numberOfVoteForMbappe.toNumber(),
    ];
    newdata.NumberOfVotes = array;

    setDataFromContract(newdata);
  }

  const getWinner = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);
    const winner = await contract.Winner();

    console.log(`winner is ${winner} type:${typeof winner}`);
    console.log(
      `we get the winner from the contract with this txn hash:${winner.hash}`
    );
    setWinner((prev) => winner);
  };
  useEffect(() => {
    MetaMaskChecker();
    walletConnectorHandler();
    OwnerChecker();
    getDataFromContract();
    getWinner();
  }, [isContractOwner, IsMetaMaskInstalled, isWalletConnected]);

  async function vote() {
    try {
      setHaveTransaction((prev) => !prev);
      console.log(`Vote function handler initiated`);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI, signer);
      const Txn = await contract.VoteToSenator(BigNumber.from(PlayerIndex));

      console.log(`Vote Txn address:${Txn.hash}`);

      //refresh data from contract
      let numberOfVoteForRonaldo = await contract.NumOfVote(0);
      let numberOfVoteForMessi = await contract.NumOfVote(1);
      let numberOfVoteForMbappe = await contract.NumOfVote(2);
      let array = [
        numberOfVoteForRonaldo.toNumber(),
        numberOfVoteForMessi.toNumber(),
        numberOfVoteForMbappe.toNumber(),
      ];
      let newdata = { ...dataFromContract };
      newdata.NumberOfVotes = array;
      setDataFromContract(newdata);
      getWinner();
      setPlayerIndex("");
      setHaveTransaction((prev) => !prev);
    } catch (e) {
      setHaveTransaction((prev) => !prev);
      setTxnError(e.error.message);
      setHaveTxnError((prev) => !prev);
    }
  }

  if (IsMetaMaskInstalled) {
    return (
      <main className="main-container">
        <header className="headerSection">
          <h2 className="Heading">polling</h2>

          <div className="Addresses">
            <div>
              Contract Address: <h4> {dataFromContract.contractAddress}</h4>
            </div>
            <div>
              Your address: <h4> {walletAddress}</h4>
            </div>
          </div>
        </header>
        <div className="Info">
          In this contract, you can vote for your favorite soccer player. The
          voting process are done with your wallet.
        </div>
        <div className="container">
          <div className="listOfProposal">
            <div>
              <h4 className="subHeader">Soccer Players</h4>
              {dataFromContract.proposals.map((proposal) => {
                return (
                  <div key={proposal.key}>
                    {proposal.key}: {proposal.Name}
                    {"   ("}
                    <span className="NumOfVoteForEachProposal">
                      {dataFromContract.NumberOfVotes[proposal.key]}
                    </span>{" "}
                    vote
                    {")"}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="Vote2FootbalPlayer">
            <div className="voters">
              Number Of choosed voters by contract owner:
              <span className="NumOfVoteForEachProposal">
                {" "}
                {dataFromContract.numOfVoter}
              </span>
            </div>
            <form>
              <input
                placeholder="Index of football player..."
                onChange={(e) => setPlayerIndex(e.target.value)}
                value={PlayerIndex}
              />
            </form>
            <button onClick={vote}>Vote</button>
          </div>
        </div>
        <div className="winner">
          <h2>
            Most popular soccer player is :{" "}
            <p className="NumOfVoteForEachProposal">{winner}</p>
          </h2>
        </div>
        {isContractOwner ? <AdminPanel /> : null}
        <Modal />
        {haveTxnError ? <ErroModal /> : null}
      </main>
    );
  } else {
    return (
      <div className="NoMatamask">
        <h1>
          To Vote to a football players you must install a MetaMask wallet.
        </h1>
        <a
          target="_blank"
          href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
        >
          Link
        </a>
      </div>
    );
  }
}

export default App;
