"use client"

import Link from 'next/link'
import ImageDisplay from '@/components/game/ImageDisplay'
import VoteGauge from '@/components/game/VoteGauge'
import VoteButtons from '@/components/game/VoteButtons'
import PrizePool from '@/components/game/PrizePool'
import { useState, useEffect } from 'react'
import { useWallet } from '@/contexts/WalletContext'

export default function Home() {
  const { wallet } = useWallet()

  // Debug wallet state changes
  useEffect(() => {
    console.log('Current wallet state in page:', wallet)
  }, [wallet])

  return (
    <div className="h-screen flex flex-col">
      {/* Hero Section - Even More Compact */}
      <section className="pt-6 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-1">
            <h1 className="text-3xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 to-pink-400 text-transparent bg-clip-text">
                PUSSIO or NOT?
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
              Vote to Win - Stake to Earn
            </p>
          </div>
        </div>
      </section>

      {/* PUSSIO PORTAL Section */}
      <section className="flex-1 relative flex items-start py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Portal Frame */}
          <div className="relative mx-auto max-w-2xl aspect-[3/2]">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-purple-900/30 blur-3xl transform -translate-y-1/2" />
            
            {/* Main Portal Container */}
            <div className="relative h-full bg-gradient-to-b from-transparent via-purple-900/50 to-purple-900/80 backdrop-blur-sm rounded-[40px] border border-pink-500/20 overflow-hidden">
              {/* Beam Effect */}
              <div className="absolute inset-x-0 bottom-0 w-full">
                {/* Base Platform */}
                <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-cyan-500/30 to-transparent blur-sm" />
                
                {/* Animated Beam */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[500px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/50 via-pink-500/30 to-transparent animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/30 via-pink-500/20 to-transparent blur-xl animate-pulse" />
                </div>
              </div>

              {/* Current Image Container */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%]">
                <div className="relative w-full h-full">
                  <ImageDisplay />
                </div>
              </div>

              {/* Tech Details */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-black/30 rounded-full backdrop-blur-sm border border-pink-500/20">
                <span className="text-sm text-cyan-400 font-mono">ROUND #1</span>
              </div>

              {/* Prize Pool Display - Added below round number */}
              <PrizePool />

              {/* Side Decorations */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-pink-500/50 to-transparent" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-pink-500/50 to-transparent" />
            </div>
          </div>

          {/* Vote Controls */}
          <div className="py-0.5 space-y-1">
            <VoteButtons wallet={wallet} />
            <VoteGauge />
          </div>
        </div>
      </section>
    </div>
  )
}
