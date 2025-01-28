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

// Load from localStorage if exists
try {
  const saved = localStorage.getItem('currentVote')
  if (saved) {
    currentVote = JSON.parse(saved)
  }
} catch (e) {
  console.error('Error loading vote from storage:', e)
}

export const voteStore = {
  setCurrentVote: (vote: Vote | null) => {
    currentVote = vote
    localStorage.setItem('currentVote', JSON.stringify(vote))
    listeners.forEach(listener => listener(vote))
  },

  getCurrentVote: () => currentVote,

  recordVote: (wallet: string, type: VoteType) => {
    if (!currentVote) return false
    
    currentVote.votes.push({
      wallet,
      voteType: type,
      timestamp: Date.now()
    })
    
    localStorage.setItem('currentVote', JSON.stringify(currentVote))
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