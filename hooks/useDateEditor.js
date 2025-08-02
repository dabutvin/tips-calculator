import { useState } from 'react'

export function useDateEditor(currentDate, onUpdate) {
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

        const newDate = new Date(tempValue)
        if (isNaN(newDate.getTime())) {
            alert('Please select a valid date')
            return
        }

        // Check if date is not too far in the future (reasonable limit)
        const today = new Date()
        const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
        
        if (newDate > maxDate) {
            alert('Please select a date within the next year')
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

    return {
        isEditing,
        tempValue,
        handleEditClick,
        handleSave,
        handleCancel,
        handleKeyDown,
        handleInputChange,
    }
}