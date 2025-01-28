"use client"

import { usePoolBalance } from '@/hooks/usePoolBalance'
import { useEffect, useState } from 'react'

interface PrizePoolState {
  timeLeft: number
  isFlashing: boolean
  prevBalance: number
}

const PrizePool = () => {
  const { balance, lastVoteType } = usePoolBalance()
  const [timeLeft, setTimeLeft] = useState(3600)
  const [isFlashing, setIsFlashing] = useState(false)
  const [prevBalance, setPrevBalance] = useState(balance)

  // Handle balance changes with flash animation
  useEffect(() => {
    if (Math.floor(balance) !== Math.floor(prevBalance)) {
      setIsFlashing(true)
      setTimeout(() => setIsFlashing(false), 1000)
      setPrevBalance(balance)
    }
  }, [balance, prevBalance])

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 3600))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="absolute right-4 top-4">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-lg" />
      
      {/* Main container */}
      <div className="relative px-4 py-3 bg-black/20 rounded-lg backdrop-blur-sm border border-cyan-500/30 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" />
        
        {/* Flash animation overlay */}
        <div className={`absolute inset-0 transition-colors duration-500 ${
          isFlashing 
            ? lastVoteType === 'not'
              ? 'bg-rose-500/20'
              : 'bg-green-500/20'
            : 'bg-transparent'
        }`} />

        {/* Content */}
        <div className="relative space-y-1">
          <div className="text-xs uppercase tracking-wider text-cyan-400/80">
            CURRENT PRIZE POOL
          </div>
          
          <div className={`text-xl font-mono font-bold transition-colors duration-500 ${
            isFlashing
              ? lastVoteType === 'not'
                ? 'text-rose-400'
                : 'text-green-400'
              : 'text-cyan-400'
          }`}>
            {Math.floor(balance).toLocaleString()} <span className="text-xs">$PUSSIO</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-cyan-400/80">
            <span>Voting Closes:</span>
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrizePool 