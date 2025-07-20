import { renderHook, act } from '@testing-library/react'
import { useCollapseState } from '../hooks/useCollapseState'

describe('Double-click toggle fix', () => {
    test('should expand CUSIP on first toggle click after addCollapsedState', () => {
        const { result } = renderHook(() => useCollapseState())
        const cusipId = 'TEST-DOUBLE-CLICK-FIX'

        // Step 1: Add collapsed state for new CUSIP (simulates handleNewCusip)
        act(() => {
            result.current.addCollapsedState(cusipId)
        })

        // Step 2: Verify initial state - should be collapsed (true)
        const initialState = result.current.getCollapsedState(cusipId)
        expect(initialState).toBe(true)

        // Step 3: First toggle should expand it (change from true to false)
        // This is the critical test - it should work on the FIRST click
        act(() => {
            result.current.toggleIndividualCollapsed(cusipId)
        })

        // Step 4: Verify it's now expanded after just ONE toggle
        const stateAfterFirstToggle = result.current.getCollapsedState(cusipId)
        expect(stateAfterFirstToggle).toBe(false) // Should be expanded (false)

        // Step 5: Second toggle should collapse it again
        act(() => {
            result.current.toggleIndividualCollapsed(cusipId)
        })

        const stateAfterSecondToggle = result.current.getCollapsedState(cusipId)
        expect(stateAfterSecondToggle).toBe(true) // Should be collapsed (true)
    })

    test('should handle fallback logic correctly when CUSIP not in collapsedStates', () => {
        const { result } = renderHook(() => useCollapseState())
        const cusipId = 'TEST-FALLBACK-LOGIC'

        // Initially, allCollapsed is true and CUSIP doesn't exist in collapsedStates
        expect(result.current.allCollapsed).toBe(true)
        expect(result.current.collapsedStates[cusipId]).toBeUndefined()
        
        // getCollapsedState should return true (fallback to allCollapsed)
        expect(result.current.getCollapsedState(cusipId)).toBe(true)

        // First toggle should set it to false (expanded)
        // This tests the core bug: toggle should use fallback logic, not raw undefined
        act(() => {
            result.current.toggleIndividualCollapsed(cusipId)
        })

        // After toggle, it should be expanded (false)
        expect(result.current.getCollapsedState(cusipId)).toBe(false)
        
        // And it should now exist in collapsedStates
        expect(result.current.collapsedStates[cusipId]).toBe(false)
    })

    test('should demonstrate the bug with broken implementation', () => {
        // This test documents what the bug was doing
        const { result } = renderHook(() => useCollapseState())
        const cusipId = 'TEST-BUG-DEMO'

        // Simulate the buggy behavior: !undefined = true
        const undefinedValue = undefined
        const buggyToggleResult = !undefinedValue // This equals true
        const correctToggleResult = !(undefinedValue ?? true) // This equals false

        expect(buggyToggleResult).toBe(true) // Bug: would keep it collapsed
        expect(correctToggleResult).toBe(false) // Fix: expands it correctly

        // The fix ensures toggle uses the same fallback logic as getCollapsedState
        expect(result.current.getCollapsedState(cusipId)).toBe(true) // Uses fallback
        
        act(() => {
            result.current.toggleIndividualCollapsed(cusipId)
        })
        
        expect(result.current.getCollapsedState(cusipId)).toBe(false) // Now uses correct toggle
    })

    test('should work correctly when allCollapsed is false', () => {
        const { result } = renderHook(() => useCollapseState())
        const cusipId = 'TEST-ALL-COLLAPSED-FALSE'

        // First, change allCollapsed to false by toggling all with some CUSIPs
        const mockCusips = [{ cusipId: 'MOCK1', uniqueId: 'mock1' }]
        
        act(() => {
            result.current.toggleAllCollapsed(mockCusips)
        })

        // Now allCollapsed should be false
        expect(result.current.allCollapsed).toBe(false)

        // A new CUSIP should fallback to allCollapsed (false = expanded)
        expect(result.current.getCollapsedState(cusipId)).toBe(false)

        // First toggle should collapse it (false -> true)
        act(() => {
            result.current.toggleIndividualCollapsed(cusipId)
        })

        expect(result.current.getCollapsedState(cusipId)).toBe(true)
    })
}) 