"use client"

import { useState, useEffect } from 'react'
import ImageDisplay from '@/components/game/ImageDisplay'
import VoteGauge from '@/components/game/VoteGauge'
import VoteButtons from '@/components/game/VoteButtons'
import PrizePool from '@/components/game/PrizePool'
import LandingPage from '@/components/landing/LandingPage'
import { useWallet } from '@/contexts/WalletContext'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function Home() {
  const { wallet } = useWallet()
  const [showLanding, setShowLanding] = useState(true)

  // Debug wallet state changes
  useEffect(() => {
    console.log('Current wallet state in page:', wallet)
  }, [wallet])

  if (showLanding) {
    return <LandingPage onComplete={() => setShowLanding(false)} />
  }

  return (
    <motion.div 
      className="min-h-screen w-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 1,
        ease: "easeInOut" 
      }}
    >
      {/* Background */}
      <div className="fixed inset-0 w-screen h-screen">
        <div className="absolute inset-0 w-full h-full bg-wall1 bg-cover" />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {/* Hero Section */}
        <section className="pt-20 pb-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              {/* Add wrapper div for effects */}
              <div className="relative">
                {/* Enhanced pulsing glow effect */}
                <div className="absolute inset-0 blur-3xl bg-green-500/40 animate-glow-pulse" />
                
                {/* Noise overlay */}
                <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay" />
                
                {/* Main logo */}
                <div className="relative h-36 md:h-48">
                  <Image
                    src="/images/PUSSIO.png"
                    alt="PUSSIO or NOT?"
                    fill
                    className="object-contain drop-shadow-[0_0_25px_rgba(34,197,94,0.7)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Game Section */}
        <section className="relative py-10">
          <div className="max-w-4xl mx-auto px-4">
            {/* Image Frame - with enhanced blur effect */}
            <div className="relative mx-auto aspect-[3/2] bg-black/40 rounded-2xl overflow-hidden backdrop-blur-md border border-cyan-500/20">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-cyan-900/20" />
              
              {/* Image Display */}
              <div className="relative h-full">
                <ImageDisplay />
              </div>

              {/* Prize Pool */}
              <PrizePool />
            </div>

            {/* Controls */}
            <div className="mt-8 space-y-6">
              <VoteButtons wallet={wallet} />
              <VoteGauge />
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  )
}
