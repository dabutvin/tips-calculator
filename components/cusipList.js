'use client'

import React, { useState, useEffect, useCallback, memo } from 'react'
import CusipDetails from '../components/cusipDetails'
import Notification from '../components/Notification'
import SortControl from '../components/SortControl'
import styles from '../styles/CusipList.module.css'
import { useCusipSorting } from '../hooks/useCusipSorting'
import { useCusipStorage } from '../hooks/useCusipStorage'
import { useCollapseState } from '../hooks/useCollapseState'
import { useNotification } from '../hooks/useNotification'
import { validateCusip, validateOriginalPrincipal } from '../utils/validation'

// Memoized CusipDetails wrapper to prevent unnecessary re-renders
const MemoizedCusipDetails = memo(CusipDetails)

export default function CusipList() {
    // Custom hooks
    const { 
        cusips, 
        storageAvailable, 
        loading, 
        error: storageError, 
        addCusip, 
        removeCusip, 
        clearError: clearStorageError 
    } = useCusipStorage()
    
    const { notification, showNotification, clearNotification } = useNotification()
    const { 
        allCollapsed, 
        toggleAllCollapsed, 
        addCollapsedState, 
        removeCollapsedState, 
        getCollapsedState, 
        createToggleCallback 
    } = useCollapseState()
    
    const [cusipData, setCusipData] = useState({}) // Store data from CusipDetails components
    const [cusipError, setCusipError] = useState('')
    const [originalPrincipalError, setOriginalPrincipalError] = useState('')

    // Use the custom sorting hook
    const { sortedCusips, sortBy, sortDirection, handleSortChange } = useCusipSorting(cusips, cusipData)

    // Show storage errors as notifications
    useEffect(() => {
        if (storageError) {
            showNotification(storageError, 'error')
            clearStorageError()
        }
    }, [storageError, showNotification, clearStorageError])

    // Function to handle data updates from CusipDetails components - memoized to prevent infinite loops
    const handleCusipDataUpdate = useCallback((data) => {
        setCusipData(prev => ({
            ...prev,
            [data.cusipId]: data
        }))
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

        // Add CUSIP using storage hook
        const success = addCusip(newCusip)
        if (!success) {
            showNotification('Failed to save CUSIP', 'error')
            return
        }

        // Add collapsed state for new CUSIP
        addCollapsedState(cusipId)

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

    const handleRemoveCusip = useCallback((cusipId) => {
        // Remove CUSIP using storage hook
        const success = removeCusip(cusipId)
        if (!success) {
            showNotification('Failed to remove CUSIP', 'error')
            return
        }

        // Remove collapsed state
        removeCollapsedState(cusipId)

        // Remove cached data for this CUSIP
        setCusipData(prev => {
            const newData = { ...prev }
            delete newData[cusipId]
            return newData
        })
    }, [removeCusip, removeCollapsedState, showNotification])

    // Create stable callback for remove
    const createRemoveCallback = useCallback((cusipId) => {
        return () => handleRemoveCusip(cusipId)
    }, [handleRemoveCusip])

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

            {cusips.length > 0 && (
                <div className={styles.cardsHeader}>
                    <button
                        onClick={() => toggleAllCollapsed(cusips)}
                        className={styles.toggleAllBtn}
                    >
                        {allCollapsed ? 'Expand All' : 'Collapse All'}
                    </button>
                    <SortControl 
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        onSortChange={handleSortChange}
                    />
                </div>
            )}

            {sortedCusips.map(({ cusipId, originalPrincipal }, index) => (
                <div key={cusipId} className={styles['cusip-card']}>
                    <MemoizedCusipDetails 
                        cusip={cusipId} 
                        originalPrincipal={originalPrincipal} 
                        collapsed={getCollapsedState(cusipId)}
                        onToggle={createToggleCallback(cusipId)}
                        isCollapsed={getCollapsedState(cusipId)}
                        onRemove={createRemoveCallback(cusipId)}
                        onDataUpdate={handleCusipDataUpdate}
                    />
                </div>
            ))}
        </div>
    )
}
