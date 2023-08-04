import { useCallback, useState } from 'react'
import CryptoJS from 'crypto-js'

import { useRouter } from 'next/router'
import Head from 'next/head'

import styles from '../../../styles/Station.module.css'

import usePoll from '../../../components/use-poll'
import kitingApi from '../../../kiting-api'
import WindCompass from '../../../components/wind-compass'

const AES_KEY = CryptoJS.enc.Base64.parse('cU81RFoyR00zSlc3TVpPUQ==')

export default function Station({ station }) {
    const router = useRouter()
    const { id } = router.query

    const [data, setData] = useState(null)

    const pollCb = useCallback(async () => {
        try {
            const apiRes = await fetch(`/api/kiting-live/observations/latest/v2/${id}`)
            if (apiRes.ok) {
                const apiData = await apiRes.text()

                const ciphertext = CryptoJS.enc.Base64.parse(apiData)
                const wordArray = CryptoJS.AES.decrypt({ ciphertext }, AES_KEY, { mode: CryptoJS.mode.ECB })
                const _apiData = JSON.parse(wordArray.toString(CryptoJS.enc.Utf8))

                setData(_apiData)
            }
        } catch (err) {
            console.error(err)
        }
    }, [id])

    usePoll(pollCb, 5e3)

    return (
        <div className={styles.container}>
            <Head>
                <title>{`kiting.live dash - ${station?.name ?? id ?? ''}`}</title>
            </Head>

            {/* <h1 className={styles.name}>{station.name}</h1> */}

            <WindCompass directionDegrees={data?.windDirectionDegrees} />

            <h2 className={styles.windSpeed}>
                {data?.windSpeedKnots?.toFixed(1) ?? '--'}
                <span>kt</span>
            </h2>

            <h3 className={styles.gustSpeed}>
                <span>Gust</span>
                {data?.windGustKnots?.toFixed(1) ?? '--'}
                <span>kt</span>
            </h3>

            <p className={styles.timestamp}>{data?.timestamp ? new Date(data.timestamp).toLocaleString() : ''}</p>
        </div>
    )
}

export async function getStaticPaths() {
    let stations = []
    try {
        stations = await kitingApi.list()
    } catch (ex) {
        console.error('Unable to list stations', ex)
    }

    return {
        paths: stations.map(({ id }) => ({ params: { id: `${id}` } })),
        fallback: 'blocking',
    }
}

export async function getStaticProps({ params }) {
    let station = null
    try {
        station = await kitingApi.get(Number(params?.id))
    } catch (ex) {
        console.error('Unable to get station', ex)
    }

    if (!station) {
        return {
            notFound: true,
        }
    }

    return {
        props: {
            station,
        },
    }
}
