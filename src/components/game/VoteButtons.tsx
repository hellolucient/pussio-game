"use client"

import { useState, useEffect } from 'react'
import { hasEnoughTokens, sendTokensToPool, PUSSIO_TOKEN } from '@/lib/token'
import { voteStore } from '@/stores/voteStore'
import { Wallet } from '@/types'

const VoteButtons = ({ wallet }: { wallet: Wallet | null }) => {
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState('')

  // Monitor wallet prop changes
  useEffect(() => {
    console.log('VoteButtons - wallet prop changed:', wallet)
    console.log('VoteButtons - is wallet connected:', wallet?.isConnected)
  }, [wallet])

  const handleVote = async (isPussio: boolean) => {
    try {
      console.log('Vote clicked:', isPussio ? 'PUSSIO' : 'NOT')
      console.log('Wallet instance:', wallet)

      if (!wallet || !wallet.isConnected) {
        console.log('No valid wallet connection')
        setError('Please connect your wallet first')
        return
      }

      setIsVoting(true)
      setError('')

      // Check if user has enough tokens
      const canVote = await hasEnoughTokens(wallet)
      console.log('Has enough tokens:', canVote)

      if (!canVote) {
        setError(`Insufficient balance. ${PUSSIO_TOKEN.requiredAmount} $PUSSIO required to vote.`)
        return
      }

      // Send tokens to pool
      console.log('Attempting to send tokens...')
      const success = await sendTokensToPool(wallet)
      console.log('Send tokens result:', success)

      if (success) {
        voteStore.recordVote(wallet.publicKey.toString(), isPussio ? 'pussio' : 'not')
        console.log('Vote recorded:', isPussio ? 'PUSSIO' : 'NOT')
      }

    } catch (error) {
      console.error('Vote error:', error)
      setError('An error occurred while voting')
    } finally {
      setIsVoting(false)
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