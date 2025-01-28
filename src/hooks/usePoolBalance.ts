import { useState, useEffect } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { getAssociatedTokenAddress, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'
import { PUSSIO_TOKEN } from '@/lib/token'
import { config } from '@/config/env'
import { voteStore } from '@/stores/voteStore'

const connection = new Connection(config.rpcUrl)

export interface PoolState {
  balance: number
  lastVoteType?: 'pussio' | 'not'
  lastVoteTime?: number
}

export function usePoolBalance() {
  const [poolState, setPoolState] = useState<PoolState>({ balance: 0 })

  // Listen for votes
  useEffect(() => {
    const unsubscribe = voteStore.subscribe((vote) => {
      if (vote?.votes.length) {
        const lastVote = vote.votes[vote.votes.length - 1]
        const voteType = lastVote.voteType
        
        // Only update if we have a valid vote type
        if (voteType === 'pussio' || voteType === 'not') {
          setPoolState(prev => ({
            ...prev,
            balance: prev.balance,  // Maintain existing balance
            lastVoteType: voteType,  // TypeScript now knows this is 'pussio' | 'not'
            lastVoteTime: lastVote.timestamp
          }))
        }
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

  return poolState
} 