// app/components/community/StudyGroupCard.tsx
'use client'

import React from 'react'
import { Users, BookOpen, Target, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface StudyGroupCardProps {
    id: string
    name: string
    description?: string
    subject?: string
    memberCount: number
    maxMembers: number
    creatorName: string
    goals?: string
    isActive: boolean
    isMember?: boolean
    onJoin?: () => void
}

export const StudyGroupCard: React.FC<StudyGroupCardProps> = ({
    id,
    name,
    description,
    subject,
    memberCount,
    maxMembers,
    creatorName,
    goals,
    isActive,
    isMember,
    onJoin,
}) => {
    const isFull = memberCount >= maxMembers

    return (
        <Link href={`/study-groups/${id}`}>
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-4 cursor-pointer">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
                        {subject && <p className="text-sm text-gray-600">📚 {subject}</p>}
                        <p className="text-sm text-gray-600 mt-1">Created by {creatorName}</p>
                    </div>
                    <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${isActive
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-gray-50 text-gray-600 border border-gray-200'
                            }`}
                    >
                        {isActive ? '● Active' : '● Inactive'}
                    </div>
                </div>

                {description && <p className="text-sm text-gray-700 mb-3">{description}</p>}

                {goals && (
                    <div className="mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                        <div className="flex items-start gap-2">
                            <Target size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-900">
                                <span className="font-semibold">Goal: </span>
                                {goals}
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Users size={16} />
                            {memberCount}/{maxMembers}
                        </div>
                        {isMember && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                                Member
                            </span>
                        )}
                    </div>
                    {!isMember && onJoin && !isFull && (
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                onJoin()
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Join
                            <ChevronRight size={16} />
                        </button>
                    )}
                    {isFull && (
                        <span className="text-xs font-medium text-gray-500">Group full</span>
                    )}
                </div>
            </div>
        </Link>
    )
}
