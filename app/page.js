'use client'

import { useState } from 'react'
import styles from '../styles/Home.module.css'
import CusipList from '../components/cusipList'
import Tooltip from '../components/Tooltip'
import { clearLocalStorage } from '../utils/localStorage'

export default function Home() {
    const [key, setKey] = useState(0) // Force re-render when data is cleared

    const handleClearAllData = () => {
        const result = clearLocalStorage()
        if (result.success) {
            // Force CusipList to re-render and reload data
            setKey((prev) => prev + 1)
        } else {
            console.error('Failed to clear localStorage:', result.error)
        }
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>TIPS Calculator</h1>
                <p className={styles.description}>Look up TIPS by CUSIP number</p>

                <div style={{ marginBottom: '18px' }}>
                    <a
                        href="/resources"
                        style={{
                            color: '#3a5ca8',
                            textDecoration: 'none',
                            fontSize: '15px',
                            fontWeight: 500,
                            opacity: 0.85,
                            transition: 'opacity 0.2s',
                        }}
                        onMouseOver={e => (e.currentTarget.style.opacity = 1)}
                        onMouseOut={e => (e.currentTarget.style.opacity = 0.85)}
                    >
                        What are TIPS? →
                    </a>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                    <button
                        onClick={handleClearAllData}
                        style={{
                            backgroundColor: '#fff',
                            color: '#dc3545',
                            border: '1px solid #f0f0f0',
                            padding: '8px 18px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                            transition: 'background 0.2s, color 0.2s',
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.backgroundColor = '#ffeaea';
                            e.currentTarget.style.color = '#b71c1c';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.backgroundColor = '#fff';
                            e.currentTarget.style.color = '#dc3545';
                        }}
                    >
                        Clear All Data
                    </button>
                    <Tooltip content="Data is stored only in your browser">ℹ️</Tooltip>
                </div>

                <CusipList key={key} />
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://github.com/dabutvin/tips-calculator"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Open Source on GitHub{' '}
                    <img src="/github-mark.svg" alt="GitHub" className={styles.logo} />
                </a>
            </footer>
        </div>
    )
}
