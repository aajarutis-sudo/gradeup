// app/donate/page.tsx
'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/MainLayout'
import { Heart, Users, Zap, TrendingUp, Target, DollarSign } from 'lucide-react'

export default function DonatePage() {
    const [donationType, setDonationType] = useState<'one-time' | 'monthly' | null>(null)
    const [amount, setAmount] = useState(10)

    const donationTiers = [
        { amount: 5, label: '☕ Coffee', description: 'Helps us buy coffee while coding' },
        { amount: 10, label: '📚 Book', description: 'Supports one student for a week' },
        { amount: 25, label: '🎯 Subject', description: 'Funds our AI moderation' },
        { amount: 50, label: '🚀 Platform', description: 'Supports server costs' },
    ]

    return (
        <MainLayout>
            {/* Hero Section */}
            <div className="mb-12 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200 p-8">
                <div className="max-w-2xl">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Education for Everyone</h1>
                    <p className="text-lg text-gray-700 mb-6">
                        GradeUp is a completely free, non-profit platform. We don't have ads. We don't sell your data.
                        We're run by volunteers and funded entirely by community support.
                    </p>
                    <div className="flex gap-4">
                        <Heart className="text-red-600" size={32} fill="currentColor" />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">Your donation directly funds:</p>
                            <ul className="text-sm text-gray-700 mt-2 space-y-1">
                                <li>✓ Server hosting so students can access papers anytime</li>
                                <li>✓ AI moderation to keep the community safe</li>
                                <li>✓ Accessibility improvements for all students</li>
                                <li>✓ Volunteer teacher support and training</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* One-time Donation */}
                <div
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${donationType === 'one-time'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    onClick={() => setDonationType('one-time')}
                >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">One-Time Donation</h3>
                    <p className="text-gray-600 mb-4">Support us when you can</p>
                    <div className="space-y-2">
                        {donationTiers.map((tier) => (
                            <label key={tier.amount} className="flex items-center gap-3 p-2 rounded hover:bg-gray-100">
                                <input
                                    type="radio"
                                    checked={donationType === 'one-time' && amount === tier.amount}
                                    onChange={() => {
                                        setDonationType('one-time')
                                        setAmount(tier.amount)
                                    }}
                                    className="w-4 h-4"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{tier.label}</p>
                                    <p className="text-xs text-gray-600">{tier.description}</p>
                                </div>
                                <span className="font-semibold text-gray-900">£{tier.amount}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Monthly Support */}
                <div
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-all relative ${donationType === 'monthly'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    onClick={() => setDonationType('monthly')}
                >
                    <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Monthly Support</h3>
                    <p className="text-gray-600 mb-4">Become a founding supporter</p>
                    <div className="space-y-2">
                        {donationTiers.map((tier) => (
                            <label
                                key={`monthly-${tier.amount}`}
                                className="flex items-center gap-3 p-2 rounded hover:bg-white/50"
                            >
                                <input
                                    type="radio"
                                    checked={donationType === 'monthly' && amount === tier.amount}
                                    onChange={() => {
                                        setDonationType('monthly')
                                        setAmount(tier.amount)
                                    }}
                                    className="w-4 h-4"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{tier.label}</p>
                                    <p className="text-xs text-gray-600">{tier.description}</p>
                                </div>
                                <span className="font-semibold text-gray-900">£{tier.amount}/mo</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Sponsor a Student */}
                <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50 cursor-pointer hover:border-green-300 transition-all">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Sponsor a Student</h3>
                    <p className="text-gray-600 mb-4">Help someone who can't access materials</p>
                    <div className="bg-white p-4 rounded mb-4">
                        <Users className="text-green-600 mb-3" size={24} />
                        <p className="font-semibold text-gray-900 mb-2">£50/term</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                            <li>✓ Premium notes</li>
                            <li>✓ 1-on-1 tutor sessions</li>
                            <li>✓ Study materials</li>
                            <li>✓ Your name recognized</li>
                        </ul>
                    </div>
                    <button className="w-full bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Sponsor Now
                    </button>
                </div>
            </div>

            {/* Donation Button */}
            {donationType && (
                <div className="mb-12 bg-white rounded-lg border border-gray-200 p-6 text-center">
                    <p className="text-gray-600 mb-4">
                        You're supporting: <span className="font-semibold">{donationType === 'one-time' ? 'One-time' : 'Monthly'}</span>
                        {' '} donation of <span className="font-semibold">£{amount}</span>
                    </p>
                    <button className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg">
                        <Heart size={20} fill="currentColor" />
                        Proceed to Payment
                    </button>
                </div>
            )}

            {/* Transparency Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Impact Metrics */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="text-blue-600" size={28} />
                        Our Impact This Year
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                            <span className="text-gray-700">Students Served</span>
                            <span className="text-2xl font-bold text-blue-600">47,234</span>
                        </div>
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                            <span className="text-gray-700">Hours Revised</span>
                            <span className="text-2xl font-bold text-emerald-600">156K+</span>
                        </div>
                        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                            <span className="text-gray-700">Community Notes</span>
                            <span className="text-2xl font-bold text-purple-600">523</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-700">Volunteer Teachers</span>
                            <span className="text-2xl font-bold text-pink-600">47</span>
                        </div>
                    </div>
                </div>

                {/* Spending Breakdown */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <DollarSign className="text-green-600" size={28} />
                        Where Your Money Goes
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700 font-medium">Server & Hosting</span>
                                <span className="font-semibold">45%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700 font-medium">AI Moderation</span>
                                <span className="font-semibold">25%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700 font-medium">Accessibility Features</span>
                                <span className="font-semibold">20%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700 font-medium">Teacher Incentives</span>
                                <span className="font-semibold">10%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-pink-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Is GradeUp really 100% free?</h3>
                        <p className="text-gray-600 text-sm">
                            Yes, forever. Every student can access every feature. No hidden paywalls. Donations are entirely optional and used transparently.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Do you sell my data?</h3>
                        <p className="text-gray-600 text-sm">
                            No, never. We don't have advertisers. We don't track you. Your data is yours alone. Read our full Privacy Policy for details.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Can I cancel my monthly donation?</h3>
                        <p className="text-gray-600 text-sm">
                            Yes, anytime without penalty. You can manage your subscription in your account settings.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">How do I know you're legit?</h3>
                        <p className="text-gray-600 text-sm">
                            We're a UK registered charity (#XXXXX). Full financial statements available annually on our website.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
