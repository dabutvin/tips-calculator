import { useState, useCallback } from 'react'

export function useCollapseState(initialCusips = []) {
    const [allCollapsed, setAllCollapsed] = useState(true)
    const [collapsedStates, setCollapsedStates] = useState({})

    // Initialize collapsed states for new CUSIPs
    const initializeCollapsedStates = useCallback((cusips) => {
        const initialCollapsedStates = {}
        cusips.forEach((cusip) => {
            initialCollapsedStates[cusip.cusipId] = true
        })
        setCollapsedStates(initialCollapsedStates)
    }, [])

    // Toggle all collapsed state
    const toggleAllCollapsed = useCallback(
        (cusips) => {
            const newCollapsedState = !allCollapsed
            setAllCollapsed(newCollapsedState)

            // Update all individual collapsed states
            setCollapsedStates((prev) => {
                const newCollapsedStates = {}
                cusips.forEach((cusip) => {
                    newCollapsedStates[cusip.cusipId] = newCollapsedState
                })
                return newCollapsedStates
            })
        },
        [allCollapsed],
    )

    // Toggle individual collapsed state
    const toggleIndividualCollapsed = useCallback(
        (cusipId) => {
            const currentState = collapsedStates[cusipId] ?? allCollapsed
            const newState = !currentState
            setCollapsedStates((prev) => ({
                ...prev,
                [cusipId]: newState,
            }))
        },
        [collapsedStates, allCollapsed],
    )

    // Add collapsed state for new CUSIP
    const addCollapsedState = useCallback(
        (cusipId) => {
            setCollapsedStates((prev) => ({
                ...prev,
                [cusipId]: allCollapsed,
            }))
        },
        [allCollapsed],
    )

    // Remove collapsed state for CUSIP
    const removeCollapsedState = useCallback((cusipId) => {
        setCollapsedStates((prev) => {
            const newStates = { ...prev }
            delete newStates[cusipId]
            return newStates
        })
    }, [])

    // Get collapsed state for a specific CUSIP
    const getCollapsedState = useCallback(
        (cusipId) => {
            return collapsedStates[cusipId] ?? allCollapsed
        },
        [collapsedStates, allCollapsed],
    )

    // Create stable callback for individual toggle
    const createToggleCallback = useCallback(
        (cusipId) => {
            return () => toggleIndividualCollapsed(cusipId)
        },
        [toggleIndividualCollapsed],
    )

    return {
        allCollapsed,
        collapsedStates,
        initializeCollapsedStates,
        toggleAllCollapsed,
        toggleIndividualCollapsed,
        addCollapsedState,
        removeCollapsedState,
        getCollapsedState,
        createToggleCallback,
    }
}
