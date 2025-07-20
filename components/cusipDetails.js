'use client'

import { format } from 'fecha'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'

import { useEffect, useState } from 'react'
import { getCpiEntries, getSecurityDetails } from '../actions/treasuryApi'
import styles from '../styles/CusipDetails.module.css'

export default function CusipDetails({
    cusip,
    originalPrincipal,
    collapsed = false,
    onToggle,
    isCollapsed,
    onRemove,
    onDataUpdate,
}) {
    const [cpiEntries, setCpiEntries] = useState(null)
    const [securityDetails, setSecurityDetails] = useState(null)
    const [currentCpiEntry, setCurrentCpiEntry] = useState(null)
    const [adjustedPrincipal, setAdjustedPrincipal] = useState(null)
    const [cpiChartData, setCpiChartData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)


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
                const adjustedPrincipalValue = (
                    todaysEntry?.dailyIndex * originalPrincipal
                ).toFixed(2)
                setAdjustedPrincipal(adjustedPrincipalValue)

                // Notify parent component of the data for sorting
                if (onDataUpdate) {
                    onDataUpdate({
                        cusipId: cusip,
                        maturityDate: securityDetailsResponse?.maturityDate,
                        adjustedPrincipal: parseFloat(adjustedPrincipalValue),
                        originalPrincipal: parseFloat(originalPrincipal),
                    })
                }

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
    }, [cusip, originalPrincipal, onDataUpdate])

    if (isLoading) {
        return <div style={{ padding: '20px' }}>Loading ...</div>
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

    // Collapsed view - show only essential fields horizontally
    if (collapsed) {
        return (
            <div className={styles.cusipDetails}>
                <div className={styles.collapsedView}>
                    <div className={styles.collapsedContent}>
                        <button onClick={onToggle} className={styles.collapsedToggleBtn}>
                            {isCollapsed ? '▶' : '▼'}
                        </button>
                        <div className={styles.collapsedField}>
                            <span className={styles.collapsedLabel}>CUSIP:</span>
                            <span className={styles.collapsedValue}>{cusip}</span>
                        </div>
                        <div className={styles.collapsedField}>
                            <span className={styles.collapsedLabel}>Maturity:</span>
                            <span className={styles.collapsedValue}>
                                {securityDetails?.maturityDate
                                    ? new Date(securityDetails.maturityDate).toLocaleDateString()
                                    : 'N/A'}
                            </span>
                        </div>
                        <div className={styles.collapsedField}>
                            <span className={styles.collapsedLabel}>Rate:</span>
                            <span className={styles.collapsedValue}>
                                {Number(securityDetails?.interestRate).toFixed(3)}%
                            </span>
                        </div>
                        <div className={styles.collapsedField}>
                            <span className={styles.collapsedLabel}>Original:</span>
                            <span className={styles.collapsedValue}>${originalPrincipal}</span>
                        </div>
                        <div className={styles.collapsedField}>
                            <span className={styles.collapsedLabel}>Current:</span>
                            <span className={styles.collapsedValue}>
                                ${Number(adjustedPrincipal).toFixed(0)}
                            </span>
                        </div>
                    </div>
                    <button onClick={onRemove} className={styles.collapsedRemoveBtn}>
                        X
                    </button>
                </div>
            </div>
        )
    }

    // Full expanded view
    return (
        <div className={styles.cusipDetails}>
            <div className={styles.expandedHeader}>
                <button onClick={onToggle} className={styles.expandedToggleBtn}>
                    {isCollapsed ? '▶' : '▼'}
                </button>
                <button onClick={onRemove} className={styles.expandedRemoveBtn}>
                    X
                </button>
            </div>
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
                        <td>{Number(securityDetails?.interestRate).toFixed(3)}%</td>
                    </tr>
                </tbody>
            </table>

            {cpiEntries && (
                <div className={styles.chartContainer}>
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
                        <ReferenceLine
                            x={new Date().toLocaleDateString()}
                            stroke="#ff6b6b"
                            strokeDasharray="3 3"
                            label={{
                                value: `$${Math.round(adjustedPrincipal)}`,
                                position: 'left',
                                offset: 1,
                                style: { transform: 'translateY(-30px)' },
                            }}
                        />
                    </LineChart>
                </div>
            )}

            {cpiEntries && (
                <div className={styles.cpiEntries}>
                    <div className={styles.tableContainer}>
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
                </div>
            )}
        </div>
    )
}
