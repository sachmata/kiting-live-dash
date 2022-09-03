import clsx from 'clsx'
import { useMemo } from 'react'

const WIND_DIRECTION_CODE = [
    'n',
    'nne',
    'ne',
    'ene',
    'e',
    'ese',
    'se',
    'sse',
    's',
    'ssw',
    'sw',
    'wsw',
    'w',
    'wnw',
    'nw',
    'nnw',
]

const WIND_DIRECTION_SECTOR = 360 / WIND_DIRECTION_CODE.length

export function windDirectionCode(degrees) {
    const direction = ((degrees ?? 0) + WIND_DIRECTION_SECTOR / 2) % 360
    const index = Math.round(direction / WIND_DIRECTION_SECTOR)
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
            <div className={clsx('arrow', windCode)}></div>
        </div>
    )
}
