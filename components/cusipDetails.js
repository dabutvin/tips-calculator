'use client'

import { format } from 'fecha'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'

import { useEffect, useState } from 'react'
import { getCpiEntries, getSecurityDetails } from '../actions/treasuryApi'
import EditableFaceValue from './EditableFaceValue'
import styles from '../styles/CusipDetails.module.css'

// Helper functions for maturity detection and CPI entry selection
const isSecurityMature = (maturityDate, selectedDate) => {
    if (!maturityDate) return false
    return selectedDate > new Date(maturityDate)
}

const isSecurityIssuedYet = (issueDate, selectedDate) => {
    if (!issueDate) return true // If no issue date, assume it's issued
    return selectedDate >= new Date(issueDate)
}

const getFinalCpiEntry = (cpiEntries) => {
    if (!cpiEntries || cpiEntries.length === 0) return null
    // CPI entries come sorted by date DESC, so first entry is the most recent (final entry chronologically)
    return cpiEntries[0]
}

const getCurrentOrFinalEntry = (cpiEntries, isMature, isIssuedYet, selectedDate) => {
    if (!isIssuedYet) {
        // Security hasn't been issued yet, return a default entry with index ratio of 0
        return {
            dailyIndex: 0,
            indexDate: format(selectedDate, 'YYYY-MM-DDT00:00:00'),
        }
    } else if (isMature) {
        return getFinalCpiEntry(cpiEntries)
    } else {
        // Current logic for finding the entry for the specified date
        return cpiEntries.find(
            (entry) => entry.indexDate == format(selectedDate, 'YYYY-MM-DDT00:00:00'),
        )
    }
}

export default function CusipDetails({
    cusip,
    faceValue,
    isCollapsed = true,
    onToggle,
    onRemove,
    onDataUpdate,
    onFaceValueUpdate,
    uniqueId,
    selectedDate,
}) {
    const [cpiEntries, setCpiEntries] = useState(null)
    const [securityDetails, setSecurityDetails] = useState(null)
    const [currentCpiEntry, setCurrentCpiEntry] = useState(null)
    const [adjustedPrincipal, setAdjustedPrincipal] = useState(null)
    const [cpiChartData, setCpiChartData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isMature, setIsMature] = useState(false)
    const [isIssuedYet, setIsIssuedYet] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null)
                setIsLoading(true)

                let cpiEntriesResponse = await getCpiEntries(cusip)
                if (cpiEntriesResponse.error) {
                    setError(cpiEntriesResponse.error)
                    return
                }
                const cpiEntries = cpiEntriesResponse.data
                setCpiEntries(cpiEntries)

                let securityDetailsResponse = await getSecurityDetails(cusip)
                if (securityDetailsResponse.error) {
                    setError(securityDetailsResponse.error)
                    return
                }
                const securityDetails = securityDetailsResponse.data
                setSecurityDetails(securityDetails)

                // Detect if security is mature
                const securityIsMature = isSecurityMature(
                    securityDetails?.maturityDate,
                    selectedDate,
                )
                setIsMature(securityIsMature)

                // Detect if security has been issued yet
                const securityIsIssued = isSecurityIssuedYet(
                    securityDetails?.issueDate,
                    selectedDate,
                )
                setIsIssuedYet(securityIsIssued)

                // Get appropriate CPI entry (current for active, final for mature, default for pre-issue)
                let relevantEntry = getCurrentOrFinalEntry(
                    cpiEntries,
                    securityIsMature,
                    securityIsIssued,
                    selectedDate,
                )
                setCurrentCpiEntry(relevantEntry)

                const adjustedPrincipalValue = (relevantEntry?.dailyIndex * faceValue).toFixed(2)
                setAdjustedPrincipal(adjustedPrincipalValue)

                // Notify parent component of the data for sorting
                if (onDataUpdate) {
                    onDataUpdate({
                        cusipId: cusip,
                        maturityDate: securityDetails?.maturityDate,
                        adjustedPrincipal: parseFloat(adjustedPrincipalValue),
                        faceValue: parseFloat(faceValue),
                        interestRate: parseFloat(securityDetails?.interestRate),
                        isMature: securityIsMature,
                        uniqueId: uniqueId,
                    })
                }

                const chartData = cpiEntries
                    .map((entry) => {
                        return {
                            indexDate: new Date(entry.indexDate).toLocaleDateString(),
                            dailyIndex: Number(entry.dailyIndex),
                            dailyAdjustedPrincipal: Number(
                                (faceValue * entry.dailyIndex).toFixed(2),
                            ),
                        }
                    })
                    .reverse()

                setCpiChartData(chartData)
            } catch (err) {
                setError(err.message)
                setCpiEntries(null)
                setSecurityDetails(null)
                setCurrentCpiEntry(null)
                setAdjustedPrincipal(null)
                setCpiChartData(null)
                setIsMature(false)
                setIsIssuedYet(true)
            } finally {
                setIsLoading(false)
            }
        }

        if (cusip) {
            fetchData()
        } else {
            setIsLoading(false)
        }
    }, [cusip, faceValue, onDataUpdate, selectedDate])

    if (isLoading) {
        return <div style={{ padding: '20px' }}>Loading ...</div>
    }

    if (error) {
        return (
            <div className={`${styles.cusipDetails} ${isMature ? styles.matured : ''}`}>
                <div className={styles.expandedHeaderError}>
                    <button onClick={onRemove} className={styles.expandedRemoveBtn}>
                        X
                    </button>
                </div>
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
                            <td>Face Value:</td>
                            <td>
                                <EditableFaceValue value={faceValue} onUpdate={onFaceValueUpdate} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    // Collapsed view - show only essential fields horizontally
    if (isCollapsed) {
        return (
            <div className={`${styles.cusipDetails} ${isMature ? styles.matured : ''}`}>
                <div className={styles.collapsedView}>
                    <button onClick={onToggle} className={styles.collapsedToggleBtn}>
                        {isCollapsed ? '▶' : '▼'}
                    </button>
                    <div className={styles.collapsedContent}>
                        <div className={styles.collapsedMobileRowPrimary}>
                            <div className={styles.collapsedField}>
                                <span className={styles.collapsedLabel}>CUSIP:</span>
                                <span className={styles.collapsedValue}>{cusip}</span>
                            </div>
                            <div className={styles.collapsedField}>
                                <span className={styles.collapsedLabel}>
                                    {isMature ? 'Mature:' : 'Current:'}
                                </span>
                                <span className={styles.collapsedValue}>
                                    {!isIssuedYet
                                        ? 'Pre-Issue'
                                        : `$${Number(adjustedPrincipal).toFixed(0)}`}
                                </span>
                            </div>
                        </div>
                        <div className={styles.collapsedMobileRowSecondary}>
                            <div className={styles.collapsedField}>
                                <span className={styles.collapsedLabel}>Face Value:</span>
                                <EditableFaceValue
                                    value={faceValue}
                                    onUpdate={onFaceValueUpdate}
                                    className={styles.collapsedValue}
                                />
                            </div>
                            <div className={styles.collapsedField}>
                                <span className={styles.collapsedLabel}>Maturity:</span>
                                <span className={styles.collapsedValue}>
                                    {securityDetails?.maturityDate
                                        ? new Date(
                                              securityDetails.maturityDate,
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                </span>
                            </div>
                        </div>
                        {/* Hidden on mobile via CSS but shown on desktop */}
                        <div className={styles.collapsedField}>
                            <span className={styles.collapsedLabel}>Rate:</span>
                            <span className={styles.collapsedValue}>
                                {Number(securityDetails?.interestRate).toFixed(3)}%
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
        <div className={`${styles.cusipDetails} ${isMature ? styles.matured : ''}`}>
            {/* Inline header with buttons and retained collapsed content */}
            <div className={styles.expandedHeaderWithContent}>
                <button onClick={onToggle} className={styles.expandedToggleBtn}>
                    {isCollapsed ? '▶' : '▼'}
                </button>
                <div className={styles.retainedCollapsedView}>
                    <div className={styles.collapsedContent}>
                        <div className={styles.collapsedMobileRowPrimary}>
                            <div className={styles.collapsedField}>
                                <span className={styles.collapsedLabel}>CUSIP:</span>
                                <span className={styles.collapsedValue}>{cusip}</span>
                            </div>
                            <div className={styles.collapsedField}>
                                <span className={styles.collapsedLabel}>
                                    {isMature ? 'Mature:' : 'Current:'}
                                </span>
                                <span className={styles.collapsedValue}>
                                    {!isIssuedYet
                                        ? 'Pre-Issue'
                                        : `$${Number(adjustedPrincipal).toFixed(0)}`}
                                </span>
                            </div>
                        </div>
                        <div className={styles.collapsedMobileRowSecondary}>
                            <div className={styles.collapsedField}>
                                <span className={styles.collapsedLabel}>Face Value:</span>
                                <EditableFaceValue
                                    value={faceValue}
                                    onUpdate={onFaceValueUpdate}
                                    className={styles.collapsedValue}
                                />
                            </div>
                            <div className={styles.collapsedField}>
                                <span className={styles.collapsedLabel}>Maturity:</span>
                                <span className={styles.collapsedValue}>
                                    {securityDetails?.maturityDate
                                        ? new Date(
                                              securityDetails.maturityDate,
                                          ).toLocaleDateString()
                                        : 'N/A'}
                                </span>
                            </div>
                        </div>
                        {/* Hidden on mobile via CSS but shown on desktop */}
                        <div className={styles.collapsedField}>
                            <span className={styles.collapsedLabel}>Rate:</span>
                            <span className={styles.collapsedValue}>
                                {Number(securityDetails?.interestRate).toFixed(3)}%
                            </span>
                        </div>
                    </div>
                </div>
                <button onClick={onRemove} className={styles.expandedRemoveBtn}>
                    X
                </button>
            </div>

            <h3>Security Details</h3>
            <table>
                <tbody>
                    <tr>
                        <td>
                            {isMature ? 'Final Adjusted Principal:' : 'Current Adjusted Principal:'}
                        </td>
                        <td>{!isIssuedYet ? 'Pre-Issue' : `$${adjustedPrincipal}`}</td>
                    </tr>
                    <tr>
                        <td>Face Value:</td>
                        <td>
                            <EditableFaceValue value={faceValue} onUpdate={onFaceValueUpdate} />
                        </td>
                    </tr>
                    <tr>
                        <td>{isMature ? 'Final Index Ratio:' : 'Current Index Ratio:'}</td>
                        <td>{!isIssuedYet ? 'Pre-Issue' : Number(currentCpiEntry?.dailyIndex)}</td>
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
                        <YAxis
                            type="number"
                            domain={[
                                (dataMin) => Math.floor(dataMin * 0.95),
                                (dataMax) => Math.ceil(dataMax * 1.05),
                            ]}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip formatter={(value) => [`$${value}`, 'Daily Adjusted Principal']} />
                        <ReferenceLine
                            x={selectedDate.toLocaleDateString()}
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
                <div>
                    <h3>Index Ratio History</h3>
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
                                            <td>
                                                {new Date(entry.indexDate).toLocaleDateString()}
                                            </td>
                                            <td>{entry.dailyIndex}</td>
                                            <td>{`$${Number(entry.dailyIndex * faceValue).toFixed(2)}`}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
