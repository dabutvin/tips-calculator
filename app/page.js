'use client'

import styles from '../styles/Home.module.css';
import React, { useState } from 'react';
import CusipDetails from '../components/cusipDetails';

export default function Home() {
  const [cusips, setCusips] = useState([])

  const handleAddClick = () => {
    setCusips([...cusips, ""])
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

        {cusips.map((_, index) =>
          <CusipDetails key={index} index={index} />
        )}
        <button onClick={handleAddClick}>Add New</button>
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
