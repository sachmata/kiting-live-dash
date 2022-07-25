import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>kiting.live dash</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Welcome to Kiting.live Dash</h1>

                <p className={styles.description}>Pick a station bellow</p>

                <div className={styles.grid}>
                    <Link href={"/station/20111"}>
                        <a>Gokceada, Volkite Kiteschool</a>
                    </Link>
                </div>
            </main>
        </div>
    );
}
