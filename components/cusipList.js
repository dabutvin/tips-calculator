'use client'

import React, { useState } from 'react'
import CusipDetails from '../components/cusipDetails'
import styles from '../styles/CusipList.module.css'

export default function CusipList() {
    const [cusips, setCusips] = useState([])

    const handleNewCusip = (event) => {
        setCusips([
            ...cusips,
            {
                cusipId: event.target['cusipId'].value,
                originalPrincipal: event.target['originalPrincipal'].value,
            },
        ])
        event.target.reset()
        event.preventDefault()
    }

    return (
        <div className={styles.cusipList}>
            <form onSubmit={handleNewCusip}>
                <div>
                    <label>
                        CUSIP: <input name="cusipId" type="text" />
                    </label>
                </div>
                <div>
                    <label>
                        Original Principal: <input name="originalPrincipal" type="number" />
                    </label>
                </div>
                <button type="submit">Add</button>
            </form>
            {cusips.map(({ cusipId, originalPrincipal }, index) => (
                <CusipDetails
                    key={`${index}_${cusipId}`}
                    cusip={cusipId}
                    originalPrincipal={originalPrincipal}
                />
            ))}
        </div>
    )
}
