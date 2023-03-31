import Head from "next/head"
import Image from "next/image"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
// import ManualHeader from "../components/ManualHeader"
import Header from "@/components/Header"
import RaffleEntrance from "@/components/RaffleEntrance"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    return (
        <>
            <Head>
                <title>Raffle</title>
                <meta name="description" content="Raffle FCC" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <RaffleEntrance />
        </>
    )
}
