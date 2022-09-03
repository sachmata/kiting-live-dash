import { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import Head from 'next/head'

import styles from '../../styles/Station.module.css'

import usePoll from '../../components/use-poll'
import kitingApi from '../../kiting-api'
import WindCompass from '../../components/wind-compass'

export default function Station({ station }) {
    const router = useRouter()

    const { id } = router.query

    const [data, setData] = useState(null)

    const pollCb = useCallback(async () => {
        const apiRes = await fetch(`/api/kiting-live/observations/latest/${id}`)

        let apiData = null
        if (apiRes.ok) {
            try {
                apiData = await apiRes.json()
            } catch {}
        }
        setData(apiData)
    }, [id])

    usePoll(pollCb, 5e3)

    return (
        <div className={styles.container}>
            <Head>
                <title>{`kiting.live dash - ${id ?? ''}`}</title>
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

            <p>{data?.timestamp ? new Date(data.timestamp).toLocaleString() : ''}</p>
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
