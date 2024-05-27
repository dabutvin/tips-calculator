'use client'

import React, { useState } from 'react'
import CusipDetails from '../components/cusipDetails'
import styles from '../styles/CusipList.module.css'

export default function CusipList() {
    const [cusips, setCusips] = useState([])

    const handleCusipChange = (event) => {
        setCusips([...cusips, event.target['cusip'].value])
        event.target.reset()
        event.preventDefault()
    }

    return (
        <div className={styles.cusipList}>
            <form onSubmit={handleCusipChange}>
                <label>
                    CUSIP: <input name="cusip" type="text" />
                </label>
                <button type="submit">Add</button>
            </form>
            {cusips.map((cusip, index) => (
                <CusipDetails key={`${index}_${cusip}`} cusip={cusip} />
            ))}
        </div>
    )
}
