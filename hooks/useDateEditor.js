import { useState } from 'react'

export function useDateEditor(currentDate, onUpdate, maxDate) {
    const [isEditing, setIsEditing] = useState(false)
    const [tempValue, setTempValue] = useState('')

    const formatDateForInput = (date) => {
        // Format date as YYYY-MM-DD for HTML date input
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    const handleEditClick = () => {
        setTempValue(formatDateForInput(currentDate))
        setIsEditing(true)
    }

    const handleSave = () => {
        if (!tempValue) {
            alert('Please select a valid date')
            return
        }

        // Parse the date string manually to avoid timezone issues
        const [year, month, day] = tempValue.split('-').map(Number)
        const newDate = new Date(year, month - 1, day) // month is 0-indexed
        if (isNaN(newDate.getTime())) {
            alert('Please select a valid date')
            return
        }

        // Use the provided maxDate (computed from CUSIP data or fallback)
        const validationMaxDate =
            maxDate ||
            new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())

        if (newDate > validationMaxDate) {
            const maxDateFormatted = validationMaxDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
            alert(
                `Please select a date within the available data range. The latest available date is ${maxDateFormatted}`,
            )
            return
        }

        // Check if date is not too far in the past (TIPS started in 1997)
        const minDate = new Date('1997-01-01')
        if (newDate < minDate) {
            alert('Please select a date after January 1, 1997 (when TIPS were first issued)')
            return
        }

        if (onUpdate) {
            onUpdate(newDate)
        }
        setIsEditing(false)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setTempValue('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave()
        } else if (e.key === 'Escape') {
            handleCancel()
        }
    }

    const handleInputChange = (e) => {
        setTempValue(e.target.value)
    }

    const handleToday = () => {
        const today = new Date()
        if (onUpdate) {
            onUpdate(today)
        }
        setIsEditing(false)
    }

    return {
        isEditing,
        tempValue,
        handleEditClick,
        handleSave,
        handleCancel,
        handleKeyDown,
        handleInputChange,
        handleToday,
    }
}
