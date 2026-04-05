// app/community/notes/page.tsx
'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/MainLayout'
import { CommunityNoteCard } from '@/components/community/CommunityNoteCard'
import { Search, Plus, Filter } from 'lucide-react'

// Mock data
const mockNotes = [
    {
        id: '1',
        title: 'Complete Guide to Quadratic Equations',
        author: 'Sarah M.',
        subject: 'Mathematics',
        upvotes: 127,
        downloads: 234,
        status: 'APPROVED' as const,
        createdAt: '2024-03-15',
    },
    {
        id: '2',
        title: 'Photosynthesis Summary - AQA Biology',
        author: 'James H.',
        subject: 'Biology',
        upvotes: 89,
        downloads: 156,
        status: 'APPROVED' as const,
        createdAt: '2024-03-14',
    },
    {
        id: '3',
        title: 'English Literature: Themes in Romeo and Juliet',
        author: 'Emma P.',
        subject: 'English Literature',
        upvotes: 45,
        downloads: 78,
        status: 'PENDING' as const,
        createdAt: '2024-03-13',
    },
]

export default function CommunityNotesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('All')
    const [filterStatus, setFilterStatus] = useState<'All' | 'APPROVED' | 'PENDING'>('APPROVED')

    const filteredNotes = mockNotes.filter((note) => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject
        const matchesStatus = filterStatus === 'All' || note.status === filterStatus

        return matchesSearch && matchesSubject && matchesStatus
    })

    return (
        <MainLayout>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📚 Community Notes</h1>
                        <p className="text-gray-600 mt-2">
                            Free revision notes created and verified by teachers and students
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        <Plus size={20} />
                        Share Your Notes
                    </button>
                </div>
            </div>

            {/* Impact Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">500+</p>
                    <p className="text-sm text-gray-600">Notes Shared</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">45K+</p>
                    <p className="text-sm text-gray-600">Downloads</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">340</p>
                    <p className="text-sm text-gray-600">Contributors</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search notes by title or content..."
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

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option>All</option>
                            <option value="APPROVED">✅ Verified</option>
                            <option value="PENDING">⏳ Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Notes Grid */}
            {filteredNotes.length > 0 ? (
                <div className="space-y-4">
                    {filteredNotes.map((note) => (
                        <CommunityNoteCard
                            key={note.id}
                            {...note}
                            onReport={() => alert(`Reported note: ${note.id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-2">No notes found matching your search.</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters or search term.</p>
                </div>
            )}
        </MainLayout>
    )
}
