'use client'

import React from 'react'
import styles from '../styles/TotalsComponent.module.css'

export default function TotalsComponent({ cusipData }) {
    // Calculate totals from cusipData
    const calculateTotals = () => {
        if (!cusipData || Object.keys(cusipData).length === 0) {
            return {
                totalCurrentActive: 0,
                totalCurrentMature: 0,
                totalFaceValue: 0,
            }
        }

        const totals = Object.values(cusipData).reduce(
            (acc, data) => {
                if (data.adjustedPrincipal !== undefined && data.faceValue !== undefined) {
                    acc.totalFaceValue += data.faceValue

                    // Separate mature TIPS from active ones
                    if (data.isMature) {
                        acc.totalCurrentMature += data.adjustedPrincipal
                    } else {
                        acc.totalCurrentActive += data.adjustedPrincipal
                    }
                }
                return acc
            },
            {
                totalCurrentActive: 0,
                totalCurrentMature: 0,
                totalFaceValue: 0,
            },
        )

        return totals
    }

    const { totalCurrentActive, totalCurrentMature, totalFaceValue } = calculateTotals()

    // Don't render if no data
    if (!cusipData || Object.keys(cusipData).length === 0) {
        return null
    }

    return (
        <div className={styles.totalsContainer}>
            <h2 className={styles.totalsTitle}>Portfolio Totals</h2>
            <div className={styles.totalsGrid}>
                {totalCurrentActive > 0 && (
                    <div className={styles.totalItem}>
                        <span className={styles.label}>Current Value:</span>
                        <span className={styles.value}>
                            $
                            {totalCurrentActive.toLocaleString('en-US', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                        </span>
                    </div>
                )}
                {totalCurrentMature > 0 && (
                    <div className={styles.totalItem}>
                        <span className={styles.label}>Mature Value:</span>
                        <span className={styles.value}>
                            $
                            {totalCurrentMature.toLocaleString('en-US', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                        </span>
                    </div>
                )}
                <div className={styles.totalItem}>
                    <span className={styles.label}>Face Value:</span>
                    <span className={styles.value}>
                        $
                        {totalFaceValue.toLocaleString('en-US', {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })}
                    </span>
                </div>
            </div>
        </div>
    )
}
