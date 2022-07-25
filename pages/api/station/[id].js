export default async function stationData(req, res) {
    const {
        method,
        query: { id },
    } = req;

    const stationId = Number(id);

    if (method !== "GET" || Number.isNaN(stationId)) {
        res.status(400).send("Bad request");
    }

    const KITING_LIVE_API = `https://kiting.live/api/observations/latest/${stationId}`;

    const apiRes = await fetch(KITING_LIVE_API);
    const apiData = await apiRes.json();

    res.status(apiRes.status).send(apiData);
}
