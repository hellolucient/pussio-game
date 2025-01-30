import { Inter } from 'next/font/google'
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
      <body className={`${inter.className} text-white min-h-screen w-screen overflow-x-hidden bg-black`}>
        <WalletProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  )
}
