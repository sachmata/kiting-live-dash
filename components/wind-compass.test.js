import { windDirectionCode } from './wind-compass'

describe('WindDirectionCode', () => {
    it('returns North for empty', () => {
        const code = windDirectionCode()

        expect(code).toBe('n')
    })
})
