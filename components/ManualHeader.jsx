import {useMoralis} from "react-moralis"
import {useEffect} from "react"

export default function ManualHeader(){
    const {enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading} = useMoralis()

    // when isWeb3Enabled changes value
    useEffect(() =>{
        if(isWeb3Enabled) return
        if(typeof window != "undefined"){
            if (window.localStorage.getItem("connected")){
                enableWeb3()
            }
        }
    },[isWeb3Enabled])

    // with any re-fresh
    useEffect(() =>{
        Moralis.onAccountChanged((account) => {
            if(account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
            }
        })
    },[])

    return(<div>
 {account ? (<div>Connected to {account.slice(0,4)}...{account.slice(account.length-4)}</div>) : 
 (<button onClick={async () => {
    await enableWeb3()
    if(typeof window != "undefined"){
    window.localStorage.setItem("connected","injected")
    }
 
}} disabled={isWeb3EnableLoading}> {(isWeb3EnableLoading) ? "Connecting..." : "Connect" }</button>)}
 
    </div>)
}