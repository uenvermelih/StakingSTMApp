import './App.css';
import { ConnectWallet } from "@thirdweb-dev/react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useAddress } from "@thirdweb-dev/react";

import {ethers} from "ethers";
import { Web3Button } from "@thirdweb-dev/react";
import { useState } from 'react';
import "./styles/home.css"

const stakingAddress= "0xFf272BD34DeA0dB192633756590f9188A33a44A8";


function App() {

  
  const { contract: stakingContract, isLoading: isStakingContractLoading} = useContract(stakingAddress);

  const {contract: stakingToken, isLoading: isStakingTokenLoading} = useContract("0xac49447Db96FFe35bd3344cf5aBD2d7d23A78ae1");

  console.log(stakingToken);
  
  const address = useAddress(); //sor
  
  const { data, isLoading } = useContractRead(stakingContract, "getStakeInfo", [address] );

  const[amountToStake, setAmountToStake] = useState(0);

  
  return (
    <>
      <div className="container">
        <main className="main">
          <h1 className="title">Future of finance 🇫🇷</h1>
​
          <p className="description">
            Stake and get reward tokens
          </p>
​
          <div className="connect">
            <ConnectWallet />
          </div>

​          {address && 
          <div className='stakeContainer'>

            <input className='textbox' 
                   type='number' 
                   value={amountToStake} 
                   onChange={(e) => setAmountToStake(e.target.value)}/>

            

            <Web3Button
              contractAddress={stakingAddress}
              action={async (contract) =>  {

                await stakingToken.setAllowance(stakingAddress, amountToStake)

                await contract.call("stake", [ethers.utils.parseEther(amountToStake)])
              }}
              theme="dark">

              Stake

            </Web3Button>

            <Web3Button
              contractAddress={stakingAddress}
              action={async (contract) =>  {

                await contract.call("withdraw", [ethers.utils.parseEther(amountToStake)])

              }}
              theme="dark">

              Unstake

            </Web3Button>

            <Web3Button
              contractAddress={stakingAddress}
              action={async (contract) =>  {

                await contract.call("claimRewards")

              }}
              theme="dark">

              Claim Rewards

            </Web3Button>
          </div>}



          <div className="grid">
          <a className="card">
          Staked: {data?._tokensStaked && ethers.utils.formatEther(data?._tokensStaked)} UT <br></br>
          </a>
          <a className="card">
          Rewards: {data?._rewards && Number(ethers.utils.formatEther(data?._rewards)).toFixed(2)} MET
          </a>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
