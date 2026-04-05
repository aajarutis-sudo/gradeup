// app/admin/upload-paper/page.tsx
'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/MainLayout'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react'

const EXAM_BOARDS = ['AQA', 'Edexcel', 'OCR', 'WJEC', 'CCEA']
const TIERS = ['Foundation', 'Higher', 'None']
const SUBJECTS = [
    'Mathematics',
    'English Language',
    'English Literature',
    'Biology',
    'Chemistry',
    'Physics',
    'Geography',
    'History',
    'Computer Science',
]

export default function UploadPaperPage() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [formData, setFormData] = useState({
        examBoard: '',
        subject: '',
        year: new Date().getFullYear(),
        paperNumber: 1,
        tier: 'None',
        paperFile: null as File | null,
        markSchemeFile: null as File | null,
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'year' || name === 'paperNumber' ? parseInt(value) : value,
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'paperFile' | 'markSchemeFile') => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData((prev) => ({
                ...prev,
                [fileType]: file,
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const data = new FormData()
            data.append('examBoard', formData.examBoard)
            data.append('subject', formData.subject)
            data.append('year', formData.year.toString())
            data.append('paperNumber', formData.paperNumber.toString())
            data.append('tier', formData.tier)
            if (formData.paperFile) {
                data.append('paperFile', formData.paperFile)
            }
            if (formData.markSchemeFile) {
                data.append('markSchemeFile', formData.markSchemeFile)
            }

            const response = await fetch('/api/admin/upload-paper', {
                method: 'POST',
                body: data,
            })

            const result = await response.json()

            if (result.success) {
                setMessage({ type: 'success', text: 'Paper uploaded successfully!' })
                setFormData({
                    examBoard: '',
                    subject: '',
                    year: new Date().getFullYear(),
                    paperNumber: 1,
                    tier: 'None',
                    paperFile: null,
                    markSchemeFile: null,
                })
            } else {
                setMessage({ type: 'error', text: result.error || 'Upload failed' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred during upload' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Upload Past Paper</h1>
                    <p className="text-gray-600 mt-2">Add exam papers and mark schemes to the platform</p>
                </div>

                {/* Messages */}
                {message && (
                    <div
                        className={`p-4 rounded-lg mb-6 flex items-center gap-3 border ${message.type === 'success'
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                    >
                        {message.type === 'success' ? (
                            <CheckCircle size={20} />
                        ) : (
                            <AlertCircle size={20} />
                        )}
                        {message.text}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
                    {/* Exam Board */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Exam Board *
                        </label>
                        <select
                            name="examBoard"
                            value={formData.examBoard}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select exam board</option>
                            {EXAM_BOARDS.map((board) => (
                                <option key={board} value={board}>
                                    {board}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Subject */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject *
                        </label>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select subject</option>
                            {SUBJECTS.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Year, Paper Number, Tier */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Year *
                            </label>
                            <input
                                type="number"
                                name="year"
                                value={formData.year}
                                onChange={handleInputChange}
                                min="2010"
                                max={new Date().getFullYear()}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Paper Number *
                            </label>
                            <input
                                type="number"
                                name="paperNumber"
                                value={formData.paperNumber}
                                onChange={handleInputChange}
                                min="1"
                                max="3"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tier
                            </label>
                            <select
                                name="tier"
                                value={formData.tier}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {TIERS.map((tier) => (
                                    <option key={tier} value={tier}>
                                        {tier}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Paper PDF Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Paper PDF *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleFileChange(e, 'paperFile')}
                                required
                                className="hidden"
                                id="paperFile"
                            />
                            <label htmlFor="paperFile" className="cursor-pointer">
                                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                                <p className="text-sm font-medium text-gray-700">
                                    {formData.paperFile ? formData.paperFile.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-500">PDF only, up to 50MB</p>
                            </label>
                        </div>
                    </div>

                    {/* Mark Scheme PDF Upload */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mark Scheme PDF
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleFileChange(e, 'markSchemeFile')}
                                className="hidden"
                                id="markSchemeFile"
                            />
                            <label htmlFor="markSchemeFile" className="cursor-pointer">
                                <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                                <p className="text-sm font-medium text-gray-700">
                                    {formData.markSchemeFile ? formData.markSchemeFile.name : 'Click to upload or drag and drop'}
                                </p>
                                <p className="text-xs text-gray-500">PDF only, up to 50MB</p>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Uploading...' : 'Upload Paper'}
                    </button>
                </form>

                {/* Info Box */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">📋 Upload Guidelines</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>✓ PDFs must be clear and readable</li>
                        <li>✓ Use exam board official papers when possible</li>
                        <li>✓ Mark schemes should include point allocations</li>
                        <li>✓ Double-check year, paper number, and tier</li>
                        <li>✓ Papers will be reviewed before publishing</li>
                    </ul>
                </div>
            </div>
        </MainLayout>
    )
}
