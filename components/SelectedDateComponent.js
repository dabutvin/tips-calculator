'use client'

import React from 'react'
import styles from '../styles/SelectedDateComponent.module.css'

export default function SelectedDateComponent({ selectedDate, onDateChange }) {
    const formatDateForDisplay = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    return (
        <div className={styles.dateContainer}>
            <div className={styles.dateGrid}>
                <div className={styles.dateItem}>
                    <span>Selected Date:</span>
                    <span className={styles.value}>{formatDateForDisplay(selectedDate)}</span>
                </div>
            </div>
        </div>
    )
}
