"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WalletContextType {
  wallet: any
  setWallet: (wallet: any) => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<any>(null)

  // Initialize wallet on mount
  useEffect(() => {
    const solana = window?.phantom?.solana
    if (solana?.isConnected) {
      setWallet(solana)
    }
  }, [])

  return (
    <WalletContext.Provider value={{ wallet, setWallet }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 