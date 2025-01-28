import { Inter } from 'next/font/google'
import Header from '@/components/common/Header'
import '../styles/globals.css'
import { WalletProvider } from '@/contexts/WalletContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-white min-h-screen`}>
        <WalletProvider>
          <Header />
          <main className="pt-16 min-h-screen">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  )
}
