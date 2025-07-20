import { useState, useCallback } from 'react'

export function useDragAndDrop(onReorder, showNotification) {
    const [dragState, setDragState] = useState({
        isDragging: false,
        draggedIndex: null,
        dragOverIndex: null,
    })

    const handleDragStart = useCallback((index) => {
        setDragState((prev) => ({
            ...prev,
            isDragging: true,
            draggedIndex: index,
        }))
    }, [])

    const handleDragEnd = useCallback(() => {
        setDragState({
            isDragging: false,
            draggedIndex: null,
            dragOverIndex: null,
        })
    }, [])

    const handleDragOver = useCallback((index) => {
        setDragState((prev) => ({
            ...prev,
            dragOverIndex: index,
        }))
    }, [])

    const handleDrop = useCallback(
        (dropIndex) => {
            const { draggedIndex } = dragState
            if (draggedIndex !== null && draggedIndex !== dropIndex) {
                onReorder(draggedIndex, dropIndex)
                showNotification('CUSIP order updated', 'success')
            }
            setDragState({
                isDragging: false,
                draggedIndex: null,
                dragOverIndex: null,
            })
        },
        [dragState, onReorder, showNotification],
    )

    return {
        dragState,
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDrop,
    }
}
