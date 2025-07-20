import { useState, useCallback } from 'react'
import { clearLocalStorage } from '../utils/localStorage'

export function useClearAllData({
    setCusips,
    setCusipData,
    setHighlightedCusip,
    shouldHighlightNext,
    showNotification,
}) {
    const [showClearConfirmation, setShowClearConfirmation] = useState(false)

    const handleClearAllData = useCallback(() => {
        const result = clearLocalStorage()
        if (result.success) {
            // Clear local state
            setCusips([])
            setCusipData({})
            setHighlightedCusip(null)
            shouldHighlightNext.current = false
            showNotification('All data cleared successfully', 'success')
        } else {
            console.error('Failed to clear localStorage:', result.error)
            showNotification('Failed to clear data', 'error')
        }
        setShowClearConfirmation(false)
    }, [setCusips, setCusipData, setHighlightedCusip, shouldHighlightNext, showNotification])

    const handleClearAllDataClick = useCallback(() => {
        setShowClearConfirmation(true)
    }, [])

    const handleCancelClear = useCallback(() => {
        setShowClearConfirmation(false)
    }, [])

    return {
        showClearConfirmation,
        handleClearAllData,
        handleClearAllDataClick,
        handleCancelClear,
    }
}
