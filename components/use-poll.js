import { useEffect } from 'react'

export default function usePoll(func, interval = 5e3) {
    return useEffect(() => {
        let killed = false

        async function poll() {
            if (killed) return
            try {
                await func()
            } catch {}
            setTimeout(poll, interval)
        }

        poll()

        return () => {
            killed = true
        }
    }, [func, interval])
}
