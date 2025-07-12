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

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '20px',
                    }}
                >
                    <button
                        onClick={handleClearAllData}
                        style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
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
