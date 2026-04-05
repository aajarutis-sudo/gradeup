// app/components/DonationBox.tsx
'use client'

import React, { useState } from 'react'
import { Heart, Loader2, ExternalLink } from 'lucide-react'

interface DonationBoxProps {
    className?: string
}

export const DonationBox: React.FC<DonationBoxProps> = ({ className = '' }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [donationType, setDonationType] = useState<'one-time' | 'monthly' | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleDonate = async () => {
        if (!donationType) return
        setIsLoading(true)

        try {
            // In a real app, this would redirect to Stripe or your payment processor
            // const response = await fetch('/api/donations/create-session', {
            //   method: 'POST',
            //   body: JSON.stringify({ type: donationType }),
            // })
            // const { sessionUrl } = await response.json()
            // window.location.href = sessionUrl

            alert(
                `Redirecting to ${donationType === 'one-time' ? 'one-time' : 'monthly recurring'} donation page...`
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-red-200 p-6 ${className}`}>
            <div className="flex items-center gap-2 mb-4">
                <Heart className="text-red-600" size={24} fill="currentColor" />
                <h3 className="font-bold text-lg text-gray-900">Support GradeUp</h3>
            </div>

            <p className="text-gray-700 mb-4">
                GradeUp is entirely free and run by volunteers. Your donation helps us keep the
                platform running and improve accessibility for all students.
            </p>

            <div className="space-y-2 mb-6">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <input
                        type="radio"
                        checked={donationType === 'one-time'}
                        onChange={() => setDonationType('one-time')}
                        className="w-4 h-4"
                    />
                    <div>
                        <p className="font-medium text-gray-900">One-time donation</p>
                        <p className="text-xs text-gray-600">Give once, when you can</p>
                    </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/50 transition-colors">
                    <input
                        type="radio"
                        checked={donationType === 'monthly'}
                        onChange={() => setDonationType('monthly')}
                        className="w-4 h-4"
                    />
                    <div>
                        <p className="font-medium text-gray-900">Monthly supporter</p>
                        <p className="text-xs text-gray-600">Help us plan ahead with regular support</p>
                    </div>
                </label>
            </div>

            <button
                onClick={handleDonate}
                disabled={!donationType || isLoading}
                className="w-full bg-red-600 text-white font-medium py-2 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        <Heart size={18} />
                        Donate Now
                    </>
                )}
            </button>

            <a
                href="/donate"
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
                View transparency report
                <ExternalLink size={16} />
            </a>
        </div>
    )
}
