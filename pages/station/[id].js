import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/router";
import Head from "next/head";

import styles from "../../styles/Station.module.css";

import usePoll from "../../components/use-poll";
import kitingApi from "../../kiting-api";

export default function Station({ station }) {
    const router = useRouter();

    const { id } = router.query;

    const [data, setData] = useState(null);

    const pollCb = useCallback(async () => {
        const apiRes = await fetch(`/api/station/${id}`);

        if (!apiRes.ok) {
            setData(null);
        } else {
            const apiData = await apiRes.json();
            setData(apiData);
        }
    }, [id]);

    usePoll(pollCb, 5e3);

    return (
        <div className={styles.container}>
            <Head>
                <title>{`kiting.live dash - ${id ?? ""}`}</title>
            </Head>

            <h1 className={styles.name}>{station.name}</h1>
            <h2 className={styles.windSpeed}>
                {data?.windSpeedKnots ?? "--"}
                <span>kt</span>
            </h2>
        </div>
    );
}

export async function getStaticPaths() {
    const stations = await kitingApi.list();

    return {
        paths: stations.map(({ id }) => ({ params: { id: `${id}` } })),
        fallback: "blocking",
    };
}

export async function getStaticProps({ params }) {
    let station = await kitingApi.get(Number(params?.id));

    if (!station) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            station,
        },
    };
}
