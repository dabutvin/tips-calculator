import { useState, useMemo, useCallback } from 'react'

export function useCusipSorting(cusips, cusipData, onReorder) {
    const [sortBy, setSortBy] = useState('maturity') // 'entry', 'maturity', 'adjusted', 'interest'
    const [sortDirection, setSortDirection] = useState('asc') // 'asc', 'desc'

    const sortedCusips = useMemo(() => {
        if (sortBy === 'entry') {
            return cusips // Return in entry order
        }

        return cusips.sort((a, b) => {
            const aData = cusipData[a.uniqueId]
            const bData = cusipData[b.uniqueId]

            let aValue, bValue

            if (sortBy === 'maturity') {
                aValue = aData?.maturityDate ? new Date(aData.maturityDate) : null
                bValue = bData?.maturityDate ? new Date(bData.maturityDate) : null
                // Handle null values
                if (!aValue && !bValue) return 0
                if (!aValue) return sortDirection === 'asc' ? 1 : -1
                if (!bValue) return sortDirection === 'asc' ? -1 : 1
            } else if (sortBy === 'adjusted') {
                aValue = aData?.adjustedPrincipal ? Number(aData.adjustedPrincipal) : Number(a.originalPrincipal)
                bValue = bData?.adjustedPrincipal ? Number(bData.adjustedPrincipal) : Number(b.originalPrincipal)
            } else if (sortBy === 'interest') {
                aValue = aData?.interestRate || 0
                bValue = bData?.interestRate || 0
            }

            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
            }
        })
    }, [cusips, cusipData, sortBy, sortDirection])

    const handleSortChange = (newSortBy, newSortDirection) => {
        setSortBy(newSortBy)
        setSortDirection(newSortDirection)
    }

    // Handle drag and drop reordering (only when in entry mode)
    const handleReorder = useCallback(
        (fromIndex, toIndex) => {
            if (sortBy === 'entry' && onReorder) {
                onReorder(fromIndex, toIndex)
            }
        },
        [sortBy, onReorder],
    )

    return {
        sortedCusips,
        sortBy,
        sortDirection,
        handleSortChange,
        handleReorder,
    }
}
