'use client'

import React, { useState, useEffect } from 'react'
import CusipDetails from '../components/cusipDetails'
import Notification from '../components/Notification'
import styles from '../styles/CusipList.module.css'
import {
    loadCusipsFromStorage,
    addCusipToStorage,
    removeCusipFromStorage,
    isLocalStorageAvailable,
} from '../utils/localStorage'
import { validateCusip, validateOriginalPrincipal } from '../utils/validation'

export default function CusipList() {
    const [cusips, setCusips] = useState([])
    const [storageAvailable, setStorageAvailable] = useState(true)
    const [loading, setLoading] = useState(true)
    const [notification, setNotification] = useState(null)
    const [cusipError, setCusipError] = useState('')
    const [originalPrincipalError, setOriginalPrincipalError] = useState('')

    // Show notification helper (only for errors)
    const showNotification = (message, type = 'error') => {
        if (type === 'error') {
            setNotification({ message, type })
            setTimeout(() => setNotification(null), 3000)
        }
    }

    // Load saved CUSIPs on component mount
    useEffect(() => {
        const loadSavedCusips = async () => {
            setLoading(true)

            // Check if localStorage is available
            const available = isLocalStorageAvailable()
            setStorageAvailable(available)

            if (!available) {
                console.warn('localStorage is not available. Data will not persist.')
                showNotification('localStorage is not available. Data will not persist.', 'error')
                setLoading(false)
                return
            }

            // Load data from localStorage
            const result = loadCusipsFromStorage()
            if (result.success) {
                setCusips(result.data)
            } else {
                console.error('Failed to load CUSIPs from localStorage:', result.error)
                showNotification('Failed to load saved data', 'error')
            }

            setLoading(false)
        }

        loadSavedCusips()
    }, [])

    const handleNewCusip = (event) => {
        event.preventDefault()

        const cusipId = event.target['cusipId'].value.trim()
        const originalPrincipal = event.target['originalPrincipal'].value.trim()

        // Validate CUSIP before submission
        const validationError = validateCusip(cusipId)
        if (validationError) {
            setCusipError(validationError)
            return
        }

        // Validate original principal before submission
        const originalPrincipalValidationError = validateOriginalPrincipal(originalPrincipal)
        if (originalPrincipalValidationError) {
            setOriginalPrincipalError(originalPrincipalValidationError)
            return
        }

        const newCusip = {
            cusipId: cusipId,
            originalPrincipal: originalPrincipal,
        }

        // Update local state
        const updatedCusips = [...cusips, newCusip]
        setCusips(updatedCusips)

        // Save to localStorage if available
        if (storageAvailable) {
            const result = addCusipToStorage(newCusip)
            if (!result.success) {
                console.error('Failed to save CUSIP to localStorage:', result.error)
                showNotification('Failed to save CUSIP', 'error')
            }
        }

        // Reset form
        setCusipError('')
        setOriginalPrincipalError('')
        event.target.reset()
    }

    const handleRemoveCusip = (cusipId) => {
        // Update local state
        const updatedCusips = cusips.filter((cusip) => cusip.cusipId !== cusipId)
        setCusips(updatedCusips)

        // Remove from localStorage if available
        if (storageAvailable) {
            const result = removeCusipFromStorage(cusipId)
            if (!result.success) {
                console.error('Failed to remove CUSIP from localStorage:', result.error)
                showNotification('Failed to remove CUSIP', 'error')
            }
        }
    }

    if (loading) {
        return <div className={styles.cusipList}>Loading saved CUSIPs...</div>
    }

    return (
        <div className={styles.cusipList}>
            <Notification notification={notification} />

            {!storageAvailable && (
                <div
                    style={{
                        backgroundColor: '#fff3cd',
                        color: '#856404',
                        padding: '10px',
                        marginBottom: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ffeaa7',
                    }}
                >
                    ⚠️ localStorage is not available. Your data will not persist between sessions.
                </div>
            )}

            <form onSubmit={handleNewCusip}>
                <div>
                    <label>
                        CUSIP:{' '}
                        <input
                            name="cusipId"
                            type="text"
                            maxLength={9}
                            placeholder="Enter 9-character CUSIP"
                            style={{
                                border: cusipError ? '2px solid #dc3545' : '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '8px',
                                fontSize: '14px',
                            }}
                            required
                        />
                    </label>
                    {cusipError && (
                        <div
                            style={{
                                color: '#dc3545',
                                fontSize: '12px',
                                marginTop: '4px',
                                marginBottom: '8px',
                            }}
                        >
                            {cusipError}
                        </div>
                    )}
                </div>
                <div>
                    <label>
                        Original Principal:{' '}
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <span
                                style={{
                                    position: 'absolute',
                                    left: '8px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#666',
                                    fontSize: '14px',
                                    zIndex: 1,
                                }}
                            >
                                $
                            </span>
                            <input
                                name="originalPrincipal"
                                type="number"
                                placeholder="Enter dollar amount"
                                style={{
                                    border: originalPrincipalError
                                        ? '2px solid #dc3545'
                                        : '1px solid #ccc',
                                    borderRadius: '4px',
                                    padding: '8px 8px 8px 20px',
                                    fontSize: '14px',
                                }}
                                required
                            />
                        </div>
                    </label>
                    {originalPrincipalError && (
                        <div
                            style={{
                                color: '#dc3545',
                                fontSize: '12px',
                                marginTop: '4px',
                                marginBottom: '8px',
                            }}
                        >
                            {originalPrincipalError}
                        </div>
                    )}
                </div>
                <button type="submit">Add</button>
            </form>

            {cusips.map(({ cusipId, originalPrincipal }, index) => (
                <div key={`${index}_${cusipId}`} style={{ position: 'relative' }}>
                    <CusipDetails cusip={cusipId} originalPrincipal={originalPrincipal} />
                    <button
                        onClick={() => handleRemoveCusip(cusipId)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '5px 10px',
                            cursor: 'pointer',
                            fontSize: '12px',
                        }}
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    )
}
