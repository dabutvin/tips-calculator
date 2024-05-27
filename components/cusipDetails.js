'use client'

import { format } from 'fecha'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'

import { useEffect, useState } from 'react'
import { getCpiEntries, getSecurityDetails } from '../actions/treasuryApi'
import styles from '../styles/CusipDetails.module.css'

export default function CusipDetails({ cusip, originalPrincipal }) {
    const [cpiEntries, setCpiEntries] = useState(null)
    const [securityDetails, setSecurityDetails] = useState(null)
    const [currentCpiEntry, setCurrentCpiEntry] = useState(null)
    const [adjustedPrincipal, setAdjustedPrincipal] = useState(null)
    const [cpiChartData, setCpiChartData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

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

            setCpiChartData(
                cpiEntriesResponse
                    .map((entry) => {
                        return {
                            indexDate: new Date(entry.indexDate).toLocaleDateString(),
                            dailyIndex: Number(entry.dailyIndex),
                            dailyAdjustedPrincipal: Number(
                                originalPrincipal * entry.dailyIndex,
                            ).toFixed(2),
                        }
                    })
                    .reverse(),
            )
        }
        if (cusip) {
            fetchData()
                .catch(console.error)
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [cusip])

    if (isLoading) {
        return <div>Loading ...</div>
    }

    return (
        <div className={styles.cusipDetails}>
            <table>
                <tbody>
                    <tr>
                        <td>CUSIP:</td>
                        <td>{cusip}</td>
                    </tr>
                    <tr>
                        <td>Current Adjusted Principal:</td>
                        <td>${adjustedPrincipal}</td>
                    </tr>
                    <tr>
                        <td>Original Principal:</td>
                        <td>${originalPrincipal}</td>
                    </tr>
                    <tr>
                        <td>Current Index Ratio:</td>
                        <td>{Number(currentCpiEntry?.dailyIndex)}</td>
                    </tr>
                    <tr>
                        <td>Security Term:</td>
                        <td>{securityDetails?.securityTerm}</td>
                    </tr>
                    <tr>
                        <td>Issue Date:</td>
                        <td>{new Date(securityDetails?.issueDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td>Maturity Date:</td>
                        <td>{new Date(securityDetails?.maturityDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <td>Interest Rate:</td>
                        <td>{Number(securityDetails?.interestRate).toFixed(2)}%</td>
                    </tr>
                </tbody>
            </table>

            {cpiEntries && (
                <LineChart
                    width={600}
                    height={300}
                    data={cpiChartData}
                    margin={{ top: 20, right: 10, bottom: 10, left: 10 }}
                >
                    <Line type="monotone" dataKey="dailyIndex" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="indexDate" />
                    <YAxis type="number" />
                    <Tooltip />
                </LineChart>
            )}

            {cpiEntries && (
                <div className={styles.cpiEntries}>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Index Ratio</th>
                                <th>Daily Adjusted Principal</th>
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
                                    <td>{`$${Number(entry.dailyIndex * originalPrincipal).toFixed(2)}`}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
