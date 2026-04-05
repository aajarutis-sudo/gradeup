// app/components/ui/SubjectCard.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { Book, ChevronRight } from 'lucide-react'

interface SubjectCardProps {
    id: string
    name: string
    slug: string
    icon?: React.ReactNode
    count?: number
    color?: string
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
    id,
    name,
    slug,
    count,
    color = 'bg-blue-500',
}) => {
    const colors = [
        'bg-blue-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-amber-500',
        'bg-emerald-500',
        'bg-cyan-500',
        'bg-indigo-500',
        'bg-rose-500',
    ]

    const selectedColor = colors[Math.abs(id.charCodeAt(0)) % colors.length]

    return (
        <Link href={`/subject/${slug}`}>
            <div className="group cursor-pointer bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300">
                {/* Color Header */}
                <div className={`h-24 ${selectedColor} rounded-t-xl flex items-center justify-center`}>
                    <Book className="text-white" size={32} />
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{name}</h3>
                    {count !== undefined && (
                        <p className="text-sm text-gray-500 mt-1">{count} past papers</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-500 uppercase">Explore</span>
                        <ChevronRight
                            size={16}
                            className="text-gray-400 group-hover:text-gray-600 transition-colors"
                        />
                    </div>
                </div>
            </div>
        </Link>
    )
}
