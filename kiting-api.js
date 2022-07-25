import fs from "fs/promises";
import path from "path";

const { PHASE_PRODUCTION_BUILD } = require("next/constants");

const DB_FILE = "kiting.live.json";

async function exists(path) {
    try {
        await fs.access(path);
        return true;
    } catch {
        return false;
    }
}

const fetchStations = async () => {
    const res = await fetch("https://kiting.live/api/weather-stations");
    if (!res.ok) {
        throw new Error(res.statusText);
    }

    const stations = await res.json();

    return stations;
};

const listStations = async () => {
    // if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    //     const file = path.join(process.cwd(), DB_FILE);

    //     if (await !exists(file)) {
    //         const stations = await fetchStations();
    //         await fs.writeFile(file, JSON.stringify(stations));

    //         return stations;
    //     }

    //     const data = await fs.readFile(file);
    //     const stations = JSON.parse(data);
    //     return stations;
    // }

    return await fetchStations();
};

const getStation = async (id) => {
    const stations = await listStations();
    return stations.find((station) => station.id === id);
};

const kitingApi = {
    list: listStations,
    get: getStation,
};

export default kitingApi;
