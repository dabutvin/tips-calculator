'use client'

import { useEffect, useState } from 'react'
import { getCpiEntries } from '../actions/treasuryApi'

export default function CusipDetails({ index }) {
    const [cusip, setCusip] = useState('')
    const [cpiEntries, setCpiEntries] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            let result = await getCpiEntries(cusip)
            setCpiEntries(result)
        }
        if (cusip) {
            fetchData().catch(console.error)
        }
    }, [cusip])

    const handleCusipChange = (event) => {
        setCusip(event.target.value)
    }

    return (
        <>
            {!cusip && (
                <>
                    <label htmlFor={`${index}_cusip`}>
                        CUSIP:{' '}
                        <input
                            id={`${index}_cusip`}
                            type="text"
                            value={cusip}
                            onChange={handleCusipChange}
                        />
                    </label>
                </>
            )}
            {cusip && <p>CUSIP: {cusip}</p>}
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
        </>
    )
}
