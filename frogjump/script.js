let connected = false;
const tokenAddress = "0xC3Df0c5405315A708176d1828F80C77f80f5DC7c";
let adminWalletAddress = "0x911a7F0f80d7A509C31445fD108C4D0c86bd66eF";
let provider;
let signer;

const chainList = {
  10: 'Optimism', 8453: 'Base', 7777777: "Zora"
}
const tokenABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
]

async function connectWallet() {
	if (typeof window.ethereum !== "undefined") {
        try {
        	provider = new ethers.providers.Web3Provider(window.ethereum);
        	await provider.send("eth_requestAccounts", []);
    			signer = await provider.getSigner();
    			const walletAddress = await signer.getAddress();
          const { chainId } = await provider.getNetwork();
          window.ethereum.on("chainChanged", (chainId) => {
            console.log(parseInt(chainId));
            setNetwork(parseInt(chainId));
          });
          setNetwork(chainId);
    			unityGame.SendMessage('ConnectWallet', 'GetWalletInfo', walletAddress.toLowerCase());
          connected = true;
    		} catch (error) {
    		  	console.error('Failed to connect to MetaMask:', error);
  		  }
    } 
}

function setNetwork(chainId) {
  if (chainId != 10 && chainId != 8453 && chainId != 7777777) {
    unityGame.SendMessage('ConnectWallet', 'setNetwork', JSON.stringify({"status": 'fail', "network": "Wrong Network"}))
  } else {
    unityGame.SendMessage('ConnectWallet', 'setNetwork', JSON.stringify({"status": 'success', "network": chainList[chainId]}))
  }
}

async function getTokenBalance () {
  if (!connected) {
    unityGame.SendMessage('Controller', 'setTokenBalance', "You need to connect wallet");
    await connectWallet();
  }
  // get token balance
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
  var balance = (await tokenContract.balanceOf((await signer.getAddress()))).toString();
  var tokenBalance = ethers.utils.formatEther(balance);
  unityGame.SendMessage('Controller', 'setTokenBalance', "Your token balance is " + tokenBalance);
}

async function buyCredit(amount) {
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
  try {
      var tx_amount = (BigInt)(amount * 1000000000000000000);
      const tx = await tokenContract.transfer(adminWalletAddress, tx_amount);
      console.log("Transaction submitted: ", tx.hash);

      // Wait for transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction mined: ", receipt.transactionHash);
      unityGame.SendMessage('Controller', 'SuccessBuy', `success:${receipt.transactionHash}`);
  } catch (error) {
      console.error("Error with convertToChips function: ", error);
      unityGame.SendMessage('Controller', 'SuccessBuy', "error");
  }
}

function checkConnected() {
  return connected;
}

function getNetwork() {
  console.log(connected)
}