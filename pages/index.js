import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import kitingApi from '../kiting-api'
import styles from '../styles/Home.module.css'

export default function Home({ stations }) {
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
                    <ul>
                        {stations?.map(({ id, name }) => (
                            <li key={id}>
                                <Link href={`/station/${id}`}>
                                    <a>{name}</a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    )
}

export async function getStaticProps() {
    let stations = []
    try {
        stations = await kitingApi.list()
    } catch (ex) {
        console.error('Unable to list stations', ex)
    }

    return {
        props: {
            stations,
        },
    }
}
