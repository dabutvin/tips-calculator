'use client'

import React from 'react'
import { useDateEditor } from '../hooks/useDateEditor'
import styles from '../styles/SelectedDateComponent.module.css'
import editStyles from '../styles/CusipDetails.module.css'

export default function SelectedDateComponent({ selectedDate, onDateChange, maxDate }) {
    const {
        isEditing,
        tempValue,
        handleEditClick,
        handleSave,
        handleCancel,
        handleKeyDown,
        handleInputChange,
        handleToday,
    } = useDateEditor(selectedDate, onDateChange, maxDate)

    const formatDateForDisplay = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    if (isEditing) {
        return (
            <div className={styles.dateContainer}>
                <div className={styles.dateGrid}>
                    <div className={styles.dateItem}>
                        <span>Date:</span>
                        <div className={editStyles.faceValueContainer}>
                            <div className={editStyles.inputWrapper}>
                                <input
                                    type="date"
                                    value={tempValue}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    className={editStyles.editableInput}
                                    autoFocus
                                />
                            </div>
                            <div className={editStyles.editActions}>
                                <button onClick={handleSave} className={editStyles.saveBtn}>
                                    ✓
                                </button>
                                <button onClick={handleCancel} className={editStyles.cancelBtn}>
                                    ✕
                                </button>
                                <button onClick={handleToday} className={editStyles.saveBtn}>
                                    Today
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.dateContainer}>
            <div className={styles.dateGrid}>
                <div className={styles.dateItem}>
                    <span>Date:</span>
                    <span className={styles.value}>
                        <div className={editStyles.faceValueContainer}>
                            <span>{formatDateForDisplay(selectedDate)}</span>
                            <button onClick={handleEditClick} className={editStyles.editBtn}>
                                ✎
                            </button>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    )
}
