// app/community/wall/page.tsx
'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/MainLayout'
import { QnACard } from '@/components/community/QnACard'
import { Search, Plus, Lightbulb } from 'lucide-react'

// Mock data
const mockQnAs = [
    {
        id: '1',
        question: "How do I balance chemical equations? I don't understand the step-by-step process.",
        answer:
            'Start by listing all atoms on both sides, then balance one element at a time using coefficients. It helps to begin with the most complex molecule.',
        subject: 'Chemistry',
        isAnswered: true,
        teacherVerified: true,
        upvotes: 45,
        isAnonymous: true,
        createdAt: '2024-03-15',
    },
    {
        id: '2',
        question: 'What is the difference between a theme and a motif in literature?',
        answer:
            'A theme is the central idea explored throughout a text, while a motif is a recurring element, image, or phrase that reinforces the theme.',
        subject: 'English Literature',
        isAnswered: true,
        teacherVerified: false,
        upvotes: 28,
        isAnonymous: false,
        createdAt: '2024-03-14',
    },
    {
        id: '3',
        question: 'Can someone explain how photosynthesis works? I really struggled with this topic.',
        answer: undefined,
        subject: 'Biology',
        isAnswered: false,
        teacherVerified: false,
        upvotes: 12,
        isAnonymous: true,
        createdAt: '2024-03-13',
    },
]

export default function CommunityWallPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('All')
    const [showUnansweredOnly, setShowUnansweredOnly] = useState(false)

    const filteredQnAs = mockQnAs.filter((qa) => {
        const matchesSearch =
            qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (qa.answer?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
        const matchesSubject = selectedSubject === 'All' || qa.subject === selectedSubject
        const matchesAnswered = !showUnansweredOnly || !qa.isAnswered

        return matchesSearch && matchesSubject && matchesAnswered
    })

    return (
        <MainLayout>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">💬 Student Q&A Wall</h1>
                        <p className="text-gray-600 mt-2">
                            Ask questions anonymously. Teachers and peers help instantly. No judgment, just learning.
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        <Plus size={20} />
                        Ask a Question
                    </button>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                <Lightbulb className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                    <p className="font-medium text-blue-900">100% Anonymous & Safe</p>
                    <p className="text-sm text-blue-800 mt-1">
                        Post questions anonymously. All questions are moderated by AI and teachers to ensure they're
                        respectful and helpful.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">1.2K</p>
                    <p className="text-sm text-gray-600">Questions This Week</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">94%</p>
                    <p className="text-sm text-gray-600">Answer Rate</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">15 min</p>
                    <p className="text-sm text-gray-600">Avg Response</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All</option>
                            <option>Mathematics</option>
                            <option>English Language</option>
                            <option>English Literature</option>
                            <option>Biology</option>
                            <option>Chemistry</option>
                            <option>Physics</option>
                        </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showUnansweredOnly}
                            onChange={(e) => setShowUnansweredOnly(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">Unanswered Only</span>
                    </label>
                </div>
            </div>

            {/* Q&A List */}
            {filteredQnAs.length > 0 ? (
                <div className="space-y-4">
                    {filteredQnAs.map((qa) => (
                        <QnACard
                            key={qa.id}
                            {...qa}
                            onReport={() => alert(`Reported Q&A: ${qa.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-2">No questions found matching your search.</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters or search term.</p>
                </div>
            )}
        </MainLayout>
    )
}
