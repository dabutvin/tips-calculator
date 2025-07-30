'use client'

import React, { useState } from 'react'
import styles from '../styles/CusipList.module.css'
import { validateCusip, validateFaceValue } from '../utils/validation'

export default function CusipForm({ onAddCusip, onError }) {
    const [cusipError, setCusipError] = useState('')
    const [faceValueError, setFaceValueError] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()

        const cusipId = event.target['cusipId'].value.trim()
        const faceValue = event.target['faceValue'].value.trim()

        // Validate CUSIP before submission
        const validationError = validateCusip(cusipId)
        if (validationError) {
            setCusipError(validationError)
            return
        }

        // Validate face value before submission
        const faceValueValidationError = validateFaceValue(faceValue)
        if (faceValueValidationError) {
            setFaceValueError(faceValueValidationError)
            return
        }

        const newCusip = {
            cusipId: cusipId,
            faceValue: faceValue,
        }

        // Call parent handler
        const success = onAddCusip(newCusip)
        if (!success) {
            onError('Failed to save CUSIP')
            return
        }

        // Reset form
        setCusipError('')
        setFaceValueError('')
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
                    {cusipError && <div className={styles.error}>{cusipError}</div>}
                </div>
                <div>
                    <label>
                        Face Value:
                        <div
                            style={{ position: 'relative', display: 'inline-block', width: '100%' }}
                        >
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
                                name="faceValue"
                                type="number"
                                placeholder="Enter dollar amount"
                                className={styles.input}
                                style={{ paddingLeft: '2rem' }}
                                required
                            />
                        </div>
                    </label>
                    {faceValueError && <div className={styles.error}>{faceValueError}</div>}
                </div>
                <button type="submit" className={styles.submitBtn}>
                    Add
                </button>
            </form>
        </div>
    )
}
