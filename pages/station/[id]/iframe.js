import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import Head from 'next/head'

import styles from '../../../styles/Station.module.css'

import usePoll from '../../../components/use-poll'
import WindCompass from '../../../components/wind-compass'

export { getStaticPaths, getStaticProps } from './index'

export default function Station({ station }) {
    const router = useRouter()
    const { id } = router.query

    const [data, setData] = useState(null)

    const pollCb = useCallback(async () => {
        try {
            const apiRes = await fetch(`/api/kiting-live/observations/latest/${id}`)
            if (apiRes.ok) {
                const apiData = await apiRes.json()
                setData(apiData)
            }
        } catch {}
    }, [id])

    usePoll(pollCb, 5e3)

    return (
        <div className={styles.container}>
            <Head>
                <title>{`kiting.live dash - ${station?.name ?? id ?? ''}`}</title>
            </Head>

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
