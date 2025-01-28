type VoteType = 'pussio' | 'not' | null

interface Vote {
  id: string
  imageUrl: string
  startTime: number
  endTime: number
  votes: {
    wallet: string
    voteType: VoteType
    timestamp: number
  }[]
}

let currentVote: Vote | null = null
let listeners: ((vote: Vote | null) => void)[] = []

// Add initial load logging
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('currentVote')
    console.log('Initial localStorage check:', saved)
    if (saved) {
      currentVote = JSON.parse(saved)
      console.log('Loaded initial vote:', currentVote)
    }
  } catch (e) {
    console.error('Error loading vote from storage:', e)
  }
}

export const voteStore = {
  setCurrentVote: (vote: Vote | null) => {
    console.log('Setting current vote:', vote)
    currentVote = vote
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('currentVote', JSON.stringify(vote))
      } catch (e) {
        console.error('Error saving vote:', e)
      }
    }
    listeners.forEach(listener => listener(vote))
  },

  getCurrentVote: () => currentVote,

  recordVote: (wallet: string, type: VoteType) => {
    console.log('Recording vote:', { wallet, type })
    if (!currentVote) {
      console.log('No current vote to record to')
      return false
    }
    
    currentVote.votes.push({
      wallet,
      voteType: type,
      timestamp: Date.now()
    })
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('currentVote', JSON.stringify(currentVote))
      } catch (e) {
        console.error('Error saving vote:', e)
      }
    }
    console.log('Updated vote state:', currentVote)
    listeners.forEach(listener => listener(currentVote))
    return true
  },

  getVoteCounts: () => {
    if (!currentVote) return { pussio: 0, not: 0 }
    return currentVote.votes.reduce((acc, vote) => {
      if (vote.voteType === 'pussio') acc.pussio++
      if (vote.voteType === 'not') acc.not++
      return acc
    }, { pussio: 0, not: 0 })
  },

  subscribe: (listener: (vote: Vote | null) => void) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }
} 