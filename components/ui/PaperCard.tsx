// app/components/ui/PaperCard.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { FileText, Download, Eye, BookOpen } from 'lucide-react'

interface PaperCardProps {
    id: string
    year: number
    paperNumber: number
    tier?: string
    subjectName: string
    examBoard: string
    pdfUrl?: string
}

export const PaperCard: React.FC<PaperCardProps> = ({
    id,
    year,
    paperNumber,
    tier,
    subjectName,
    examBoard,
    pdfUrl,
}) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <FileText size={20} className="text-blue-500" />
                        <h3 className="font-semibold text-gray-900">{subjectName}</h3>
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                        {examBoard} • {year} • Paper {paperNumber}
                        {tier && <span className="ml-2">({tier})</span>}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                        {pdfUrl ? (
                            <>
                                <Link
                                    href={`/papers/${id}`}
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Eye size={16} />
                                    View
                                </Link>
                                <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Download size={16} />
                                    Download
                                </a>
                                <Link
                                    href={`/papers/${id}/attempt`}
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <BookOpen size={16} />
                                    Practice
                                </Link>
                            </>
                        ) : (
                            <span className="text-sm text-gray-400 italic">Paper not yet uploaded</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
