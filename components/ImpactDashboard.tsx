'use client';

import React, { useEffect, useState } from 'react';
import { Heart, Users, BookOpen, Clock, TrendingUp, Gift } from 'lucide-react';

interface ImpactMetrics {
    totalStudents: number;
    totalCommunityNotes: number;
    totalPapersAttempted: number;
    totalHoursRevised: number;
    totalVolunteers: number;
    totalDonations: number | string;
    updatedAt: string;
    stats: {
        averageHoursPerStudent: number;
        papersPerStudent: number | string;
        communityEngagement: number;
    };
}

export default function ImpactDashboard() {
    const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchImpactMetrics();
    }, []);

    const fetchImpactMetrics = async () => {
        try {
            const response = await fetch('/api/impact/metrics');
            if (!response.ok) {
                throw new Error('Failed to fetch impact metrics');
            }
            const data = await response.json();
            setMetrics(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading impact metrics...</p>
                </div>
            </div>
        );
    }

    if (error || !metrics) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error || 'Failed to load impact metrics'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-8 text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
                <div className="relative z-10">
                    <Heart className="w-10 h-10 mb-4 text-green-200" />
                    <h1 className="text-4xl font-bold mb-4">Our Collective Impact</h1>
                    <p className="text-green-50 text-lg max-w-2xl">
                        GradeUp is powered by students helping students. Every revision session, every shared note, and every achievement ripples through our community.
                    </p>
                </div>
            </div>

            {/* Main Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Students Helped */}
                <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-6 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 opacity-20 rounded-full -mr-8 -mt-8"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="w-8 h-8 text-blue-600" />
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Students Helped</span>
                        </div>
                        <div className="mb-2">
                            <p className="text-5xl font-bold text-blue-900">{metrics.totalStudents.toLocaleString()}</p>
                        </div>
                        <p className="text-sm text-blue-700">
                            Active learners using GradeUp for free, accessible GCSE revision
                        </p>
                    </div>
                </div>

                {/* Hours Revised */}
                <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200 opacity-20 rounded-full -mr-8 -mt-8"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <Clock className="w-8 h-8 text-purple-600" />
                            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Hours Revised</span>
                        </div>
                        <div className="mb-2">
                            <p className="text-5xl font-bold text-purple-900">{(metrics.totalHoursRevised / 1000).toFixed(1)}K</p>
                        </div>
                        <p className="text-sm text-purple-700">
                            {metrics.stats.averageHoursPerStudent} hours average per student guided
                        </p>
                    </div>
                </div>

                {/* Papers Completed */}
                <div className="relative bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-6 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200 opacity-20 rounded-full -mr-8 -mt-8"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <BookOpen className="w-8 h-8 text-orange-600" />
                            <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Papers Attempted</span>
                        </div>
                        <div className="mb-2">
                            <p className="text-5xl font-bold text-orange-900">{metrics.totalPapersAttempted.toLocaleString()}</p>
                        </div>
                        <p className="text-sm text-orange-700">
                            {metrics.stats.papersPerStudent} papers per student on average
                        </p>
                    </div>
                </div>

                {/* Community Impact */}
                <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-green-200 opacity-20 rounded-full -mr-8 -mt-8"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <TrendingUp className="w-8 h-8 text-green-600" />
                            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Community Notes</span>
                        </div>
                        <div className="mb-2">
                            <p className="text-5xl font-bold text-green-900">{metrics.totalCommunityNotes.toLocaleString()}</p>
                        </div>
                        <p className="text-sm text-green-700">
                            Shared resources helping others learn better
                        </p>
                    </div>
                </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Volunteers */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Teacher Volunteers</span>
                        <Users className="w-5 h-5 text-indigo-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{metrics.totalVolunteers.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Educators contributing resources</p>
                </div>

                {/* Donations */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Donations Raised</span>
                        <Gift className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">£{Number(metrics.totalDonations).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Supporting free education</p>
                </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 border border-indigo-200 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 Our Mission</h3>
                <p className="text-gray-700 max-w-3xl mb-4 leading-relaxed">
                    GradeUp believes that <strong>education shouldn't be pay-to-access</strong>. We're building a
                    non-profit platform where students have access to the tools, AI support, and community they need to thrive at
                    GCSE level—without paywalls, without ads, and without pressure.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-indigo-200">
                    <div>
                        <p className="font-semibold text-indigo-900 mb-1">📚 Open Learning</p>
                        <p className="text-sm text-gray-600">All resources are free and accessible</p>
                    </div>
                    <div>
                        <p className="font-semibold text-indigo-900 mb-1">🤝 Community First</p>
                        <p className="text-sm text-gray-600">Built by students, for students</p>
                    </div>
                    <div>
                        <p className="font-semibold text-indigo-900 mb-1">🌍 Transparent Impact</p>
                        <p className="text-sm text-gray-600">Impact metrics shared openly</p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-lg p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">You're Part of This Impact</h3>
                <p className="mb-6 text-cyan-50">
                    Every time you study, every note you share, and every student you help—you're building a better education
                    system for everyone.
                </p>
                <button className="inline-flex rounded-full bg-white text-cyan-600 px-6 py-3 font-semibold hover:bg-cyan-50 transition-colors">
                    Join Our Mission
                </button>
            </div>

            {/* Footer Note */}
            <p className="text-center text-sm text-gray-500 pt-4">
                Last updated: {new Date(metrics.updatedAt).toLocaleDateString()} at{' '}
                {new Date(metrics.updatedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                })}
            </p>
        </div>
    );
}
