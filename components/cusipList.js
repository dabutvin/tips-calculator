'use client'

import React, { useState, useEffect, useCallback, memo, useRef } from 'react'
import CusipDetails from '../components/cusipDetails'
import CusipForm from '../components/CusipForm'
import Notification from '../components/Notification'
import SortControl from '../components/SortControl'
import ConfirmationDialog from '../components/ConfirmationDialog'
import DraggableCusipCard from '../components/DraggableCusipCard'
import Tooltip from '../components/Tooltip'
import styles from '../styles/CusipList.module.css'
import { useCusipSorting } from '../hooks/useCusipSorting'
import { useCusipStorage } from '../hooks/useCusipStorage'
import { useCollapseState } from '../hooks/useCollapseState'
import { useNotification } from '../hooks/useNotification'
import { useDragAndDrop } from '../hooks/useDragAndDrop'
import { useClearAllData } from '../hooks/useClearAllData'

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
        reorderCusips,
        clearError: clearStorageError,
        setCusips,
    } = useCusipStorage()

    const { notification, showNotification, clearNotification } = useNotification()
    const {
        allCollapsed,
        toggleAllCollapsed,
        addCollapsedState,
        removeCollapsedState,
        getCollapsedState,
        createToggleCallback,
    } = useCollapseState()

    const [cusipData, setCusipData] = useState({}) // Store data from CusipDetails components
    const [cusipToRemove, setCusipToRemove] = useState(null) // Track CUSIP to be removed (stores { uniqueId, cusipId, originalPrincipal })
    const [highlightedCusip, setHighlightedCusip] = useState(null) // Track CUSIP to highlight
    const shouldHighlightNext = useRef(false) // Flag to enable highlighting for next CUSIP

    // Use the clear all data hook
    const {
        showClearConfirmation,
        handleClearAllData,
        handleClearAllDataClick,
        handleCancelClear,
    } = useClearAllData({
        setCusips,
        setCusipData,
        setHighlightedCusip,
        shouldHighlightNext,
        showNotification,
    })

    // Use the custom sorting hook with reorder callback
    const { sortedCusips, sortBy, sortDirection, handleSortChange, handleReorder } =
        useCusipSorting(cusips, cusipData, reorderCusips)

    // Use the custom drag and drop hook
    const { dragState, handleDragStart, handleDragEnd, handleDragOver, handleDrop } =
        useDragAndDrop(handleReorder, showNotification)

    // Show storage errors as notifications
    useEffect(() => {
        if (storageError) {
            showNotification(storageError, 'error')
            clearStorageError()
        }
    }, [storageError, showNotification, clearStorageError])

    // Function to handle data updates from CusipDetails components - memoized to prevent infinite loops
    const handleCusipDataUpdate = useCallback((data) => {
        setCusipData((prev) => {
            const newData = {
                ...prev,
                [data.cusipId]: data,
            }

            // Only highlight if the flag is set and this is a new CUSIP
            if (shouldHighlightNext.current && !prev[data.cusipId] && data.uniqueId) {
                setHighlightedCusip(data.uniqueId)
                setTimeout(() => {
                    setHighlightedCusip(null)
                }, 1000)
            }

            return newData
        })
    }, [])

    const handleNewCusip = (newCusip) => {
        // Add CUSIP using storage hook (this will add the uniqueId)
        const result = addCusip(newCusip)
        if (!result.success) {
            return false
        }

        // Add collapsed state for new CUSIP using uniqueId
        addCollapsedState(result.cusip.uniqueId)

        // Enable highlighting for the next CUSIP that loads data
        shouldHighlightNext.current = true

        return true
    }

    const handleRemoveCusip = useCallback(
        (uniqueId) => {
            // Find the CUSIP to get its cusipId for user feedback
            const cusipToRemove = cusips.find((cusip) => cusip.uniqueId === uniqueId)

            // Remove CUSIP using storage hook
            const success = removeCusip(uniqueId)
            if (!success) {
                showNotification('Failed to remove CUSIP', 'error')
                return
            }

            // Remove collapsed state
            removeCollapsedState(uniqueId)

            // Remove cached data for this CUSIP (using cusipId for data cache)
            if (cusipToRemove) {
                setCusipData((prev) => {
                    const newData = { ...prev }
                    delete newData[cusipToRemove.cusipId]
                    return newData
                })
            }

            // Clear the confirmation dialog
            setCusipToRemove(null)
            showNotification('CUSIP removed successfully', 'success')
        },
        [removeCusip, removeCollapsedState, showNotification, cusips],
    )

    // Handle confirmation dialog
    const handleConfirmRemove = useCallback(() => {
        if (cusipToRemove) {
            handleRemoveCusip(cusipToRemove.uniqueId)
        }
    }, [cusipToRemove, handleRemoveCusip])

    const handleCancelRemove = useCallback(() => {
        setCusipToRemove(null)
    }, [])

    // Create stable callback for remove - now shows confirmation dialog
    const createRemoveCallback = useCallback(
        (uniqueId) => {
            return () => {
                const cusip = cusips.find((c) => c.uniqueId === uniqueId)
                setCusipToRemove({
                    uniqueId,
                    cusipId: cusip?.cusipId || 'Unknown',
                    originalPrincipal: cusip?.originalPrincipal || 'Unknown',
                })
            }
        },
        [cusips],
    )

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
                    <div className={styles.actionButtons}>
                        <SortControl
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            onSortChange={handleSortChange}
                        />
                        <button
                            onClick={() => toggleAllCollapsed(cusips)}
                            className={styles.toggleAllBtn}
                        >
                            {allCollapsed ? 'Expand All' : 'Collapse All'}
                        </button>
                        <div className={styles.clearButtonContainer}>
                            <button
                                onClick={handleClearAllDataClick}
                                className={styles.clearAllBtn}
                            >
                                Clear All Data
                            </button>
                            <Tooltip content="Data is stored only in your browser">ℹ️</Tooltip>
                        </div>
                    </div>
                </div>
            )}

            {sortedCusips.map(({ cusipId, originalPrincipal, uniqueId }, index) => (
                <DraggableCusipCard
                    key={uniqueId}
                    index={index}
                    isDragging={dragState.isDragging && dragState.draggedIndex === index}
                    sortBy={sortBy}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    highlight={highlightedCusip === uniqueId}
                >
                    <MemoizedCusipDetails
                        cusip={cusipId}
                        originalPrincipal={originalPrincipal}
                        onToggle={createToggleCallback(uniqueId)}
                        isCollapsed={getCollapsedState(uniqueId)}
                        onRemove={createRemoveCallback(uniqueId)}
                        onDataUpdate={handleCusipDataUpdate}
                        uniqueId={uniqueId}
                    />
                </DraggableCusipCard>
            ))}

            <ConfirmationDialog
                isOpen={!!cusipToRemove}
                message={`Are you sure you want to remove CUSIP ${cusipToRemove?.cusipId} (${cusipToRemove?.originalPrincipal ? `$${cusipToRemove.originalPrincipal}` : 'Unknown amount'}) from your list?`}
                confirmText="Remove"
                cancelText="Cancel"
                onConfirm={handleConfirmRemove}
                onCancel={handleCancelRemove}
            />

            <ConfirmationDialog
                isOpen={showClearConfirmation}
                message="Are you sure you want to clear all saved CUSIP data?"
                confirmText="Clear All"
                cancelText="Cancel"
                onConfirm={handleClearAllData}
                onCancel={handleCancelClear}
            />
        </div>
    )
}
