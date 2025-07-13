'use client'

import React, { useState } from 'react'
import styles from '../styles/CusipList.module.css'
import { validateCusip, validateOriginalPrincipal } from '../utils/validation'

export default function CusipForm({ onAddCusip, onError }) {
    const [cusipError, setCusipError] = useState('')
    const [originalPrincipalError, setOriginalPrincipalError] = useState('')

    const handleSubmit = (event) => {
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

        // Call parent handler
        const success = onAddCusip(newCusip)
        if (!success) {
            onError('Failed to save CUSIP')
            return
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

    return (
        <div className={styles['form-card']}>
            <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
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
    )
} 