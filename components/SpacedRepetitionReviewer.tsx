'use client'

import React, { useState, useEffect } from 'react'
import { Check, X, AlertCircle, RotateCw } from 'lucide-react'

interface ReviewCard {
    id: number
    type: 'flashcard' | 'question'
    item: {
        question: string
        answer: string
    }
    topic: {
        title: string
    }
    easeFactor: number
    repetitions: number
    interval: number
}

interface ReviewStats {
    totalCards: number
    dueForReview: number
    masteredCards: number
    learningCards: number
    newCards: number
    masteryPercentage: number
}

export const SpacedRepetitionReviewer: React.FC = () => {
    const [cards, setCards] = useState<ReviewCard[]>([])
    const [stats, setStats] = useState<ReviewStats | null>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFlipped, setIsFlipped] = useState(false)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [completed, setCompleted] = useState(false)

    useEffect(() => {
        fetchDueCards()
    }, [])

    const fetchDueCards = async () => {
        try {
            const res = await fetch('/api/learning/spaced-repetition/due')
            const data = await res.json()
            if (data.success) {
                setCards(data.data.dueCards)
                setStats(data.data.stats)
            }
        } catch (error) {
            console.error('Error fetching cards:', error)
        } finally {
            setLoading(false)
        }
    }

    const submitReview = async (quality: number) => {
        if (!cards[currentIndex]) return

        setSubmitting(true)
        try {
            const res = await fetch('/api/learning/spaced-repetition/submit-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardId: cards[currentIndex].id,
                    quality,
                }),
            })

            const data = await res.json()
            if (data.success) {
                if (currentIndex < cards.length - 1) {
                    setCurrentIndex(currentIndex + 1)
                    setIsFlipped(false)
                } else {
                    setCompleted(true)
                }
            }
        } catch (error) {
            console.error('Error submitting review:', error)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <RotateCw className="animate-spin" size={48} />
            </div>
        )
    }

    if (!stats || stats.dueForReview === 0) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                    <Check className="mx-auto mb-4 text-green-600" size={48} />
                    <h2 className="text-2xl font-bold text-green-900 mb-2">
                        All caught up!
                    </h2>
                    <p className="text-green-700">
                        No cards due for review right now. Come back later!
                    </p>
                </div>
            </div>
        )
    }

    if (completed) {
        return (
            <div className="max-w-2xl mx-auto p-8 text-center">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
                    <Check className="mx-auto mb-4 text-blue-600" size={48} />
                    <h2 className="text-2xl font-bold text-blue-900 mb-2">
                        Session complete!
                    </h2>
                    <p className="text-blue-700 mb-6">
                        You reviewed {cards.length} cards. Great work!
                    </p>
                    <button
                        onClick={() => {
                            setCurrentIndex(0)
                            setCompleted(false)
                            setIsFlipped(false)
                            fetchDueCards()
                        }}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Review Again
                    </button>
                </div>
            </div>
        )
    }

    const card = cards[currentIndex]
    if (!card) return null

    return (
        <div className="max-w-2xl mx-auto p-8">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                        Card {currentIndex + 1} of {cards.length}
                    </span>
                    <span className="text-sm text-gray-600">
                        Mastery: {(stats?.masteryPercentage || 0).toFixed(0)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                            width: `${((currentIndex + 1) / cards.length) * 100}%`,
                        }}
                    />
                </div>
            </div>

            {/* Card Container */}
            <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer perspective mb-8"
            >
                <div
                    className={`relative w-full h-64 transition-transform duration-300 transform ${isFlipped ? 'rotate-y-180' : ''
                        }`}
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                >
                    {/* Front */}
                    <div
                        className={`absolute w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 flex flex-col justify-center items-center text-white ${isFlipped ? 'hidden' : ''
                            }`}
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        <div className="text-xs font-semibold text-blue-200 mb-4 uppercase">
                            {card.topic.title}
                        </div>
                        <div className="text-2xl font-bold text-center">
                            {card.item.question}
                        </div>
                        <div className="text-xs text-blue-200 mt-6">Click to reveal answer</div>
                    </div>

                    {/* Back */}
                    <div
                        className={`absolute w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-8 flex flex-col justify-center items-center text-white ${!isFlipped ? 'hidden' : ''
                            }`}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        <div className="text-xs font-semibold text-green-200 mb-4 uppercase">
                            Answer
                        </div>
                        <div className="text-xl font-bold text-center">
                            {card.item.answer}
                        </div>
                        <div className="text-xs text-green-200 mt-6">Click to flip back</div>
                    </div>
                </div>
            </div>

            {/* Quality Button Group */}
            <div className="space-y-4">
                <p className="text-center text-gray-700 font-medium">
                    How well did you remember this?
                </p>
                <div className="grid grid-cols-5 gap-2">
                    {[
                        { score: 0, label: 'Again', color: 'bg-red-500 hover:bg-red-600' },
                        { score: 1, label: 'Hard', color: 'bg-orange-500 hover:bg-orange-600' },
                        { score: 2, label: 'Okay', color: 'bg-yellow-500 hover:bg-yellow-600' },
                        { score: 3, label: 'Good', color: 'bg-green-500 hover:bg-green-600' },
                        { score: 4, label: 'Easy', color: 'bg-blue-500 hover:bg-blue-600' },
                    ].map((btn) => (
                        <button
                            key={btn.score}
                            onClick={() => submitReview(btn.score)}
                            disabled={submitting}
                            className={`${btn.color} text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
                {submitting && (
                    <div className="text-center text-sm text-gray-600">
                        <RotateCw className="inline animate-spin mr-2" size={16} />
                        Updating...
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                        {stats?.newCards || 0}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">New</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">
                        {stats?.learningCards || 0}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">Learning</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-900">
                        {stats?.masteredCards || 0}
                    </div>
                    <div className="text-xs text-green-600 mt-1">Mastered</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-900">
                        {stats?.totalCards || 0}
                    </div>
                    <div className="text-xs text-purple-600 mt-1">Total</div>
                </div>
            </div>
        </div>
    )
}
