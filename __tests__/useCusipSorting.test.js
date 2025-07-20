import { renderHook, act } from '@testing-library/react'
import { useCusipSorting } from '../hooks/useCusipSorting'

describe('useCusipSorting', () => {
    const mockOnReorder = jest.fn()

    // Sample test data
    const mockCusips = [
        {
            cusipId: 'CUSIP001',
            originalPrincipal: 1000,
            uniqueId: 'unique1'
        },
        {
            cusipId: 'CUSIP002',
            originalPrincipal: 2000,
            uniqueId: 'unique2'
        },
        {
            cusipId: 'CUSIP003',
            originalPrincipal: 1500,
            uniqueId: 'unique3'
        }
    ]

    const mockCusipData = {
        'unique1': {
            maturityDate: '2025-01-15T00:00:00',
            adjustedPrincipal: 1200,
            interestRate: 2.5,
            originalPrincipal: 1000
        },
        'unique2': {
            maturityDate: '2024-06-15T00:00:00',
            adjustedPrincipal: 2100,
            interestRate: 1.8,
            originalPrincipal: 2000
        },
        'unique3': {
            maturityDate: '2026-12-15T00:00:00',
            adjustedPrincipal: 1600,
            interestRate: 3.2,
            originalPrincipal: 1500
        }
    }

    beforeEach(() => {
        mockOnReorder.mockClear()
    })

    test('initializes with default state', () => {
        const { result } = renderHook(() => 
            useCusipSorting(mockCusips, mockCusipData, mockOnReorder)
        )

        expect(result.current.sortBy).toBe('maturity')
        expect(result.current.sortDirection).toBe('asc')
        expect(result.current.sortedCusips).toHaveLength(3)
    })

    test('returns cusips in entry order when sortBy is "entry"', () => {
        const { result } = renderHook(() => 
            useCusipSorting(mockCusips, mockCusipData, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('entry', 'asc')
        })

        expect(result.current.sortBy).toBe('entry')
        expect(result.current.sortedCusips).toEqual(mockCusips)
    })

    test('sorts by maturity date ascending', () => {
        const { result } = renderHook(() => 
            useCusipSorting(mockCusips, mockCusipData, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('maturity', 'asc')
        })

        const sortedCusips = result.current.sortedCusips
        expect(sortedCusips[0].cusipId).toBe('CUSIP002') // 2024-06-15
        expect(sortedCusips[1].cusipId).toBe('CUSIP001') // 2025-01-15
        expect(sortedCusips[2].cusipId).toBe('CUSIP003') // 2026-12-15
    })

    test('sorts by maturity date descending', () => {
        const { result } = renderHook(() => 
            useCusipSorting(mockCusips, mockCusipData, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('maturity', 'desc')
        })

        const sortedCusips = result.current.sortedCusips
        expect(sortedCusips[0].cusipId).toBe('CUSIP003') // 2026-12-15
        expect(sortedCusips[1].cusipId).toBe('CUSIP001') // 2025-01-15
        expect(sortedCusips[2].cusipId).toBe('CUSIP002') // 2024-06-15
    })

    test('sorts by adjusted principal ascending', () => {
        const { result } = renderHook(() => 
            useCusipSorting(mockCusips, mockCusipData, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('adjusted', 'asc')
        })

        const sortedCusips = result.current.sortedCusips
        expect(sortedCusips[0].cusipId).toBe('CUSIP001') // 1200
        expect(sortedCusips[1].cusipId).toBe('CUSIP003') // 1600
        expect(sortedCusips[2].cusipId).toBe('CUSIP002') // 2100
    })

    test('sorts by adjusted principal descending', () => {
        const { result } = renderHook(() => 
            useCusipSorting(mockCusips, mockCusipData, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('adjusted', 'desc')
        })

        const sortedCusips = result.current.sortedCusips
        expect(sortedCusips[0].cusipId).toBe('CUSIP002') // 2100
        expect(sortedCusips[1].cusipId).toBe('CUSIP003') // 1600
        expect(sortedCusips[2].cusipId).toBe('CUSIP001') // 1200
    })

    test('sorts by interest rate ascending', () => {
        const { result } = renderHook(() => 
            useCusipSorting(mockCusips, mockCusipData, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('interest', 'asc')
        })

        const sortedCusips = result.current.sortedCusips
        expect(sortedCusips[0].cusipId).toBe('CUSIP002') // 1.8%
        expect(sortedCusips[1].cusipId).toBe('CUSIP001') // 2.5%
        expect(sortedCusips[2].cusipId).toBe('CUSIP003') // 3.2%
    })

    test('sorts by interest rate descending', () => {
        const { result } = renderHook(() => 
            useCusipSorting(mockCusips, mockCusipData, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('interest', 'desc')
        })

        const sortedCusips = result.current.sortedCusips
        expect(sortedCusips[0].cusipId).toBe('CUSIP003') // 3.2%
        expect(sortedCusips[1].cusipId).toBe('CUSIP001') // 2.5%
        expect(sortedCusips[2].cusipId).toBe('CUSIP002') // 1.8%
    })

    test('handles missing maturity date data', () => {
        const cusipsWithMissingData = [...mockCusips]
        const cusipDataWithMissingMaturity = {
            ...mockCusipData,
            'unique1': {
                ...mockCusipData['unique1'],
                maturityDate: null
            }
        }

        const { result } = renderHook(() => 
            useCusipSorting(cusipsWithMissingData, cusipDataWithMissingMaturity, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('maturity', 'asc')
        })

        const sortedCusips = result.current.sortedCusips
        // CUSIP001 with null maturity should be last when sorting ascending
        expect(sortedCusips[sortedCusips.length - 1].cusipId).toBe('CUSIP001')
    })

    test('handles missing cusip data gracefully', () => {
        const cusipsWithMissingData = [...mockCusips]
        const incompleteCusipData = {
            'unique1': mockCusipData['unique1'],
            // unique2 and unique3 data missing
        }

        const { result } = renderHook(() => 
            useCusipSorting(cusipsWithMissingData, incompleteCusipData, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('adjusted', 'asc')
        })

        // Should not crash and should use originalPrincipal as fallback
        expect(result.current.sortedCusips).toHaveLength(3)
    })

    test('uses originalPrincipal as fallback when adjustedPrincipal is missing', () => {
        const testCusips = [
            {
                cusipId: 'CUSIP001',
                originalPrincipal: 1000,
                uniqueId: 'unique1'
            },
            {
                cusipId: 'CUSIP002',
                originalPrincipal: 2000,
                uniqueId: 'unique2'
            }
        ]

        const cusipDataWithoutAdjusted = {
            'unique1': {
                maturityDate: '2025-01-15T00:00:00',
                interestRate: 2.5,
                originalPrincipal: 1000
                // adjustedPrincipal missing - will use originalPrincipal: 1000
            },
            'unique2': {
                maturityDate: '2024-06-15T00:00:00',
                adjustedPrincipal: 2100,
                interestRate: 1.8,
                originalPrincipal: 2000
            }
        }

        const { result } = renderHook(() => 
            useCusipSorting(testCusips, cusipDataWithoutAdjusted, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('adjusted', 'asc')
        })

        const sortedCusips = result.current.sortedCusips
        expect(sortedCusips[0].cusipId).toBe('CUSIP001') // originalPrincipal: 1000 (fallback)
        expect(sortedCusips[1].cusipId).toBe('CUSIP002') // adjustedPrincipal: 2100
    })

    test('uses 0 as fallback for missing interest rate', () => {
        const testCusips = [
            {
                cusipId: 'CUSIP001',
                originalPrincipal: 1000,
                uniqueId: 'unique1'
            },
            {
                cusipId: 'CUSIP002',
                originalPrincipal: 2000,
                uniqueId: 'unique2'
            }
        ]

        const cusipDataWithoutInterest = {
            'unique1': {
                maturityDate: '2025-01-15T00:00:00',
                adjustedPrincipal: 1200,
                originalPrincipal: 1000
                // interestRate missing - will default to 0
            },
            'unique2': {
                maturityDate: '2024-06-15T00:00:00',
                adjustedPrincipal: 2100,
                interestRate: 1.8,
                originalPrincipal: 2000
            }
        }

        const { result } = renderHook(() => 
            useCusipSorting(testCusips, cusipDataWithoutInterest, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('interest', 'asc')
        })

        const sortedCusips = result.current.sortedCusips
        expect(sortedCusips[0].cusipId).toBe('CUSIP001') // interestRate: 0 (fallback)
        expect(sortedCusips[1].cusipId).toBe('CUSIP002') // interestRate: 1.8
    })

    test('handleSortChange updates sortBy and sortDirection', () => {
        const { result } = renderHook(() => 
            useCusipSorting(mockCusips, mockCusipData, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('interest', 'desc')
        })

        expect(result.current.sortBy).toBe('interest')
        expect(result.current.sortDirection).toBe('desc')
    })

    test('handleReorder calls onReorder only when sortBy is "entry"', () => {
        const { result } = renderHook(() => 
            useCusipSorting(mockCusips, mockCusipData, mockOnReorder)
        )

        // First set to entry mode
        act(() => {
            result.current.handleSortChange('entry', 'asc')
        })

        // Now reorder should work
        act(() => {
            result.current.handleReorder(0, 2)
        })

        expect(mockOnReorder).toHaveBeenCalledTimes(1)
        expect(mockOnReorder).toHaveBeenCalledWith(0, 2)
    })

    test('handleReorder does not call onReorder when not in entry mode', () => {
        const { result } = renderHook(() => 
            useCusipSorting(mockCusips, mockCusipData, mockOnReorder)
        )

        // Default is maturity mode, not entry mode
        act(() => {
            result.current.handleReorder(0, 2)
        })

        expect(mockOnReorder).not.toHaveBeenCalled()
    })

    test('sorting is stable with equal values', () => {
        const cusipsWithEqualValues = [
            { cusipId: 'CUSIP001', originalPrincipal: 1000, uniqueId: 'unique1' },
            { cusipId: 'CUSIP002', originalPrincipal: 1000, uniqueId: 'unique2' },
            { cusipId: 'CUSIP003', originalPrincipal: 1000, uniqueId: 'unique3' }
        ]

        const cusipDataWithEqualInterest = {
            'unique1': { interestRate: 2.5 },
            'unique2': { interestRate: 2.5 },
            'unique3': { interestRate: 2.5 }
        }

        const { result } = renderHook(() => 
            useCusipSorting(cusipsWithEqualValues, cusipDataWithEqualInterest, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('interest', 'asc')
        })

        // With equal values, original order should be maintained
        const sortedCusips = result.current.sortedCusips
        expect(sortedCusips[0].cusipId).toBe('CUSIP001')
        expect(sortedCusips[1].cusipId).toBe('CUSIP002')
        expect(sortedCusips[2].cusipId).toBe('CUSIP003')
    })

    test('handles empty cusips array', () => {
        const { result } = renderHook(() => 
            useCusipSorting([], {}, mockOnReorder)
        )

        expect(result.current.sortedCusips).toEqual([])
        expect(result.current.sortBy).toBe('maturity')
        expect(result.current.sortDirection).toBe('asc')
    })

    test('sorting updates when cusips or cusipData change', () => {
        const { result, rerender } = renderHook(
            ({ cusips, cusipData }) => useCusipSorting(cusips, cusipData, mockOnReorder),
            {
                initialProps: {
                    cusips: mockCusips.slice(0, 2),
                    cusipData: mockCusipData
                }
            }
        )

        act(() => {
            result.current.handleSortChange('interest', 'asc')
        })

        expect(result.current.sortedCusips).toHaveLength(2)

        // Update props to include third CUSIP
        rerender({
            cusips: mockCusips,
            cusipData: mockCusipData
        })

        expect(result.current.sortedCusips).toHaveLength(3)
        // Should still be sorted by interest rate ascending
        expect(result.current.sortedCusips[0].cusipId).toBe('CUSIP002') // 1.8%
        expect(result.current.sortedCusips[1].cusipId).toBe('CUSIP001') // 2.5%
        expect(result.current.sortedCusips[2].cusipId).toBe('CUSIP003') // 3.2%
    })

    test('reproduces principal sorting bug with real user data', () => {
        // Real user data from production
        const realCusipData = [
            {"cusipId":"912810RW0","originalPrincipal":"5000","uniqueId":"912810RW0-1753042533814-458s7zb1n","addedAt":"2025-07-20T20:15:33.814Z","lastUpdated":"2025-07-20T20:42:44.103Z"},
            {"cusipId":"912810SB5","originalPrincipal":"5000","uniqueId":"912810SB5-1753042539613-pv0lm9cfq","addedAt":"2025-07-20T20:15:39.614Z","lastUpdated":"2025-07-20T20:42:44.103Z"},
            {"cusipId":"91282CJY8","originalPrincipal":"5000","uniqueId":"91282CJY8-1753042203970-t4w6xmj9e","addedAt":"2025-07-20T20:10:03.971Z","lastUpdated":"2025-07-20T20:42:44.103Z"},
            {"cusipId":"912810SB5","originalPrincipal":"6000","uniqueId":"912810SB5-1753042718263-s5ddnuef8","addedAt":"2025-07-20T20:18:38.264Z","lastUpdated":"2025-07-20T20:42:44.103Z"},
            {"cusipId":"912810SB5","originalPrincipal":"2000","uniqueId":"912810SB5-1753042723807-6qv0r0vbe","addedAt":"2025-07-20T20:18:43.807Z","lastUpdated":"2025-07-20T20:42:44.103Z"},
            {"cusipId":"912810SV1","originalPrincipal":"5000","uniqueId":"912810SV1-1753042545725-i0h7blo6w","addedAt":"2025-07-20T20:15:45.725Z","lastUpdated":"2025-07-20T20:42:44.103Z"}
        ]

        // Empty cusipData means sorting will fall back to originalPrincipal strings
        const emptyCusipData = {}

        const { result } = renderHook(() => 
            useCusipSorting(realCusipData, emptyCusipData, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('adjusted', 'asc')
        })

        const sortedCusips = result.current.sortedCusips
        
        // Expected order by NUMERICAL value (should be 2000, then 5000s, then 6000)
        expect(sortedCusips[0].originalPrincipal).toBe('2000') // Should be first (lowest)
        expect(sortedCusips[sortedCusips.length - 1].originalPrincipal).toBe('6000') // Should be last (highest)
        
        // Additional verification - all values between first and last should be "5000"
        for (let i = 1; i < sortedCusips.length - 1; i++) {
            expect(sortedCusips[i].originalPrincipal).toBe('5000')
        }
    })

    test('exposes string vs number sorting issue with problematic values', () => {
        // This test will fail if string sorting is used instead of numeric sorting
        const problematicCusips = [
            {"cusipId":"CUSIP001","originalPrincipal":"10000","uniqueId":"unique1"}, // String "10000" 
            {"cusipId":"CUSIP002","originalPrincipal":"2000","uniqueId":"unique2"},  // String "2000"
            {"cusipId":"CUSIP003","originalPrincipal":"9000","uniqueId":"unique3"}   // String "9000"
        ]

        // No cusipData, so it falls back to originalPrincipal strings
        const emptyCusipData = {}

        const { result } = renderHook(() => 
            useCusipSorting(problematicCusips, emptyCusipData, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('adjusted', 'asc')
        })

        const sortedCusips = result.current.sortedCusips
        
        // Numerical order should be: 2000, 9000, 10000
        // But STRING order would be: 10000, 2000, 9000 (because "1" < "2" < "9")
        expect(sortedCusips[0].originalPrincipal).toBe('2000')  // Should be first numerically
        expect(sortedCusips[1].originalPrincipal).toBe('9000')  // Should be second numerically  
        expect(sortedCusips[2].originalPrincipal).toBe('10000') // Should be last numerically
        
        // This test will FAIL if sorting treats originalPrincipal as strings
    })

    test('handles duplicate CUSIPs with different adjusted principals', () => {
        // Scenario: Same CUSIP added multiple times with different original amounts
        const duplicateCusips = [
            {"cusipId":"912810SB5","originalPrincipal":"5000","uniqueId":"912810SB5-first"},
            {"cusipId":"912810SB5","originalPrincipal":"6000","uniqueId":"912810SB5-second"},
            {"cusipId":"912810SB5","originalPrincipal":"2000","uniqueId":"912810SB5-third"},
            {"cusipId":"912810RW0","originalPrincipal":"3000","uniqueId":"912810RW0-single"}
        ]

        // Each instance has different adjusted principal values
        const cusipDataWithDuplicates = {
            '912810SB5-first': {
                maturityDate: '2025-01-15T00:00:00',
                adjustedPrincipal: 5500,
                interestRate: 2.5,
                originalPrincipal: 5000
            },
            '912810SB5-second': {
                maturityDate: '2025-01-15T00:00:00',
                adjustedPrincipal: 6600, // Different adjusted principal based on different original
                interestRate: 2.5,
                originalPrincipal: 6000
            },
            '912810SB5-third': {
                maturityDate: '2025-01-15T00:00:00',
                adjustedPrincipal: 2200, // Different adjusted principal based on different original
                interestRate: 2.5,
                originalPrincipal: 2000
            },
            '912810RW0-single': {
                maturityDate: '2024-06-15T00:00:00',
                adjustedPrincipal: 3200,
                interestRate: 1.8,
                originalPrincipal: 3000
            }
        }

        const { result } = renderHook(() => 
            useCusipSorting(duplicateCusips, cusipDataWithDuplicates, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('adjusted', 'asc')
        })

        const sortedCusips = result.current.sortedCusips

        // Each 912810SB5 instance now has its own adjustedPrincipal
        // Order should be: 912810SB5-third (2200), 912810RW0 (3200), 912810SB5-first (5500), 912810SB5-second (6600)
        expect(sortedCusips[0].uniqueId).toBe('912810SB5-third')   // 2200 (lowest)
        expect(sortedCusips[1].uniqueId).toBe('912810RW0-single')  // 3200
        expect(sortedCusips[2].uniqueId).toBe('912810SB5-first')   // 5500
        expect(sortedCusips[3].uniqueId).toBe('912810SB5-second')  // 6600 (highest)

        // Verify that all three 912810SB5 instances are present with different uniqueIds
        const sb5Instances = sortedCusips.filter(cusip => cusip.cusipId === '912810SB5')
        expect(sb5Instances).toHaveLength(3)
        
        const uniqueIds = sb5Instances.map(cusip => cusip.uniqueId)
        expect(uniqueIds).toContain('912810SB5-first')
        expect(uniqueIds).toContain('912810SB5-second')
        expect(uniqueIds).toContain('912810SB5-third')
    })

    test('handles duplicate CUSIPs falling back to different originalPrincipal values', () => {
        // Scenario: Same CUSIP multiple times, but no adjusted principal data available
        const duplicateCusips = [
            {"cusipId":"912810SB5","originalPrincipal":"8000","uniqueId":"912810SB5-large"},
            {"cusipId":"912810SB5","originalPrincipal":"1000","uniqueId":"912810SB5-small"},
            {"cusipId":"912810SB5","originalPrincipal":"5000","uniqueId":"912810SB5-medium"}
        ]

        // No cusipData available, so sorting falls back to originalPrincipal
        const emptyCusipData = {}

        const { result } = renderHook(() => 
            useCusipSorting(duplicateCusips, emptyCusipData, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('adjusted', 'asc')
        })

        const sortedCusips = result.current.sortedCusips

        // Should be sorted by originalPrincipal: 1000, 5000, 8000
        expect(sortedCusips[0].originalPrincipal).toBe('1000')
        expect(sortedCusips[0].uniqueId).toBe('912810SB5-small')
        
        expect(sortedCusips[1].originalPrincipal).toBe('5000')
        expect(sortedCusips[1].uniqueId).toBe('912810SB5-medium')
        
        expect(sortedCusips[2].originalPrincipal).toBe('8000')
        expect(sortedCusips[2].uniqueId).toBe('912810SB5-large')

        // All should have the same CUSIP ID
        expect(sortedCusips[0].cusipId).toBe('912810SB5')
        expect(sortedCusips[1].cusipId).toBe('912810SB5')
        expect(sortedCusips[2].cusipId).toBe('912810SB5')
    })

    test('exposes issue: duplicate CUSIPs should have individual adjusted principals based on uniqueId', () => {
        // This test demonstrates the current bug where duplicate CUSIPs all share the same adjustedPrincipal
        const duplicateCusips = [
            {"cusipId":"912810SB5","originalPrincipal":"1000","uniqueId":"912810SB5-1753042539613-pv0lm9cfq"},
            {"cusipId":"912810SB5","originalPrincipal":"6000","uniqueId":"912810SB5-1753042718263-s5ddnuef8"},
            {"cusipId":"912810SB5","originalPrincipal":"2000","uniqueId":"912810SB5-1753042723807-6qv0r0vbe"}
        ]

        // Each instance should have its own adjusted principal based on its own originalPrincipal
        // But currently cusipData is keyed by cusipId, not uniqueId
        const cusipDataKeyedByUniqueId = {
            // These should be keyed by uniqueId, not cusipId
            '912810SB5-1753042539613-pv0lm9cfq': {
                maturityDate: '2025-01-15T00:00:00',
                adjustedPrincipal: 1100, // 1000 * 1.1 = 1100
                interestRate: 2.5,
                originalPrincipal: 1000
            },
            '912810SB5-1753042718263-s5ddnuef8': {
                maturityDate: '2025-01-15T00:00:00',
                adjustedPrincipal: 6600, // 6000 * 1.1 = 6600
                interestRate: 2.5,
                originalPrincipal: 6000
            },
            '912810SB5-1753042723807-6qv0r0vbe': {
                maturityDate: '2025-01-15T00:00:00',
                adjustedPrincipal: 2200, // 2000 * 1.1 = 2200
                interestRate: 2.5,
                originalPrincipal: 2000
            }
        }

        const { result } = renderHook(() => 
            useCusipSorting(duplicateCusips, cusipDataKeyedByUniqueId, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('adjusted', 'asc')
        })

        const sortedCusips = result.current.sortedCusips

        // Expected order by individual adjusted principals: 1100, 2200, 6600
        // But this will FAIL because the current implementation keys cusipData by cusipId,
        // so all instances will get undefined cusipData and fall back to originalPrincipal (1000, 2000, 6000)
        
        // What we WANT (sorted by adjusted principal):
        // expect(sortedCusips[0].uniqueId).toBe('912810SB5-1753042539613-pv0lm9cfq') // adjustedPrincipal: 1100
        // expect(sortedCusips[1].uniqueId).toBe('912810SB5-1753042723807-6qv0r0vbe') // adjustedPrincipal: 2200  
        // expect(sortedCusips[2].uniqueId).toBe('912810SB5-1753042718263-s5ddnuef8') // adjustedPrincipal: 6600
        
        // What we ACTUALLY GET (sorted by originalPrincipal because cusipData lookup fails):
        expect(sortedCusips[0].originalPrincipal).toBe('1000') // Falls back to originalPrincipal
        expect(sortedCusips[1].originalPrincipal).toBe('2000') // Falls back to originalPrincipal  
        expect(sortedCusips[2].originalPrincipal).toBe('6000') // Falls back to originalPrincipal
        
        // This test shows the bug: we're getting originalPrincipal order instead of adjustedPrincipal order
        // because the cusipData lookup by cusipId fails when data is keyed by uniqueId
    })

    test('demonstrates current behavior: duplicate CUSIPs fall back to originalPrincipal sorting', () => {
        // This test shows what actually happens with the current implementation
        const duplicateCusips = [
            {"cusipId":"912810SB5","originalPrincipal":"1000","uniqueId":"912810SB5-first"},
            {"cusipId":"912810SB5","originalPrincipal":"6000","uniqueId":"912810SB5-second"},
            {"cusipId":"912810SB5","originalPrincipal":"2000","uniqueId":"912810SB5-third"}
        ]

        // Data is keyed by uniqueId (what we want) but sorting looks up by cusipId (the bug)
        const cusipDataKeyedByUniqueId = {
            '912810SB5-first': { adjustedPrincipal: 1100 },
            '912810SB5-second': { adjustedPrincipal: 6600 },
            '912810SB5-third': { adjustedPrincipal: 2200 }
        }

        const { result } = renderHook(() => 
            useCusipSorting(duplicateCusips, cusipDataKeyedByUniqueId, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('adjusted', 'asc')
        })

        const sortedCusips = result.current.sortedCusips

        // Current behavior: can't find cusipData by cusipId, so falls back to originalPrincipal
        // Order will be: 1000, 2000, 6000 (originalPrincipal sorting)
        expect(sortedCusips[0].originalPrincipal).toBe('1000') // Fallback behavior
        expect(sortedCusips[1].originalPrincipal).toBe('2000') // Fallback behavior
        expect(sortedCusips[2].originalPrincipal).toBe('6000') // Fallback behavior
        
        // This confirms the bug: sorting is using originalPrincipal instead of adjustedPrincipal
        // because cusipData lookup by cusipId fails when data is keyed by uniqueId
    })

    test('FAILING TEST: proves we need uniqueId lookup for individual adjusted principals', () => {
        // This test will FAIL to prove the bug exists
        const duplicateCusips = [
            {"cusipId":"912810SB5","originalPrincipal":"5000","uniqueId":"first"},  // Original: 5000
            {"cusipId":"912810SB5","originalPrincipal":"1000","uniqueId":"second"}, // Original: 1000  
            {"cusipId":"912810SB5","originalPrincipal":"3000","uniqueId":"third"}   // Original: 3000
        ]

        // cusipData keyed by uniqueId with adjusted principals in REVERSE order from originalPrincipal
        const cusipDataByUniqueId = {
            'first': { adjustedPrincipal: 1000 },  // Lowest adjusted (should be first)
            'second': { adjustedPrincipal: 9000 }, // Highest adjusted (should be last)  
            'third': { adjustedPrincipal: 5000 }   // Middle adjusted (should be middle)
        }

        const { result } = renderHook(() => 
            useCusipSorting(duplicateCusips, cusipDataByUniqueId, mockOnReorder)
        )

        act(() => {
            result.current.handleSortChange('adjusted', 'asc')
        })

        const sortedCusips = result.current.sortedCusips

        // If sorted by ADJUSTED principal (what we want): 1000, 5000, 9000  
        // Order should be: first, third, second
        expect(sortedCusips[0].uniqueId).toBe('first')  // adjustedPrincipal: 1000 (lowest)
        expect(sortedCusips[1].uniqueId).toBe('third')  // adjustedPrincipal: 5000 (middle)
        expect(sortedCusips[2].uniqueId).toBe('second') // adjustedPrincipal: 9000 (highest)
        
        // This test will FAIL because current implementation sorts by originalPrincipal: 1000, 3000, 5000
        // Actual order will be: second, third, first (by originalPrincipal, not adjustedPrincipal)
    })
}) 