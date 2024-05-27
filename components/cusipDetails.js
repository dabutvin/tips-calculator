'use client'

import { useEffect, useState } from 'react'
import { getCpiEntries } from '../actions/treasuryApi'
import styles from '../styles/CusipDetails.module.css'

export default function CusipDetails({ cusip }) {
    const [cpiEntries, setCpiEntries] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            let result = await getCpiEntries(cusip)
            setCpiEntries(result)
        }
        if (cusip) {
            fetchData().catch(console.error)
        }
    }, [cusip])

    return (
        <div className={styles.cusipDetails}>
            {cusip && <p>CUSIP: {cusip}</p>}
            {cpiEntries && (
                <div className={styles.cpiEntries}>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Index Ratio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cpiEntries?.map((entry) => (
                                <tr key={entry.uniqueKey}>
                                    <td>{new Date(entry.indexDate).toLocaleDateString()}</td>
                                    <td>{entry.dailyIndex}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
