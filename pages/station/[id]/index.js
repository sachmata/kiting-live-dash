import { useCallback, useState } from 'react'
import CryptoJS from 'crypto-js'
import clsx from 'clsx'

import { useRouter } from 'next/router'
import Head from 'next/head'

import styles from '../../../styles/Station.module.css'

import usePoll from '../../../components/use-poll'
import kitingApi from '../../../kiting-api'
import WindCompass from '../../../components/wind-compass'
import useLocalStorage from '../../../components/use-local-storage'

const AES_KEY = CryptoJS.enc.Base64.parse('cU81RFoyR00zSlc3TVpPUQ==')

const POLL_DATA_TS = 20 * 1e3 // 20s
const POLL_OLD_DATA_TS = 7 * 1e3 // 7s
const OLD_DATA_TS = 3 * 60 * 1e3 // 3m

const KTS2MPS = 0.514444

export default function Station({ station }) {
    const router = useRouter()
    const { id } = router.query

    const [mps, setMps] = useLocalStorage('mps', false)
    const toggleMps = useCallback(() => setMps((mps) => !mps), [setMps])

    const [data, setData] = useState(null)

    const pollDataCb = useCallback(async () => {
        try {
            const apiRes = await fetch(`/api/kiting-live/observations/latest/v2/${id}`)
            if (apiRes.ok) {
                const _apiData = await apiRes.text()

                const ciphertext = CryptoJS.enc.Base64.parse(_apiData)
                const wordArray = CryptoJS.AES.decrypt({ ciphertext }, AES_KEY, { mode: CryptoJS.mode.ECB })
                const apiData = JSON.parse(wordArray.toString(CryptoJS.enc.Utf8))

                setData({ ...apiData, old: false })
            }
        } catch (err) {
            console.error(err)
        }
    }, [id])

    usePoll(pollDataCb, POLL_DATA_TS)

    const pollDataOldCb = useCallback(() => {
        setData((data) => {
            const now = Date.now()
            const dataTs = data?.timestamp ? new Date(data.timestamp) : null
            if (dataTs && now - dataTs > OLD_DATA_TS && !data.old) {
                return { ...data, old: true }
            }

            return data
        })
    }, [])

    usePoll(pollDataOldCb, POLL_OLD_DATA_TS)

    return (
        <div className={styles.container}>
            <Head>
                <title>{`kiting.live dash - ${station?.name ?? id ?? ''}`}</title>
            </Head>

            {/* <h1 className={styles.name}>{station.name}</h1> */}

            <WindCompass directionDegrees={data?.windDirectionDegrees} />

            <h2 className={styles.windSpeed}>
                {data?.windSpeedKnots ? (data.windSpeedKnots * (mps ? KTS2MPS : 1)).toFixed(1) : '--'}
                <span onClick={toggleMps}>{data ? (mps ? 'm/s' : 'kt') : ''}</span>
            </h2>

            <h3 className={styles.gustSpeed}>
                <span>Gust</span>
                {data?.windGustKnots ? (data.windGustKnots * (mps ? KTS2MPS : 1)).toFixed(1) : '--'}
                <span>{data ? (mps ? 'm/s' : 'kt') : ''}</span>
            </h3>

            <h3 className={styles.temperature}>
                {data?.temperature?.toFixed(1) ?? '--'}
                <span>&#8451;</span>
                &nbsp;
                {data?.humidityPercent?.toFixed(0) ?? '--'}
                <span>&#37;H</span>
            </h3>

            <p className={clsx(styles.timestamp, { [styles.old]: data?.old })}>
                {data?.timestamp ? new Date(data.timestamp).toLocaleString() : ''}
            </p>
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
