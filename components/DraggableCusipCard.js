'use client'

import React, { useState, useRef, useCallback } from 'react'
import styles from '../styles/CusipList.module.css'

export default function DraggableCusipCard({ 
    children, 
    index, 
    isDragging, 
    sortBy,
    onDragStart, 
    onDragEnd, 
    onDragOver, 
    onDrop 
}) {
    const [isDragOver, setIsDragOver] = useState(false)
    const cardRef = useRef(null)

    const handleDragStart = useCallback((e) => {
        // Allow drag to start from anywhere on the card
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/html', e.target.outerHTML)
        onDragStart(index)
    }, [index, onDragStart])

    const handleDragEnd = useCallback((e) => {
        setIsDragOver(false)
        onDragEnd()
    }, [onDragEnd, index])

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setIsDragOver(true)
        onDragOver(index)
    }, [index, onDragOver])

    const handleDragLeave = useCallback((e) => {
        // Only set drag over to false if we're leaving the card entirely
        if (!cardRef.current?.contains(e.relatedTarget)) {
            setIsDragOver(false)
        }
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        setIsDragOver(false)
        onDrop(index)
    }, [index, onDrop])

    // Only allow dragging when in "Manual" sort mode
    const isDraggable = sortBy === 'entry'

    return (
        <div
            ref={cardRef}
            className={`${styles['cusip-card']} ${isDraggable ? styles.draggable : ''} ${
                isDragging ? styles.dragging : ''
            } ${isDragOver ? styles.dragOver : ''}`}
            draggable={isDraggable}
            onDragStart={isDraggable ? handleDragStart : undefined}
            onDragEnd={isDraggable ? handleDragEnd : undefined}
            onDragOver={isDraggable ? handleDragOver : undefined}
            onDragLeave={isDraggable ? handleDragLeave : undefined}
            onDrop={isDraggable ? handleDrop : undefined}
        >
            {children}
        </div>
    )
} 