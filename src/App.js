import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import React from 'react';
import logo from './cover.jpeg';
import ContractButtons from './ContractButtons';
import contractABI from './contractABI.json';
import "./App.css";
import VoteChart from './VoteChart';

function App() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const CONTRACT_ADDRESS = '0xbAEa03DBAe6dDB850A30EE8e060a23e637106170';

// Initialize chart data
  const [chartData, setChartData] = useState(
   Array.from({ length: 8 }, (_, index) => ({
      optionIndex: index,
      totalTokens: 0,
    }))
  );


  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  

  const setupVoteCastEventListener = async () => {
    if (!provider || !contract) return;
  
    contract.on('VoteCast', (optionIndex, totalTokens, event) => {
      setChartData((prevData) => {
        const newData = [...prevData];
        const index = newData.findIndex(
          (item) => item.optionIndex === optionIndex.toNumber()
        );
        if (index !== -1) {
          newData[index].totalTokens = totalTokens.toNumber();
        }
        return newData;
      });
    });
  };
  


  const handleButtonClick = async (index) => {
    console.log(`Button ${index} clicked`);
  
    if (!window.ethereum) {
      alert('Please install MetaMask to use this dApp!');
      return;
    }
  
    
    const tokenAmount = parseInt(prompt('Enter the number of tokens you want to use for voting (0-50):'), 10);
    if (isNaN(tokenAmount) || tokenAmount < 0 || tokenAmount > 50) {
      alert('Invalid token amount. Please enter a number between 0 and 50.');
      return;
    }
  
    try {
      const tx = await contract.vote(index, tokenAmount);
      console.log('Transaction:', tx);
      alert('Vote submitted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to submit the vote');
    }
  };

  useEffect(() => {
    setupVoteCastEventListener();
  }, [provider, contract]);
  
  
  useEffect(() => {
    const { ethereum } = window;
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      sethaveMetamask(true);
    };
    checkMetamaskAvailability();
  }, []);

  const fetchVoteCounts = async () => {
    console.log('Fetching vote counts...');
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
  
    const updatedChartData = [...chartData];
  
    try {
      for (let i = 0; i < 8; i++) {
        const [_, voteCount] = await contract.getOption(i);
        console.log(`Vote count for index ${i}:`, (await voteCount).toString());
        updatedChartData[i] = { ...updatedChartData[i], totalTokens: (await voteCount).toNumber() };
      }
      setChartData(updatedChartData);
    } catch (err) {
      console.error(err);
      alert('Error fetching vote counts');
    }
  };
  
  
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask to use this dApp!');
      return;
    }

    // Request user to switch to the Polygon Mumbai Testnet
    const polygonMumbaiTestnetChainId = '0x13881';
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: polygonMumbaiTestnetChainId }],
      });
    } catch (switchError) {
      console.error(switchError);
      alert('Please switch to the Polygon Mumbai Testnet');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccountAddress(accounts[0]);
      setIsConnected(true);
    } catch (err) {
      console.error(err);
      alert('Failed to connect wallet');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {haveMetamask ? (
          <div className="inner-container">
            {isConnected ? (
              <div className="card">
                <div className="card-row">
                  <h3>Wallet Address:</h3>
                  <p>
                    {accountAddress.slice(0, 4)}...
                    {accountAddress.slice(38, 42)}
                  </p>
                </div>
              </div>
            ) : (
              <img
                src={logo}
                className="App-logo"
                alt="logo"
                width="500"
                height="200"
              ></img>
            )}
            {isConnected ? (
              <>
                <p className="info">🎉 Connected Successfully</p>
                <ContractButtons onButtonClick={handleButtonClick} />
                <VoteChart data={chartData} />
                <button className="btn" onClick={fetchVoteCounts}>
                  Fetch Vote Counts
                </button>
              </>
            ) : (
              <button className="btn" onClick={connectWallet}>
                Connect
              </button>
            )}
          </div>
        ) : (
          <p>Please Install MetaMask</p>
        )}
      </header>
    </div>
  );
        }  
  export default App;
  
