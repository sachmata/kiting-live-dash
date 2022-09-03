import clsx from 'clsx'
import { useMemo } from 'react'

// http://snowfence.umn.edu/Components/winddirectionanddegrees.htm
export const WIND_DIRECTION_MAP = {
    N: [348.75, 11.25],
    NNE: [11.25, 33.75],
    NE: [33.75, 56.25],
    ENE: [56.25, 78.75],
    E: [78.75, 101.25],
    ESE: [101.25, 123.75],
    SE: [123.75, 146.25],
    SSE: [146.25, 168.75],
    S: [168.75, 191.25],
    SSW: [191.25, 213.75],
    SW: [213.75, 236.25],
    WSW: [236.25, 258.75],
    W: [258.75, 281.25],
    WNW: [281.25, 303.75],
    NW: [303.75, 326.25],
    NNW: [326.25, 348.75],
}

const WIND_DIRECTION_CODE = Object.keys(WIND_DIRECTION_MAP)
const WIND_DIRECTION_SECTOR = 360 / WIND_DIRECTION_CODE.length

export function windDirectionCode(degrees) {
    let _degrees = ((degrees ?? 0) + WIND_DIRECTION_SECTOR / 2) % 360
    if (_degrees < 0) {
        _degrees += 360
    }

    const index = Math.floor(_degrees / WIND_DIRECTION_SECTOR)
    const code = WIND_DIRECTION_CODE[index]

    return code
}

export default function WindCompass({ directionDegrees }) {
    const windCode = useMemo(() => windDirectionCode(directionDegrees), [directionDegrees])

    return (
        <div className="compass">
            <div className="direction">
                <p>{windCode?.toUpperCase() ?? ''}</p>
            </div>
            <div className={clsx('arrow', windCode?.toLowerCase())}></div>
        </div>
    )
}
