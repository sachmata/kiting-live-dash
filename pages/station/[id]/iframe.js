import { useCallback, useState } from 'react'
import CryptoJS from 'crypto-js'
import clsx from 'clsx'

import { useRouter } from 'next/router'
import Head from 'next/head'

import styles from '../../../styles/Station.module.css'

import usePoll from '../../../components/use-poll'
import WindCompass from '../../../components/wind-compass'
import useLocalStorage from '../../../components/use-local-storage'

export { getStaticPaths, getStaticProps } from './index'

const AES_KEY = CryptoJS.enc.Base64.parse('cU81RFoyR00zSlc3TVpPUQ==')

// const OLD_DATA_TS = 3 * 60 * 1e3 // 3m
const POLL_TS = 15 * 1e3 // 15s

const KTS2MPS = 0.514444

export default function Station({ station }) {
    const router = useRouter()
    const { id } = router.query

    const [mps, setMps] = useLocalStorage('mps', false)

    const toggleMps = useCallback(() => {
        setMps((mps) => !mps)
    }, [setMps])

    const [data, setData] = useState(null)

    const pollCb = useCallback(async () => {
        try {
            const apiRes = await fetch(`/api/kiting-live/observations/latest/v2/${id}`)
            if (apiRes.ok) {
                const _apiData = await apiRes.text()

                const ciphertext = CryptoJS.enc.Base64.parse(_apiData)
                const wordArray = CryptoJS.AES.decrypt({ ciphertext }, AES_KEY, { mode: CryptoJS.mode.ECB })
                const apiData = JSON.parse(wordArray.toString(CryptoJS.enc.Utf8))

                setData(apiData)
            }
        } catch (err) {
            console.error(err)
        }
    }, [id])

    usePoll(pollCb, POLL_TS)

    return (
        <div className={styles.container}>
            <Head>
                <title>{`kiting.live dash - ${station?.name ?? id ?? ''}`}</title>
            </Head>

            <WindCompass directionDegrees={data?.windDirectionDegrees} />

            {/* <button className="toggle" onClick={toggleMps}>
                {data ? (mps ? 'kts' : 'm/s') : ''}
            </button> */}

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

            <p className={clsx(styles.timestamp, { [styles.old]: false })}>
                {data?.timestamp ? new Date(data.timestamp).toLocaleString() : ''}
            </p>
        </div>
    )
}
