import { useState, useEffect, useCallback } from 'react'
import {
    loadCusipsFromStorage,
    addCusipToStorage,
    removeCusipFromStorage,
    saveCusipsToStorage,
    isLocalStorageAvailable,
} from '../utils/localStorage'

export function useCusipStorage() {
    const [cusips, setCusips] = useState([])
    const [storageAvailable, setStorageAvailable] = useState(true)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Load saved CUSIPs on mount
    useEffect(() => {
        const loadSavedCusips = async () => {
            setLoading(true)
            setError(null)

            // Check if localStorage is available
            const available = isLocalStorageAvailable()
            setStorageAvailable(available)

            if (!available) {
                console.warn('localStorage is not available. Data will not persist.')
                setError('localStorage is not available. Data will not persist.')
                setLoading(false)
                return
            }

            // Load data from localStorage
            const result = loadCusipsFromStorage()
            if (result.success) {
                setCusips(result.data)
            } else {
                console.error('Failed to load CUSIPs from localStorage:', result.error)
                setError('Failed to load saved data')
            }

            setLoading(false)
        }

        loadSavedCusips()
    }, [])

    // Add a new CUSIP
    const addCusip = useCallback(
        (newCusip) => {
            // Create a CUSIP with a unique ID for React keys
            const cusipWithUniqueId = {
                ...newCusip,
                uniqueId: `${newCusip.cusipId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            }

            // Update local state
            setCusips((prev) => [...prev, cusipWithUniqueId])

            // Save to localStorage if available
            if (storageAvailable) {
                const result = addCusipToStorage(cusipWithUniqueId)
                if (!result.success) {
                    console.error('Failed to save CUSIP to localStorage:', result.error)
                    setError('Failed to save CUSIP')
                    return { success: false }
                }
            }

            return { success: true, cusip: cusipWithUniqueId }
        },
        [storageAvailable],
    )

    // Remove a CUSIP
    const removeCusip = useCallback(
        (uniqueId) => {
            // Update local state
            setCusips((prev) => prev.filter((cusip) => cusip.uniqueId !== uniqueId))

            // Remove from localStorage if available
            if (storageAvailable) {
                const result = removeCusipFromStorage(uniqueId)
                if (!result.success) {
                    console.error('Failed to remove CUSIP from localStorage:', result.error)
                    setError('Failed to remove CUSIP')
                    return false
                }
            }

            return true
        },
        [storageAvailable],
    )

    // Reorder CUSIPs (for drag and drop)
    const reorderCusips = useCallback(
        (fromIndex, toIndex) => {
            setCusips((prev) => {
                const newCusips = [...prev]
                const [movedCusip] = newCusips.splice(fromIndex, 1)
                newCusips.splice(toIndex, 0, movedCusip)
                return newCusips
            })

            // Save to localStorage if available
            if (storageAvailable) {
                const currentData = loadCusipsFromStorage()
                if (currentData.success) {
                    const newCusips = [...currentData.data]
                    const [movedCusip] = newCusips.splice(fromIndex, 1)
                    newCusips.splice(toIndex, 0, movedCusip)
                    const result = saveCusipsToStorage(newCusips)
                    if (!result.success) {
                        console.error(
                            'Failed to save reordered CUSIPs to localStorage:',
                            result.error,
                        )
                        setError('Failed to save reordered CUSIPs')
                        return false
                    }
                }
            }

            return true
        },
        [storageAvailable],
    )

    // Update CUSIP face value
    const updateCusipFaceValue = useCallback(
        (uniqueId, newFaceValue) => {
            // Update local state
            setCusips((prev) =>
                prev.map((cusip) =>
                    cusip.uniqueId === uniqueId ? { ...cusip, faceValue: newFaceValue } : cusip,
                ),
            )

            // Save to localStorage if available
            if (storageAvailable) {
                const currentData = loadCusipsFromStorage()
                if (currentData.success) {
                    const updatedCusips = currentData.data.map((cusip) =>
                        cusip.uniqueId === uniqueId ? { ...cusip, faceValue: newFaceValue } : cusip,
                    )
                    const result = saveCusipsToStorage(updatedCusips)
                    if (!result.success) {
                        console.error(
                            'Failed to save updated face value to localStorage:',
                            result.error,
                        )
                        setError('Failed to save updated face value')
                        return false
                    }
                }
            }

            return true
        },
        [storageAvailable],
    )

    // Clear error
    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return {
        cusips,
        setCusips,
        storageAvailable,
        loading,
        error,
        addCusip,
        removeCusip,
        reorderCusips,
        updateCusipFaceValue,
        clearError,
    }
}
