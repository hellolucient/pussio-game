import { useState, useEffect } from 'react'
import { db, storage } from '@/lib/firebase'
import { 
  collection, 
  addDoc, 
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export function useVoteManagement() {
  const [currentVote, setCurrentVote] = useState<Vote | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Listen to current vote
  useEffect(() => {
    const q = query(
      collection(db, 'votes'),
      where('endTime', '>', Date.now()),
      orderBy('endTime', 'desc'),
      limit(1)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setCurrentVote({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Vote)
      } else {
        setCurrentVote(null)
      }
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const createVote = async (image: File, durationMinutes: number, requiredTokens: number) => {
    try {
      // Upload image
      const imageRef = ref(storage, `votes/${Date.now()}_${image.name}`)
      await uploadBytes(imageRef, image)
      const imageUrl = await getDownloadURL(imageRef)

      // Create vote document
      const vote = {
        imageUrl,
        startTime: Date.now(),
        endTime: Date.now() + (durationMinutes * 60 * 1000),
        requiredTokens,
        votes: []
      }

      await addDoc(collection(db, 'votes'), vote)
      return true
    } catch (error) {
      console.error('Error creating vote:', error)
      return false
    }
  }

  const recordVote = async (voteId: string, wallet: string, voteType: 'pussio' | 'not') => {
    try {
      const vote = {
        wallet,
        voteType,
        timestamp: Date.now()
      }

      await updateDoc(doc(db, 'votes', voteId), {
        votes: arrayUnion(vote)
      })

      return true
    } catch (error) {
      console.error('Error recording vote:', error)
      return false
    }
  }

  return {
    currentVote,
    isLoading,
    createVote,
    recordVote
  }
} 