// app/study-groups/page.tsx
'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/MainLayout'
import { StudyGroupCard } from '@/components/community/StudyGroupCard'
import { Search, Plus } from 'lucide-react'

// Mock data
const mockGroups = [
    {
        id: '1',
        name: 'May Revision Challenge 2024',
        description: 'Intensive 4-week revision for all subjects before May exams',
        subject: 'All',
        memberCount: 234,
        maxMembers: 500,
        creatorName: 'Ms. Thompson (Teacher)',
        goals: 'Complete daily revision targets, track progress together',
        isActive: true,
        isMember: true,
    },
    {
        id: '2',
        name: 'Maths Problem Solvers',
        description: 'Daily practice on past paper questions with explanations',
        subject: 'Mathematics',
        memberCount: 67,
        maxMembers: 100,
        creatorName: 'Alex K.',
        goals: 'Solve 5 past paper questions daily, review together',
        isActive: true,
        isMember: false,
    },
    {
        id: '3',
        name: 'English Lit Essay Workshop',
        description: 'Work on essay structure and techniques together',
        subject: 'English Literature',
        memberCount: 45,
        maxMembers: 50,
        creatorName: 'Emma R.',
        goals: 'Write and peer-review essays weekly',
        isActive: true,
        isMember: false,
    },
    {
        id: '4',
        name: 'Science Revision Group',
        description: 'Combined Biology, Chemistry, Physics revision',
        subject: 'Science',
        memberCount: 89,
        maxMembers: 150,
        creatorName: 'Dr. Patel',
        goals: 'Cover all three sciences systematically',
        isActive: true,
        isMember: false,
    },
]

export default function StudyGroupsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('All')
    const [showMemberGroupsOnly, setShowMemberGroupsOnly] = useState(false)

    const filteredGroups = mockGroups.filter((group) => {
        const matchesSearch =
            group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSubject = selectedSubject === 'All' || group.subject === selectedSubject
        const matchesMember = !showMemberGroupsOnly || group.isMember

        return matchesSearch && matchesSubject && matchesMember
    })

    return (
        <MainLayout>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">👥 Study Groups</h1>
                        <p className="text-gray-600 mt-2">
                            Join a group, set goals together, and support each other's learning journey
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        <Plus size={20} />
                        Create Group
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">42</p>
                    <p className="text-sm text-gray-600">Active Groups</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">3.2K</p>
                    <p className="text-sm text-gray-600">Members Total</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">89%</p>
                    <p className="text-sm text-gray-600">Complete Goals</p>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 space-y-4">
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search groups..."
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
                            <option>Science</option>
                            <option>Geography</option>
                            <option>History</option>
                        </select>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showMemberGroupsOnly}
                            onChange={(e) => setShowMemberGroupsOnly(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">My Groups Only</span>
                    </label>
                </div>
            </div>

            {/* Groups Grid */}
            {filteredGroups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGroups.map((group) => (
                        <StudyGroupCard
                            key={group.id}
                            {...group}
                            onJoin={() => alert(`Joined group: ${group.name}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-2">No groups found matching your search.</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters or search term.</p>
                </div>
            )}
        </MainLayout>
    )
}
