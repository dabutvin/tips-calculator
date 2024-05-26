'use client'

import { useEffect, useState } from "react"
import { getCpiEntries } from "../actions/treasuryApi"

export default function CusipDetails({ cusip }) {
    const [cpiEntries, setCpiEntries] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            let result = await getCpiEntries(cusip)
            setCpiEntries(result)
        }
        fetchData().catch(console.error)
    }, [cusip])

    return (
        <>
            {cusip && <p>CUSIP: {cusip}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Index Ratio</th>
                    </tr>
                </thead>
                <tbody>
                    {cpiEntries?.map(entry =>
                        <tr key={entry.uniqueKey}>
                            <td>{new Date(entry.indexDate).toLocaleDateString()}</td>
                            <td>{entry.dailyIndex}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    )
}