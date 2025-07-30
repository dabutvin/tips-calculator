'use client'

import React from 'react'
import styles from '../styles/TotalsComponent.module.css'

export default function TotalsComponent({ cusipData }) {
    // Calculate totals from cusipData
    const calculateTotals = () => {
        if (!cusipData || Object.keys(cusipData).length === 0) {
            return { totalCurrent: 0, totalFaceValue: 0 }
        }

        const totals = Object.values(cusipData).reduce(
            (acc, data) => {
                if (data.adjustedPrincipal !== undefined && data.faceValue !== undefined) {
                    acc.totalCurrent += data.adjustedPrincipal
                    acc.totalFaceValue += data.faceValue
                }
                return acc
            },
            { totalCurrent: 0, totalFaceValue: 0 },
        )

        return totals
    }

    const { totalCurrent, totalFaceValue } = calculateTotals()

    // Don't render if no data
    if (!cusipData || Object.keys(cusipData).length === 0) {
        return null
    }

    const gainLoss = totalCurrent - totalFaceValue
    const isPositive = gainLoss >= 0

    return (
        <div className={styles.totalsContainer}>
            <h3 className={styles.totalsTitle}>Portfolio Summary</h3>
            <div className={styles.totalsGrid}>
                <div className={styles.totalItem}>
                    <span className={styles.label}>Total Current:</span>
                    <span className={styles.value}>
                        $
                        {totalCurrent.toLocaleString('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })}
                    </span>
                </div>
                <div className={styles.totalItem}>
                    <span className={styles.label}>Total Face Value:</span>
                    <span className={styles.value}>
                        $
                        {totalFaceValue.toLocaleString('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })}
                    </span>
                </div>
                <div className={styles.totalItem}>
                    <span className={styles.label}>Gain/Loss:</span>
                    <span
                        className={`${styles.value} ${isPositive ? styles.positive : styles.negative}`}
                    >
                        {isPositive ? '+' : ''}$
                        {gainLoss.toLocaleString('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })}
                    </span>
                </div>
            </div>
        </div>
    )
}
