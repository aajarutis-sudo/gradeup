// app/components/community/CommunityNoteCard.tsx
'use client'

import React from 'react'
import { ThumbsUp, Download, Eye, AlertCircle } from 'lucide-react'

interface CommunityNoteCardProps {
    id: string
    title: string
    author: string
    subject: string
    upvotes: number
    downloads: number
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
    createdAt: string
    onReport?: () => void
}

export const CommunityNoteCard: React.FC<CommunityNoteCardProps> = ({
    id,
    title,
    author,
    subject,
    upvotes,
    downloads,
    status,
    createdAt,
    onReport,
}) => {
    const statusColors = {
        PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        APPROVED: 'bg-green-50 text-green-700 border-green-200',
        REJECTED: 'bg-red-50 text-red-700 border-red-200',
    }

    const statusLabels = {
        PENDING: '⏳ Pending Verification',
        APPROVED: '✅ Verified',
        REJECTED: '❌ Not Approved',
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-4">
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                    <a href={`/community/notes/${id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {title}
                    </a>
                    <p className="text-sm text-gray-600 mt-1">
                        by <span className="font-medium">{author}</span> • {subject}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {new Date(createdAt).toLocaleDateString()}
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
                    {statusLabels[status]}
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <ThumbsUp size={16} />
                    {upvotes}
                </button>
                <button className="flex items-center gap-1 hover:text-green-600 transition-colors">
                    <Download size={16} />
                    {downloads}
                </button>
                {onReport && (
                    <button
                        onClick={onReport}
                        className="flex items-center gap-1 hover:text-red-600 transition-colors ml-auto"
                    >
                        <AlertCircle size={16} />
                        Report
                    </button>
                )}
            </div>
        </div>
    )
}
