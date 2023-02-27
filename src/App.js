import "./App.css";
import { useState, useEffect, useContext } from "react";
import { BigNumber, ethers, utils } from "ethers";
import { contractAddress, ABI, PlayersData } from "./data";
import ContactMe from "./ContactMe";
import AdminPanel from "./AdminPanel";
import TxnModal from "./TxnModal";
import Slider from "./Slider";
import TxnResultModal from "./TxnResultModal";
import { AppContext } from "./context";
function App() {
  console.log("APP");
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
    "App not connected to the contract yet!. please wait."
  );

  //Data from Context
  const data = useContext(AppContext);
  const { state, dispatch } = {
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
    console.log(`owner address:${contractOwner}`);
    if (contractOwner.toLowerCase() === walletAddress.toLowerCase()) {
      setIsContractOwner(true);
    }
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
    let Name1 = { key: 0, Name: proposal1, imgURL: PlayersData[0].img };
    let Name2 = { key: 1, Name: proposal2, imgURL: PlayersData[1].img };
    let Name3 = { key: 2, Name: proposal3, imgURL: PlayersData[2].img };
    newNames.push(Name1, Name2, Name3);
    //get number of voter that can vote to proposals
    let numOfVos = await contract.numberOfVoters();
    numOfVos = numOfVos.toNumber();

    let newdata = { ...dataFromContract };
    newdata.numOfVoter = numOfVos;
    newdata.proposals = newNames;
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

    setWinner((prev) => winner);
  };
  useEffect(() => {
    MetaMaskChecker();
    walletConnectorHandler();
    OwnerChecker();
    getDataFromContract();
    getWinner();
  }, [isContractOwner, IsMetaMaskInstalled, isWalletConnected]);

  async function vote(e) {
    e.preventDefault();

    if (
      PlayerIndex.toLowerCase() === "cristiano".toLowerCase() ||
      PlayerIndex.toLowerCase() === "lionel".toLowerCase() ||
      PlayerIndex.toLowerCase() === "Kylian".toLowerCase()
    ) {
      let index;
      if (PlayerIndex.toLowerCase() === "cristiano".toLowerCase()) {
        index = 0;
      }
      if (PlayerIndex.toLowerCase() === "lionel".toLowerCase()) {
        index = 1;
      }
      if (PlayerIndex.toLowerCase() === "Kylian".toLowerCase()) {
        index = 2;
      }

      try {
        // setHaveTransaction((prev) => !prev);
        dispatch({ type: "TXN_ON" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ABI, signer);
        const Txn = await contract.VoteToSenator(BigNumber.from(index));
        await Txn.wait();
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
        // setHaveTransaction((prev) => !prev);
        dispatch({ type: "TXN_OFF" });
        dispatch({ type: "TXN_RESULT", payload: Txn.hash });
      } catch (e) {
        // setHaveTransaction((prev) => !prev);
        dispatch({ type: "TXN_OFF" });
        console.log(`dartar:${e.error.message}`);
        dispatch({ type: "TXN_RESULT", payload: e.error.message });

        // setTxnError(e.error.message);
        // setHaveTxnError((prev) => !prev);
      }
    } else {
      dispatch({
        type: "TXN_RESULT",
        payload: "Enter a Valid soccer player first name please!",
      });
      setPlayerIndex("");
    }
  }

  if (IsMetaMaskInstalled) {
    return (
      <main className="main-container">
        <header>
          <h2>Blockchain Voting</h2>

          <div className="Addresses">
            <div>
              Contract Address: <h4> {dataFromContract.contractAddress}</h4>
            </div>
            <div>
              Your address: <h4> {walletAddress}</h4>
            </div>
          </div>
        </header>
        {/* <img
          className="BlockchianImage"
          src="https://i.pinimg.com/564x/06/5f/37/065f371e9354245f3dfc8fa517eb99f9.jpg"
          alt="dartar"
        /> */}

        <Slider />
        <TxnResultModal />
        <div className="container">
          <div className="listOfProposal">
            <h4>Soccer Players</h4>
            <div>
              {dataFromContract.proposals.map((proposal) => {
                return (
                  <div key={proposal.key} className="avatar">
                    <img src={proposal.imgURL} alt="" />
                    <p>{proposal.Name},</p>
                    <h1>{dataFromContract.NumberOfVotes[proposal.key]} vote</h1>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="Vote2FootbalPlayer">
            <div className="voters">
              Number Of choosed voters by contract owner:
              <span> {dataFromContract.numOfVoter}</span>
              <div>
                {state.VOTERS.map((voter) => {
                  return <div key={voter.id}>{voter.address}.</div>;
                })}
              </div>
            </div>

            <form>
              <input
                placeholder="Enter first name of football player"
                onChange={(e) => setPlayerIndex(e.target.value)}
                value={PlayerIndex}
              />
              <button onClick={vote}>Vote</button>
            </form>
          </div>
        </div>
        <div className="winner">
          <h2>Most popular soccer player is :</h2>
          <p>{winner}</p>
        </div>
        {isContractOwner ? <AdminPanel /> : null}
        <TxnModal />
        <ContactMe />
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
