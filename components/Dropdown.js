'use client'

import { useState, useRef, useEffect } from 'react'
import styles from '../styles/Dropdown.module.css'

export default function Dropdown({
    options = [],
    value = '',
    onChange = () => {},
    placeholder = 'Select an option',
    label = '',
    id = '',
    disabled = false,
    className = '',
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [focusedIndex, setFocusedIndex] = useState(-1)
    const dropdownRef = useRef(null)
    const triggerRef = useRef(null)
    const listRef = useRef(null)

    // Find selected option for display
    const selectedOption = options.find((option) => option.value === value)
    const displayText = selectedOption ? selectedOption.label : placeholder

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
                setFocusedIndex(-1)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    // Reset focused index when options change
    useEffect(() => {
        setFocusedIndex(-1)
    }, [options])

    // Handle keyboard navigation
    const handleKeyDown = (event) => {
        if (disabled) return

        switch (event.key) {
            case 'Enter':
            case ' ': // Space
                event.preventDefault()
                if (!isOpen) {
                    setIsOpen(true)
                    setFocusedIndex(0)
                } else if (focusedIndex >= 0) {
                    selectOption(options[focusedIndex])
                }
                break

            case 'Escape':
                event.preventDefault()
                setIsOpen(false)
                setFocusedIndex(-1)
                triggerRef.current?.focus()
                break

            case 'ArrowDown':
                event.preventDefault()
                if (!isOpen) {
                    setIsOpen(true)
                    setFocusedIndex(0)
                } else {
                    setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0))
                }
                break

            case 'ArrowUp':
                event.preventDefault()
                if (!isOpen) {
                    setIsOpen(true)
                    setFocusedIndex(options.length - 1)
                } else {
                    setFocusedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1))
                }
                break

            case 'Tab':
                if (isOpen) {
                    setIsOpen(false)
                    setFocusedIndex(-1)
                }
                break

            default:
                break
        }
    }

    // Handle option selection
    const selectOption = (option) => {
        onChange(option.value)
        setIsOpen(false)
        setFocusedIndex(-1)
        triggerRef.current?.focus()
    }

    // Handle trigger click
    const handleTriggerClick = () => {
        if (disabled) return

        if (!isOpen) {
            setIsOpen(true)
            setFocusedIndex(0)
        } else {
            setIsOpen(false)
            setFocusedIndex(-1)
        }
    }

    return (
        <div className={`${styles.dropdown} ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    style={{
                        fontSize: '0.75rem',
                        color: '#666',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '0',
                    }}
                >
                    {label}
                </label>
            )}

            <div className={styles.triggerWrapper} ref={dropdownRef}>
                <button
                    ref={triggerRef}
                    id={id}
                    type="button"
                    className={`${styles.trigger} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
                    onClick={handleTriggerClick}
                    onKeyDown={handleKeyDown}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-labelledby={label ? undefined : 'dropdown-label'}
                    disabled={disabled}
                >
                    <span className={styles.value}>{displayText}</span>
                    <span className={styles.arrow} aria-hidden="true">
                        ▼
                    </span>
                </button>

                {isOpen && (
                    <ul
                        ref={listRef}
                        className={styles.options}
                        role="listbox"
                        aria-labelledby={id}
                        tabIndex={-1}
                    >
                        {options.map((option, index) => (
                            <li
                                key={option.value}
                                className={`${styles.option} ${
                                    index === focusedIndex ? styles.focused : ''
                                } ${option.value === value ? styles.selected : ''}`}
                                role="option"
                                aria-selected={option.value === value}
                                onMouseEnter={() => setFocusedIndex(index)}
                                onMouseDown={(e) => {
                                    e.preventDefault() // Prevent blur on trigger
                                    selectOption(option)
                                }}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
