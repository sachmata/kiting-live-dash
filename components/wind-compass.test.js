import { windDirectionCode, WIND_DIRECTION_MAP } from './wind-compass'

describe('WindDirectionCode', () => {
    it('returns North for empty', () => {
        const code = windDirectionCode()

        expect(code).toBe('N')
    })

    for (const windCode in WIND_DIRECTION_MAP) {
        const [from, to] = WIND_DIRECTION_MAP[windCode]

        it(`returns '${windCode}' for positive [${from} - ${to}}]`, () => {
            const codeFrom = windDirectionCode(from)
            const codeTo = windDirectionCode(to - 1e-3)

            expect(codeFrom).toBe(windCode)
            expect(codeTo).toBe(windCode)
        })

        it(`returns '${windCode}' for negative [${from - 360} - ${to - 360}}]`, () => {
            const codeFrom = windDirectionCode(from - 360)
            const codeTo = windDirectionCode(to - 360 - 1e-3)

            expect(codeFrom).toBe(windCode)
            expect(codeTo).toBe(windCode)
        })

        it(`returns '${windCode}' for overflow [${from + 360} - ${to + 360}}]`, () => {
            const codeFrom = windDirectionCode(from + 360)
            const codeTo = windDirectionCode(to + 360 - 1e-3)

            expect(codeFrom).toBe(windCode)
            expect(codeTo).toBe(windCode)
        })
    }
})
