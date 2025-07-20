'use client'

import { useState } from 'react'
import styles from '../styles/Home.module.css'
import CusipList from '../components/cusipList'

export default function Home() {
    const [key, setKey] = useState(0) // Force re-render when data is cleared

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>TIPS Calculator</h1>
                <p className={styles.description}>
                    Treasury Inflation-Protected Securities
                    <a
                        href="/resources"
                        style={{
                            color: '#3a5ca8',
                            textDecoration: 'none',
                            fontSize: '15px',
                            fontWeight: 500,
                            opacity: 0.85,
                            marginLeft: '10px',
                            transition: 'opacity 0.2s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
                        onMouseOut={(e) => (e.currentTarget.style.opacity = 0.85)}
                    >
                        What are TIPS? →
                    </a>
                </p>

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
