import { useState, useEffect, useCallback } from 'react'
import {
    loadCusipsFromStorage,
    addCusipToStorage,
    removeCusipFromStorage,
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
    const addCusip = useCallback((newCusip) => {
        // Update local state
        setCusips(prev => [...prev, newCusip])

        // Save to localStorage if available
        if (storageAvailable) {
            const result = addCusipToStorage(newCusip)
            if (!result.success) {
                console.error('Failed to save CUSIP to localStorage:', result.error)
                setError('Failed to save CUSIP')
                return false
            }
        }

        return true
    }, [storageAvailable])

    // Remove a CUSIP
    const removeCusip = useCallback((cusipId) => {
        // Update local state
        setCusips(prev => prev.filter((cusip) => cusip.cusipId !== cusipId))

        // Remove from localStorage if available
        if (storageAvailable) {
            const result = removeCusipFromStorage(cusipId)
            if (!result.success) {
                console.error('Failed to remove CUSIP from localStorage:', result.error)
                setError('Failed to remove CUSIP')
                return false
            }
        }

        return true
    }, [storageAvailable])

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
        clearError
    }
} 