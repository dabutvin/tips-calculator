'use client'

import { format } from 'fecha'
import { useEffect, useState } from 'react'
import { getCpiEntries, getSecurityDetails } from '../actions/treasuryApi'
import styles from '../styles/CusipDetails.module.css'

export default function CusipDetails({ cusip, originalPrincipal }) {
    const [cpiEntries, setCpiEntries] = useState(null)
    const [securityDetails, setSecurityDetails] = useState(null)
    const [currentCpiEntry, setCurrentCpiEntry] = useState(null)
    const [adjustedPrincipal, setAdjustedPrincipal] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            let cpiEntriesResponse = await getCpiEntries(cusip)
            setCpiEntries(cpiEntriesResponse)

            let securityDetailsResponse = await getSecurityDetails(cusip)
            setSecurityDetails(securityDetailsResponse)

            // find today's entry by matching the current date with the indexDate
            let todaysEntry = cpiEntriesResponse.find(
                (entry) => entry.indexDate == format(new Date(), 'YYYY-MM-DDT00:00:00'),
            )
            setCurrentCpiEntry(todaysEntry)
            setAdjustedPrincipal((todaysEntry?.dailyIndex * originalPrincipal).toFixed(2))
        }
        if (cusip) {
            fetchData().catch(console.error)
        }
    }, [cusip])

    return (
        <div className={styles.cusipDetails}>
            <p>CUSIP: {cusip}</p>
            <p>Current Adjusted Principal: ${adjustedPrincipal}</p>
            <p>Original Principal: ${originalPrincipal}</p>
            <p>Current Index Ratio: {Number(currentCpiEntry?.dailyIndex)}</p>
            <p>Security Term: {securityDetails?.securityTerm}</p>
            <p>Issue Date: {new Date(securityDetails?.issueDate).toLocaleDateString()}</p>
            <p>Maturity Date: {new Date(securityDetails?.maturityDate).toLocaleDateString()}</p>
            <p>Interest Rate: {Number(securityDetails?.interestRate).toFixed(2)}%</p>

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
                                <tr
                                    key={entry.uniqueKey}
                                    className={
                                        entry.dailyIndex == currentCpiEntry?.dailyIndex
                                            ? styles.current
                                            : ''
                                    }
                                >
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
