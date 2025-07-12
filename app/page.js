'use client'

import styles from '../styles/Home.module.css'
import CusipList from '../components/cusipList'

export default function Home() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>TIPS Calculator</h1>
                <p className={styles.description}>Look up TIPS by CUSIP number</p>
                <CusipList />
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
