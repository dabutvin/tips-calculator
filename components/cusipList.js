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
        
        // Move focus back to CUSIP input
        const cusipInput = event.target.querySelector('input[name="cusipId"]')
        if (cusipInput) {
            cusipInput.focus()
        }
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

            <div className={styles['form-card']}>
                <form className={styles.form} onSubmit={handleNewCusip} autoComplete="off">
                    <div>
                        <label>
                            CUSIP:
                            <input
                                name="cusipId"
                                type="text"
                                maxLength={9}
                                placeholder="Enter 9-character CUSIP"
                                className={styles.input}
                                required
                            />
                        </label>
                        {cusipError && (
                            <div className={styles.error}>{cusipError}</div>
                        )}
                    </div>
                    <div>
                        <label>
                            Original Principal:
                            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                <span
                                    style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#666',
                                        fontSize: '1rem',
                                        zIndex: 1,
                                    }}
                                >
                                    $
                                </span>
                                <input
                                    name="originalPrincipal"
                                    type="number"
                                    placeholder="Enter dollar amount"
                                    className={styles.input}
                                    style={{ paddingLeft: '2rem' }}
                                    required
                                />
                            </div>
                        </label>
                        {originalPrincipalError && (
                            <div className={styles.error}>{originalPrincipalError}</div>
                        )}
                    </div>
                    <button type="submit" className={styles.submitBtn}>Add</button>
                </form>
            </div>

            {cusips.map(({ cusipId, originalPrincipal }, index) => (
                <div key={`${index}_${cusipId}`} className={styles['cusip-card']}>
                    <CusipDetails cusip={cusipId} originalPrincipal={originalPrincipal} />
                    <button
                        onClick={() => handleRemoveCusip(cusipId)}
                        className={styles['remove-btn']}
                    >
                        X
                    </button>
                </div>
            ))}
        </div>
    )
}
