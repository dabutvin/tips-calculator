'use client'

import styles from '../styles/Home.module.css';
import React, { useState } from 'react';
import CusipDetails from '../components/cusipDetails';

export default function Home() {
  const [cusip, setCusip] = useState(null)

  const handleClick = () => {
    setCusip("91282CJY8")
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          TIPS Calculator
        </h1>

        <p className={styles.description}>
          Something something here
        </p>

        <button onClick={handleClick}>GO</button>
        {cusip && <CusipDetails cusip={cusip} />}

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
  );
}
