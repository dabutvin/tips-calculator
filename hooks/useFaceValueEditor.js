import { useState } from 'react'
import { validateFaceValue } from '../utils/validation'

export function useFaceValueEditor(currentValue, onUpdate) {
    const [isEditing, setIsEditing] = useState(false)
    const [tempValue, setTempValue] = useState('')

    const handleEditClick = () => {
        setTempValue(currentValue)
        setIsEditing(true)
    }

    const handleSave = () => {
        const validationError = validateFaceValue(tempValue)
        if (validationError) {
            alert(validationError)
            return
        }

        if (onUpdate) {
            onUpdate(tempValue)
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
