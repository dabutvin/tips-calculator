'use client'

import React from 'react'
import styles from '../styles/CusipList.module.css'

export default function SortControl({ sortBy, sortDirection, onSortChange }) {
    return (
        <div className={styles.sortControls}>
            <label
                htmlFor="sortSelect"
                style={{
                    marginRight: '8px',
                }}
            >
                Sort by:
            </label>
            <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                    const [newSortBy, newSortDirection] = e.target.value.split('-')
                    onSortChange(newSortBy, newSortDirection)
                }}
                className={styles.sortSelect}
            >
                <option value="maturity-asc">Maturity Date (Earliest First)</option>
                <option value="maturity-desc">Maturity Date (Latest First)</option>
                <option value="adjusted-asc">Current Adjusted Principal (Low to High)</option>
                <option value="adjusted-desc">Current Adjusted Principal (High to Low)</option>
                <option value="entry-asc">Manual</option>
            </select>
        </div>
    )
}
