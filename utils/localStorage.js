// localStorage utility functions for CUSIP data management

const STORAGE_KEY = 'cusipData'

// Helper function to handle localStorage errors
const handleStorageError = (error, operation) => {
    console.error(`localStorage ${operation} failed:`, error)

    if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Consider clearing old data.')
        return { success: false, error: 'STORAGE_FULL' }
    }

    if (error.name === 'SecurityError') {
        console.warn('localStorage access denied. Check browser settings.')
        return { success: false, error: 'ACCESS_DENIED' }
    }

    return { success: false, error: 'UNKNOWN_ERROR' }
}

// Validate CUSIP data structure
export const validateCusipData = (data) => {
    if (!Array.isArray(data)) {
        return { valid: false, error: 'Data is not an array' }
    }

    for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (!item.cusipId || typeof item.cusipId !== 'string') {
            return { valid: false, error: `Invalid cusipId at index ${i}` }
        }
        if (!item.originalPrincipal || isNaN(Number(item.originalPrincipal))) {
            return { valid: false, error: `Invalid originalPrincipal at index ${i}` }
        }
    }

    return { valid: true }
}

// Save entire CUSIP array to localStorage
export const saveCusipsToStorage = (cusips) => {
    try {
        const dataToSave = cusips.map((cusip) => ({
            ...cusip,
            lastUpdated: new Date().toISOString(),
        }))

        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
        return { success: true }
    } catch (error) {
        return handleStorageError(error, 'save')
    }
}

// Load CUSIP array from localStorage
export const loadCusipsFromStorage = () => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY)

        if (!storedData) {
            return { success: true, data: [] }
        }

        const parsedData = JSON.parse(storedData)
        const validation = validateCusipData(parsedData)

        if (!validation.valid) {
            console.warn('Invalid data in localStorage, clearing:', validation.error)
            clearLocalStorage()
            return { success: true, data: [] }
        }

        return { success: true, data: parsedData }
    } catch (error) {
        console.warn('Error loading from localStorage, clearing:', error)
        clearLocalStorage()
        return { success: true, data: [] }
    }
}

// Add single CUSIP to localStorage
export const addCusipToStorage = (cusip) => {
    try {
        const currentData = loadCusipsFromStorage()
        if (!currentData.success) {
            return currentData
        }

        const newCusip = {
            ...cusip,
            addedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
        }

        const updatedData = [...currentData.data, newCusip]
        return saveCusipsToStorage(updatedData)
    } catch (error) {
        return handleStorageError(error, 'add')
    }
}

// Remove CUSIP from localStorage
export const removeCusipFromStorage = (cusipId) => {
    try {
        const currentData = loadCusipsFromStorage()
        if (!currentData.success) {
            return currentData
        }

        const updatedData = currentData.data.filter((cusip) => cusip.cusipId !== cusipId)
        return saveCusipsToStorage(updatedData)
    } catch (error) {
        return handleStorageError(error, 'remove')
    }
}

// Update existing CUSIP in localStorage
export const updateCusipInStorage = (cusipId, updates) => {
    try {
        const currentData = loadCusipsFromStorage()
        if (!currentData.success) {
            return currentData
        }

        const updatedData = currentData.data.map((cusip) =>
            cusip.cusipId === cusipId
                ? { ...cusip, ...updates, lastUpdated: new Date().toISOString() }
                : cusip,
        )

        return saveCusipsToStorage(updatedData)
    } catch (error) {
        return handleStorageError(error, 'update')
    }
}

// Clear all CUSIP data from localStorage
export const clearLocalStorage = () => {
    try {
        localStorage.removeItem(STORAGE_KEY)
        return { success: true }
    } catch (error) {
        return handleStorageError(error, 'clear')
    }
}

// Get storage statistics
export const getStorageStats = () => {
    try {
        const storedData = localStorage.getItem(STORAGE_KEY)
        if (!storedData) {
            return { count: 0, size: 0, lastUpdated: null }
        }

        const data = JSON.parse(storedData)
        const size = new Blob([storedData]).size
        const lastUpdated =
            data.length > 0
                ? Math.max(
                      ...data.map((item) => new Date(item.lastUpdated || item.addedAt).getTime()),
                  )
                : null

        return {
            count: data.length,
            size,
            lastUpdated: lastUpdated ? new Date(lastUpdated).toISOString() : null,
        }
    } catch (error) {
        console.error('Error getting storage stats:', error)
        return { count: 0, size: 0, lastUpdated: null }
    }
}

// Check if localStorage is available
export const isLocalStorageAvailable = () => {
    try {
        const test = '__localStorage_test__'
        localStorage.setItem(test, test)
        localStorage.removeItem(test)
        return true
    } catch (error) {
        return false
    }
}
