'use client'

import React from 'react'
import { useFaceValueEditor } from '../hooks/useFaceValueEditor'
import styles from '../styles/CusipDetails.module.css'

export default function EditableFaceValue({
    value,
    onUpdate,
    className = '',
    showDollarSign = true,
}) {
    const {
        isEditing,
        tempValue,
        handleEditClick,
        handleSave,
        handleCancel,
        handleKeyDown,
        handleInputChange,
    } = useFaceValueEditor(value, onUpdate)

    if (isEditing) {
        return (
            <div className={styles.faceValueContainer}>
                <div className={styles.inputWrapper}>
                    {showDollarSign && <span className={styles.dollarPrefix}>$</span>}
                    <input
                        type="text"
                        value={tempValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className={`${styles.editableInput}`}
                        autoFocus
                    />
                </div>
                <div className={styles.editActions}>
                    <button onClick={handleSave} className={styles.saveBtn}>
                        ✓
                    </button>
                    <button onClick={handleCancel} className={styles.cancelBtn}>
                        ✕
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.faceValueContainer}>
            <span className={className}>
                {showDollarSign ? '$' : ''}
                {value}
            </span>
            <button onClick={handleEditClick} className={styles.editBtn}>
                ✎
            </button>
        </div>
    )
}
