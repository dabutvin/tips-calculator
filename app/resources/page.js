'use client'

import styles from '../../styles/Home.module.css'
import Link from 'next/link'

export default function Resources() {
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>TIPS Resources</h1>
                <p className={styles.description}>
                    Learn more about Treasury Inflation Protected Securities
                </p>

                <div style={{ maxWidth: '800px', textAlign: 'left', lineHeight: '1.6' }}>
                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{ color: '#222', marginBottom: '20px' }}>What are TIPS?</h2>
                        <p style={{ marginBottom: '15px' }}>
                            Treasury Inflation-Protected Securities (TIPS) are U.S. government bonds
                            designed to help protect investors from inflation. Unlike traditional
                            bonds, TIPS have their principal value adjusted based on changes in the
                            Consumer Price Index (CPI).
                        </p>
                        <p style={{ marginBottom: '15px' }}>
                            When inflation rises, the principal value of TIPS increases, and when
                            deflation occurs, it decreases. Interest payments are calculated based
                            on the adjusted principal, so they also rise and fall with inflation.
                        </p>
                        <p style={{ marginBottom: '15px' }}>
                            TIPS are considered one of the safest investments available since they
                            are backed by the full faith and credit of the U.S. government, and they
                            provide a guaranteed real return above inflation.
                        </p>
                    </section>

                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{ color: '#222', marginBottom: '20px' }}>
                            Sample TIPS CUSIPs
                        </h2>
                        <p style={{ marginBottom: '15px' }}>
                            Don't have a CUSIP handy? Try these sample TIPS CUSIPs in the calculator
                            to see how it works:
                        </p>
                        <div
                            style={{
                                display: 'grid',
                                gap: '15px',
                                marginBottom: '20px',
                            }}
                        >
                            <div
                                style={{
                                    border: '1px solid #eaeaea',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    backgroundColor: '#f8f9fa',
                                }}
                            >
                                <strong style={{ color: '#333' }}>91282CGK1</strong>
                                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                                    1.125% 10-Year TIPS due January 15, 2033
                                </p>
                            </div>
                            <div
                                style={{
                                    border: '1px solid #eaeaea',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    backgroundColor: '#f8f9fa',
                                }}
                            >
                                <strong style={{ color: '#333' }}>912828Y38</strong>
                                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                                    0.75% 10-Year TIPS due July 15, 2028
                                </p>
                            </div>
                            <div
                                style={{
                                    border: '1px solid #eaeaea',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    backgroundColor: '#f8f9fa',
                                }}
                            >
                                <strong style={{ color: '#333' }}>912828WU0</strong>
                                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                                    0.125% 10-Year TIPS due July 15, 2024
                                </p>
                            </div>
                            <div
                                style={{
                                    border: '1px solid #eaeaea',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    backgroundColor: '#f8f9fa',
                                }}
                            >
                                <strong style={{ color: '#333' }}>912810TP3</strong>
                                <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                                    1.5% 30-Year TIPS due February 15, 2053
                                </p>
                            </div>
                        </div>
                    </section>

                    <section style={{ marginBottom: '40px' }}>
                        <h2 style={{ color: '#222', marginBottom: '20px' }}>
                            Helpful Resources
                        </h2>

                        <div style={{ display: 'grid', gap: '20px' }}>
                            <div
                                style={{
                                    border: '1px solid #eaeaea',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    backgroundColor: '#fafafa',
                                }}
                            >
                                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                                    <a
                                        href="https://treasurydirect.gov/marketable-securities/tips/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#3a5ca8', textDecoration: 'none' }}
                                    >
                                        TreasuryDirect TIPS
                                    </a>
                                </h3>
                                <p style={{ margin: '0', color: '#666' }}>
                                    Official U.S. Treasury information about TIPS, including how
                                    they work, auction schedules, and purchasing details.
                                </p>
                            </div>

                            <div
                                style={{
                                    border: '1px solid #eaeaea',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    backgroundColor: '#fafafa',
                                }}
                            >
                                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                                    <a
                                        href="https://www.bogleheads.org/wiki/Treasury_Inflation_Protected_Security"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#3a5ca8', textDecoration: 'none' }}
                                    >
                                        Bogleheads TIPS Wiki
                                    </a>
                                </h3>
                                <p style={{ margin: '0', color: '#666' }}>
                                    Comprehensive guide to TIPS from the Bogleheads community,
                                    including detailed explanations and investment strategies.
                                </p>
                            </div>

                            <div
                                style={{
                                    border: '1px solid #eaeaea',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    backgroundColor: '#fafafa',
                                }}
                            >
                                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                                    <a
                                        href="https://eyebonds.info"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#3a5ca8', textDecoration: 'none' }}
                                    >
                                        EyeBonds.info
                                    </a>
                                </h3>
                                <p style={{ margin: '0', color: '#666' }}>
                                    Comprehensive TIPS data and analytics platform with real-time
                                    pricing and yield information.
                                </p>
                            </div>

                            <div
                                style={{
                                    border: '1px solid #eaeaea',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    backgroundColor: '#fafafa',
                                }}
                            >
                                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                                    <a
                                        href="https://eyebonds.info/tips/help.html"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#3a5ca8', textDecoration: 'none' }}
                                    >
                                        EyeBonds TIPS Help
                                    </a>
                                </h3>
                                <p style={{ margin: '0', color: '#666' }}>
                                    Detailed help and documentation for understanding TIPS data and
                                    calculations.
                                </p>
                            </div>

                            <div
                                style={{
                                    border: '1px solid #eaeaea',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    backgroundColor: '#fafafa',
                                }}
                            >
                                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                                    <a
                                        href="https://www.tipsladder.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#3a5ca8', textDecoration: 'none' }}
                                    >
                                        TIPS Ladder
                                    </a>
                                </h3>
                                <p style={{ margin: '0', color: '#666' }}>
                                    Build and analyze TIPS ladders for retirement income planning.
                                </p>
                            </div>

                            <div
                                style={{
                                    border: '1px solid #eaeaea',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    backgroundColor: '#fafafa',
                                }}
                            >
                                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                                    <a
                                        href="https://tipswatch.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#3a5ca8', textDecoration: 'none' }}
                                    >
                                        TIPS Watch
                                    </a>
                                </h3>
                                <p style={{ margin: '0', color: '#666' }}>
                                    News, analysis, and commentary on TIPS market developments and
                                    investment strategies.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <div style={{ marginTop: '40px' }}>
                    <Link
                        href="/"
                        style={{
                            color: '#3a5ca8',
                            textDecoration: 'none',
                            fontSize: '16px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                        }}
                    >
                        ← Back to Calculator
                    </Link>
                </div>
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
