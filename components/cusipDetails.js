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
    const [error, setError] = useState(null)
    const [isCpiEntriesCollapsed, setIsCpiEntriesCollapsed] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null)
                setIsLoading(true)

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
            } catch (err) {
                setError(err.message)
                setCpiEntries(null)
                setSecurityDetails(null)
                setCurrentCpiEntry(null)
                setAdjustedPrincipal(null)
                setCpiChartData(null)
            } finally {
                setIsLoading(false)
            }
        }

        if (cusip) {
            fetchData()
        } else {
            setIsLoading(false)
        }
    }, [cusip, originalPrincipal])

    if (isLoading) {
        return <div>Loading ...</div>
    }

    if (error) {
        return (
            <div className={styles.cusipDetails}>
                <div
                    style={{
                        color: '#dc3545',
                        backgroundColor: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        borderRadius: '4px',
                        padding: '10px',
                        marginBottom: '10px',
                    }}
                >
                    <strong>Error:</strong> {error}
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td>CUSIP:</td>
                            <td>{cusip}</td>
                        </tr>
                        <tr>
                            <td>Original Principal:</td>
                            <td>${originalPrincipal}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
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
                    <Line type="monotone" dataKey="dailyAdjustedPrincipal" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis
                        dataKey="indexDate"
                        interval={Math.floor(cpiChartData.length / 6)}
                        tickFormatter={(value) => {
                            const date = new Date(value)
                            const month = (date.getMonth() + 1).toString()
                            const year = date.getFullYear().toString().slice(-2)
                            return `${month}/${year}`
                        }}
                    />
                    <YAxis type="number" tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value}`, 'Daily Adjusted Principal']} />
                </LineChart>
            )}

            {cpiEntries && (
                <div className={styles.cpiEntries}>
                    <div
                        className={`${styles.tableContainer} ${isCpiEntriesCollapsed ? styles.collapsed : ''}`}
                    >
                        <table>
                            <thead>
                                <tr>
                                    <th
                                        className={styles.caretHeader}
                                        onClick={() =>
                                            setIsCpiEntriesCollapsed(!isCpiEntriesCollapsed)
                                        }
                                    >
                                        <span className={styles.caret}>
                                            {isCpiEntriesCollapsed ? '▶' : '▼'}
                                        </span>
                                    </th>
                                    <th>Date</th>
                                    <th>Index Ratio</th>
                                    <th>Daily Adjusted Principal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cpiEntries?.map((entry, index) => (
                                    <tr
                                        key={entry.uniqueKey}
                                        className={`${
                                            entry.dailyIndex == currentCpiEntry?.dailyIndex
                                                ? styles.current
                                                : ''
                                        } ${isCpiEntriesCollapsed && index >= 5 ? styles.fadeOut : ''}`}
                                    >
                                        <td></td>
                                        <td>{new Date(entry.indexDate).toLocaleDateString()}</td>
                                        <td>{entry.dailyIndex}</td>
                                        <td>{`$${Number(entry.dailyIndex * originalPrincipal).toFixed(2)}`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
