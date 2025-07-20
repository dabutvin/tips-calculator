'use client'

import React from 'react'
import styles from '../styles/CusipList.module.css'

const ConfirmationDialog = ({
    isOpen,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) return null

    return (
        <div className={styles.confirmationOverlay}>
            <div className={styles.confirmationDialog}>
                <p>{message}</p>
                <div className={styles.confirmationButtons}>
                    <button onClick={onConfirm} className={styles.confirmButton}>
                        {confirmText}
                    </button>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationDialog
