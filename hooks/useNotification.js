import { useState, useCallback } from 'react'

export function useNotification(autoDismissTime = 3000) {
    const [notification, setNotification] = useState(null)

    const showNotification = useCallback(
        (message, type = 'error') => {
            setNotification({ message, type })
            setTimeout(() => setNotification(null), autoDismissTime)
        },
        [autoDismissTime],
    )

    const clearNotification = useCallback(() => {
        setNotification(null)
    }, [])

    return {
        notification,
        showNotification,
        clearNotification,
    }
}
