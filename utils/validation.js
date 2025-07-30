/**
 * Validation utilities for the tips calculator application
 */

/**
 * Validates a CUSIP (Committee on Uniform Securities Identification Procedures)
 * @param {string} cusip - The CUSIP to validate
 * @returns {string} - Empty string if valid, error message if invalid
 */
export const validateCusip = (cusip) => {
    if (!cusip) {
        return 'CUSIP is required'
    }

    if (cusip.length !== 9) {
        return 'CUSIP must be exactly 9 characters long'
    }

    return ''
}

/**
 * Validates that a value is a positive number for face value
 * @param {string|number} value - The value to validate
 * @returns {string} - Empty string if valid, error message if invalid
 */
export const validateFaceValue = (value) => {
    if (!value) {
        return 'Face value is required'
    }

    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
        return 'Face value must be a valid number'
    }

    if (numValue <= 0) {
        return 'Face value must be greater than zero'
    }

    if (numValue % 100 !== 0) {
        return 'Face value must be divisible by 100'
    }

    return ''
}
