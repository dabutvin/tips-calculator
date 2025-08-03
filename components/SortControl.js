'use client'

import styles from '../styles/CusipList.module.css'

export default function SortControl({ sortBy, sortDirection, onSortChange }) {
    return (
        <div className={styles.sortControls}>
            <label
                htmlFor="sortSelect"
                style={{
                    fontSize: '0.75rem',
                    color: '#666',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0',
                }}
            >
                Sort by:
            </label>
            <select
                id="sortSelect"
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                    const [newSortBy, newSortDirection] = e.target.value.split('-')
                    onSortChange(newSortBy, newSortDirection)
                }}
                className={styles.sortSelect}
            >
                <option value="maturity-asc">Maturity Date (asc)</option>
                <option value="maturity-desc">Maturity Date (desc)</option>
                <option value="adjusted-asc">Value (asc)</option>
                <option value="adjusted-desc">Value (desc)</option>
                <option value="interest-asc">Interest (asc)</option>
                <option value="interest-desc">Interest (desc)</option>
                <option value="entry-asc">Manual</option>
            </select>
        </div>
    )
}
