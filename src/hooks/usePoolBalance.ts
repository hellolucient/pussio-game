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
    isProcessing: false 
  })

  const setIsProcessing = (isProcessing: boolean) => {
    setPoolState(prev => ({ ...prev, isProcessing }))
  }

  // Listen for votes with more logging
  useEffect(() => {
    console.log('Setting up vote subscription')
    const unsubscribe = voteStore.subscribe((vote) => {
      console.log('Vote update in usePoolBalance:', vote)
      if (vote?.votes.length) {
        const lastVote = vote.votes[vote.votes.length - 1]
        console.log('Last vote:', lastVote)
        
        setPoolState(prev => ({
          ...prev,
          lastVoteType: lastVote.voteType as 'pussio' | 'not',
          lastVoteTime: lastVote.timestamp
        }))
      }
    })
    return unsubscribe
  }, [])

  // Poll for balance updates
  useEffect(() => {
    const getPoolBalance = async () => {
      try {
        const poolPubkey = new PublicKey(PUSSIO_TOKEN.poolWallet)
        const mintPubkey = new PublicKey(PUSSIO_TOKEN.mint)

        // Get token balance
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
    const interval = setInterval(getPoolBalance, 5000)
    return () => clearInterval(interval)
  }, [])

  return {
    ...poolState,
    setIsProcessing
  }
} 