import { useState, useEffect } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { PUSSIO_TOKEN } from '@/lib/token'
import { config } from '@/config/env'
import { voteStore } from '@/stores/voteStore'

const connection = new Connection(config.rpcUrl)

export interface PoolState {
  balance: number
  lastVoteType?: 'pussio' | 'not'
  lastVoteTime?: number
  isProcessing: boolean
}

export function usePoolBalance() {
  const [poolState, setPoolState] = useState<PoolState>({ 
    balance: 0,
    isProcessing: false,
    lastVoteType: undefined,  // This will be 'pussio' or 'not'
    lastVoteTime: undefined
  })

  const setIsProcessing = (isProcessing: boolean) => {
    setPoolState(prev => ({ ...prev, isProcessing }))
  }

  // Record vote type for color flash
  const recordVote = (type: 'pussio' | 'not') => {
    console.log('Recording vote type for flash:', type)
    setPoolState(prev => ({
      ...prev,
      lastVoteType: type,
      lastVoteTime: Date.now()
    }))
  }

  // Poll for balance updates
  useEffect(() => {
    const getPoolBalance = async () => {
      try {
        const poolPubkey = new PublicKey(PUSSIO_TOKEN.poolWallet)
        const mintPubkey = new PublicKey(PUSSIO_TOKEN.mint)
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
          poolPubkey,
          { mint: mintPubkey }
        )

        if (tokenAccounts.value.length > 0) {
          const rawBalance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.amount
          const balance = Number(rawBalance) / Math.pow(10, PUSSIO_TOKEN.decimals)
          
          setPoolState(prev => ({
            ...prev,
            balance
          }))
        }
      } catch (error) {
        console.error('Error getting pool balance:', error)
      }
    }

    getPoolBalance()
    const interval = setInterval(getPoolBalance, 2000)
    return () => clearInterval(interval)
  }, [])

  return {
    ...poolState,
    setIsProcessing,
    recordVote
  }
} 