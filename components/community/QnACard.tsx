// app/components/community/QnACard.tsx
'use client'

import React from 'react'
import { MessageCircle, ThumbsUp, AlertCircle, CheckCircle } from 'lucide-react'

interface QnACardProps {
    id: string
    question: string
    answer?: string
    subject: string
    isAnswered: boolean
    teacherVerified: boolean
    upvotes: number
    isAnonymous: boolean
    createdAt: string
    onReport?: () => void
}

export const QnACard: React.FC<QnACardProps> = ({
    id,
    question,
    answer,
    subject,
    isAnswered,
    teacherVerified,
    upvotes,
    isAnonymous,
    createdAt,
    onReport,
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-4">
            <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                    <a href={`/community/wall/${id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {question}
                    </a>
                    <p className="text-sm text-gray-600 mt-2">
                        {subject}
                        {isAnonymous && <span className="ml-2 text-gray-500">• Anonymous</span>}
                    </p>
                    {answer && (
                        <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                            <p className="text-sm text-gray-800">
                                <span className="font-semibold text-blue-600">Answer: </span>
                                {answer.substring(0, 200)}
                                {answer.length > 200 && '...'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600 pt-3 border-t border-gray-100">
                {isAnswered ? (
                    <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={16} />
                        Answered
                    </div>
                ) : (
                    <div className="flex items-center gap-1 text-amber-600">
                        <MessageCircle size={16} />
                        Looking for answers
                    </div>
                )}

                {teacherVerified && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs font-medium">
                        👨‍🏫 Teacher verified
                    </div>
                )}

                <button className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <ThumbsUp size={16} />
                    {upvotes}
                </button>

                {onReport && (
                    <button
                        onClick={onReport}
                        className="flex items-center gap-1 hover:text-red-600 transition-colors ml-auto"
                    >
                        <AlertCircle size={16} />
                    </button>
                )}
            </div>
        </div>
    )
}
