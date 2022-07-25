import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/router";
import Head from "next/head";

import styles from "../../styles/Station.module.css";

import usePoll from "../../components/use-poll";

export default function Station() {
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
                <title>kiting.live dash - {id}</title>
            </Head>

            <h2 className={styles.windSpeed}>{data?.windSpeedKnots ?? "--"}</h2>
        </div>
    );
}
