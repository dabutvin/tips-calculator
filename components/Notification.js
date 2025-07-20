'use client'

import React from 'react'

export default function Notification({ notification }) {
    if (!notification) return null

    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '4px',
        color: 'white',
        zIndex: 1000,
        maxWidth: '300px',
        wordWrap: 'break-word',
    }

    const typeStyles = {
        error: { backgroundColor: '#dc3545' },
        success: { backgroundColor: '#28a745' },
    }

    return <div style={{ ...styles, ...typeStyles[notification.type] }}>{notification.message}</div>
}
