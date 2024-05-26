import "../styles/global.css"

export const metadata = {
  title: 'TIPS Calculator',
  description: 'A calculator for Treasury Inflation Protected Securities (TIPS)',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
