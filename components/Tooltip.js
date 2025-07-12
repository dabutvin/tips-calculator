'use client'

import { useState } from 'react'

export default function Tooltip({ children, content }) {
    const [showTooltip, setShowTooltip] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const toggleTooltip = () => {
        setShowTooltip(!showTooltip)
    }

    const handleMouseEnter = () => {
        if (!showTooltip) {
            setIsHovered(true)
        }
    }

    const handleMouseLeave = () => {
        if (!showTooltip) {
            setIsHovered(false)
        }
    }

    const shouldShowTooltip = showTooltip || isHovered

    return (
        <div
            style={{
                position: 'relative',
                display: 'inline-block',
            }}
        >
            <span
                onClick={toggleTooltip}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    cursor: 'pointer',
                    fontSize: '16px',
                    color: '#6c757d',
                }}
            >
                {children}
            </span>
            {shouldShowTooltip && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#333',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        zIndex: 1000,
                        marginBottom: '5px',
                    }}
                >
                    {content}
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            border: '5px solid transparent',
                            borderTopColor: '#333',
                        }}
                    ></div>
                </div>
            )}
        </div>
    )
}
