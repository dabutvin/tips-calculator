'use client'

import styles from '../styles/CusipList.module.css'
import Dropdown from './Dropdown'

export default function SortControl({ sortBy, sortDirection, onSortChange }) {
    // Define sort options for the dropdown
    const sortOptions = [
        { value: 'maturity-asc', label: 'Maturity Date (asc)' },
        { value: 'maturity-desc', label: 'Maturity Date (desc)' },
        { value: 'adjusted-asc', label: 'Value (asc)' },
        { value: 'adjusted-desc', label: 'Value (desc)' },
        { value: 'interest-asc', label: 'Interest (asc)' },
        { value: 'interest-desc', label: 'Interest (desc)' },
        { value: 'entry-asc', label: 'Manual' },
    ]

    const currentValue = `${sortBy}-${sortDirection}`

    const handleSortChange = (newValue) => {
        const [newSortBy, newSortDirection] = newValue.split('-')
        onSortChange(newSortBy, newSortDirection)
    }

    return (
        <div className={styles.sortControls}>
            <Dropdown
                label="Sort by:"
                id="sortSelect"
                options={sortOptions}
                value={currentValue}
                onChange={handleSortChange}
            />
        </div>
    )
}
