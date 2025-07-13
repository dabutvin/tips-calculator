'use client'

import React, { useState, useEffect, useCallback, memo } from 'react'
import CusipDetails from '../components/cusipDetails'
import CusipForm from '../components/CusipForm'
import Notification from '../components/Notification'
import SortControl from '../components/SortControl'
import ConfirmationDialog from '../components/ConfirmationDialog'
import styles from '../styles/CusipList.module.css'
import { useCusipSorting } from '../hooks/useCusipSorting'
import { useCusipStorage } from '../hooks/useCusipStorage'
import { useCollapseState } from '../hooks/useCollapseState'
import { useNotification } from '../hooks/useNotification'

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
    const [cusipToRemove, setCusipToRemove] = useState(null) // Track CUSIP to be removed

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

    const handleNewCusip = (newCusip) => {
        // Add CUSIP using storage hook
        const success = addCusip(newCusip)
        if (!success) {
            return false
        }

        // Add collapsed state for new CUSIP
        addCollapsedState(newCusip.cusipId)
        return true
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

        // Clear the confirmation dialog
        setCusipToRemove(null)
        showNotification('CUSIP removed successfully', 'success')
    }, [removeCusip, removeCollapsedState, showNotification])

    // Handle confirmation dialog
    const handleConfirmRemove = useCallback(() => {
        if (cusipToRemove) {
            handleRemoveCusip(cusipToRemove)
        }
    }, [cusipToRemove, handleRemoveCusip])

    const handleCancelRemove = useCallback(() => {
        setCusipToRemove(null)
    }, [])

    // Create stable callback for remove - now shows confirmation dialog
    const createRemoveCallback = useCallback((cusipId) => {
        return () => setCusipToRemove(cusipId)
    }, [])

    if (loading) {
        return <div className={styles.cusipList}>Loading saved CUSIPs...</div>
    }

    return (
        <div className={styles.cusipList}>
            <Notification notification={notification} />

            <CusipForm 
                onAddCusip={handleNewCusip}
                onError={(message) => showNotification(message, 'error')}
            />

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

            <ConfirmationDialog 
                isOpen={!!cusipToRemove}
                message={`Are you sure you want to remove CUSIP ${cusipToRemove} from your list?`}
                confirmText="Remove"
                cancelText="Cancel"
                onConfirm={handleConfirmRemove}
                onCancel={handleCancelRemove}
            />
        </div>
    )
}
