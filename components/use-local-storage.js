import { useState, useEffect } from 'react'

export default function useLocalStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        let currentValue

        try {
            const _value = localStorage.getItem(key)
            if (_value === null) {
                throw new Error('empty')
            }

            currentValue = JSON.parse(_value)
        } catch (error) {
            currentValue = defaultValue
        }

        return currentValue
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}
