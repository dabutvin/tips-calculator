import Head from 'next/head';
import styles from '../styles/Home.module.css';


export async function getStaticProps() {
  let cusip = "912810SG4"
  let url = `https://www.treasurydirect.gov/TA_WS/secindex/search?cusip=${cusip}&format=json&filterscount=0&groupscount=0&sortdatafield=indexDate&sortorder=desc`
  let response = await fetch(url)
  let data = await response.json()

  let cpiEntries = data.map(entry => {
    return {
      uniqueKey: `${entry.cusip}_${entry.indexDate}_${entry.updateTimeStamp}`,
      dailyIndex: entry.dailyIndex,
      indexDate: entry.indexDate,
      updateTimeStamp: entry.updateTimeStamp
    }
  })

  return {
    props: {
      cusip,
      cpiEntries,
    },
  };
}

export default function Home({ cusip, cpiEntries }) {

  return (
    <div className={styles.container}>
      <Head>
        <title>TIPS Calculator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className={styles.title}>
          TIPS Calculator
        </h1>

        <p className={styles.description}>
          Something something here
        </p>

        <p>CUSIP: {cusip}</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Index Ratio</th>
            </tr>
          </thead>
          <tbody>
            {cpiEntries.map(entry =>
              <tr key={entry.uniqueKey}>
                <td>{new Date(entry.indexDate).toLocaleDateString()}</td>
                <td>{entry.dailyIndex}</td>
              </tr>
            )}
          </tbody>
        </table>

      </main>

      <footer>
        <a
          href="https://github.com/dabutvin/tips-calculator"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Source on GitHub{' '}
          <img src="/github-mark.svg" alt="GitHub" className={styles.logo} />
        </a>
      </footer>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
