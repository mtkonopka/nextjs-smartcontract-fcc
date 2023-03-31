import { useEffect, useState } from "react"
import {useMoralis, useWeb3Contract} from "react-moralis"
import { abi, contractAddresses } from "../constants"
import {ethers} from "ethers"
import { useNotification } from "web3uikit"

export default function RaffleEntrance() {
   const {chainId: chainIdHex, isWeb3Enabled} = useMoralis()
   const chainId = parseInt(chainIdHex)
   console.log(`ChainId: ${chainId}`)
   const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
   const [entranceFee, setEntranceFee] = useState("0")
   const [numberOfPlayers, setNumberOfPlayers] = useState("0")
   const [lastWinner, setLastWinner] = useState("0")
    const dispatch = useNotification();


    const {runContractFunction: getEntranceFee}  = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })  

    const {runContractFunction: getNumberOfPlayers}  = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })  

    const {runContractFunction: getLastWinner}  = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getLastWinner",
        params: {},
    })  

    async function updateUI(){
        if(raffleAddress){
        const entranceFeeFromContract = (await getEntranceFee())
        const numberOfPlayersFromContract = (await getNumberOfPlayers())
        const lastWinnerFromContract = await getLastWinner()
        setEntranceFee(entranceFeeFromContract)
        setLastWinner(lastWinnerFromContract.toString())
        setNumberOfPlayers(numberOfPlayersFromContract.toString())
        }
    }

    

    const {
        runContractFunction: enterRaffle,
        data: enterTxResponse,
        isLoading,
        isFetching,
        }  = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })  

    useEffect(() =>{
        if(isWeb3Enabled){
            updateUI()
            } 
        }
        ,[isWeb3Enabled,isLoading,isFetching])
        
        const handleSuccess = async function(tx){
        await tx.wait(1)
        handleNotification(tx)
        updateUI();
    }

    const handleNotification = function() {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Raffle Notification",
            position: "topR",
            icon: "bell",
        })
    }
    return(<div className="p-5">
        {raffleAddress ?(
        <div><button disabled={isLoading || isFetching} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4" onClick={async function(){await enterRaffle({
            onSuccess: handleSuccess,
            onError: (error) => console.log(error)
        })}}>{isLoading || isFetching ? (<div className="animate-spin spinner-border h-8 w-16 border-b-2 rounded-full"></div>): (<div>Enter Raffle</div>)}</button><br/>
        Entrance Fee: {ethers.utils.formatUnits(entranceFee,"ether")} ETH<br/>
        Number of Players: {numberOfPlayers}<br/>
        Last Winner: {lastWinner}
        </div>) : (<div>Chain Id: {chainId} No Raffle Address on this network</div>) }
        </div>)
}