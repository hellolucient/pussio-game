"use client"

import { useState, useEffect } from 'react'
import { hasEnoughTokens, sendTokensToPool, PUSSIO_TOKEN } from '@/lib/token'
import { voteStore } from '@/stores/voteStore'
import { Wallet } from '@/types'
import { usePoolBalance } from '@/hooks/usePoolBalance'

const VoteButtons = ({ wallet }: { wallet: Wallet | null }) => {
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState('')
  const { setIsProcessing, recordVote } = usePoolBalance()

  // Monitor wallet prop changes
  useEffect(() => {
    console.log('VoteButtons - wallet prop changed:', wallet)
    console.log('VoteButtons - is wallet connected:', wallet?.isConnected)
  }, [wallet])

  const handleVote = async (isPussio: boolean) => {
    try {
      console.log('Starting vote process:', { isPussio, wallet })
      
      if (!wallet || !wallet.isConnected) {
        setError('Please connect your wallet first')
        return
      }

      setIsVoting(true)
      setIsProcessing(true)

      // Send tokens to pool
      const success = await sendTokensToPool(wallet)
      console.log('Send tokens result:', success)

      if (success) {
        console.log('About to emit vote type:', isPussio ? 'pussio' : 'not')
        recordVote(isPussio ? 'pussio' : 'not')
        console.log('Vote emitted')

        // Record in voteStore if there's an active session
        if (voteStore.getCurrentVote()) {
          voteStore.recordVote(wallet.publicKey.toString(), isPussio ? 'pussio' : 'not')
        }
      }

    } catch (error) {
      console.error('Vote error:', error)
      setError('An error occurred while voting')
    } finally {
      setIsVoting(false)
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-6">
        <button 
          onClick={() => {
            console.log('PUSSIO button clicked') // Debug click
            handleVote(true)
          }}
          disabled={isVoting}
          className="group relative px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-green-400/20 animate-pulse group-hover:bg-green-400/30" />
          <span className="relative text-lg font-bold">
            {isVoting ? 'Voting...' : 'PUSSIO'}
          </span>
        </button>

        <button 
          onClick={() => {
            console.log('NOT button clicked') // Debug click
            handleVote(false)
          }}
          disabled={isVoting}
          className="group relative px-6 py-2 bg-gradient-to-r from-red-500 to-rose-600 rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-red-400/20 animate-pulse group-hover:bg-red-400/30" />
          <span className="relative text-lg font-bold">
            {isVoting ? 'Voting...' : 'or NOT'}
          </span>
        </button>
      </div>
      
      {error && (
        <div className="text-center text-sm text-rose-400">
          {error}
        </div>
      )}
    </div>
  )
}

export default VoteButtons 