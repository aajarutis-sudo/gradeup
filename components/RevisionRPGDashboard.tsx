'use client';

import React, { useEffect, useState } from 'react';
import { Zap, Award, Flame, Coins, Gem, TrendingUp } from 'lucide-react';

interface RPGProfile {
    level: number;
    totalXP: number;
    currentXP: number;
    xpForNextLevel: number;
    levelProgressPercentage: number;
    coins: number;
    gems: number;
    avatarClass: string;
    equippedWeapon?: string;
    equippedArmor?: string;
    currentStreak: number;
    longestStreak: number;
    streakMaintained: boolean;
}

interface Badge {
    badgeName: string;
    badgeIcon: string;
    description: string;
    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    unlockedAt: Date;
}

export default function RevisionRPGDashboard() {
    const [profile, setProfile] = useState<RPGProfile | null>(null);
    const [badges, setBadges] = useState<Badge[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRPGProfile();
    }, []);

    const fetchRPGProfile = async () => {
        try {
            const response = await fetch('/api/rpg/profile');
            if (!response.ok) {
                throw new Error('Failed to fetch RPG profile');
            }
            const data = await response.json();
            setProfile(data.profile);
            setBadges(data.badges);
            setStats(data.stats);
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
                    <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading RPG Profile...</p>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error || 'Failed to load RPG profile'}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Avatar */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Level {profile.level}</h1>
                        <p className="text-purple-100">{profile.avatarClass} • Total XP: {profile.totalXP.toLocaleString()}</p>
                    </div>
                    <div className="text-6xl">🎮</div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* XP Progress */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">XP Progress</span>
                        <Zap className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                        {profile.currentXP.toLocaleString()}
                        <span className="text-sm text-gray-500">/{profile.xpForNextLevel.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${profile.levelProgressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{profile.levelProgressPercentage.toFixed(1)}% to next level</p>
                </div>

                {/* Coins */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Coins</span>
                        <Coins className="w-4 h-4 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{profile.coins.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Study rewards</p>
                </div>

                {/* Gems */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Gems</span>
                        <Gem className="w-4 h-4 text-pink-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{profile.gems.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Premium currency</p>
                </div>

                {/* Current Streak */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Streak</span>
                        <Flame className="w-4 h-4 text-red-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{profile.currentStreak} 🔥</p>
                    <p className="text-xs text-gray-500 mt-1">Keep studying!</p>
                </div>
            </div>

            {/* Streak & Achievement Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Streak */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                        <Flame className="w-5 h-5 text-red-500 mr-2" />
                        <h3 className="font-semibold text-gray-900">Current Streak</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-600 mb-1">{profile.currentStreak} days</p>
                    <p className="text-sm text-gray-600">
                        {profile.streakMaintained
                            ? 'Keep up the momentum! 💪'
                            : 'Start your next streak today!'}
                    </p>
                </div>

                {/* Longest Streak */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                        <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
                        <h3 className="font-semibold text-gray-900">Longest Streak</h3>
                    </div>
                    <p className="text-3xl font-bold text-orange-600 mb-1">{profile.longestStreak} days</p>
                    <p className="text-sm text-gray-600">Your personal best 🏆</p>
                </div>

                {/* Badges */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                        <Award className="w-5 h-5 text-purple-500 mr-2" />
                        <h3 className="font-semibold text-gray-900">Achievements</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-600 mb-1">{stats?.totalBadges || 0} Badges</p>
                    <div className="text-sm text-gray-600">
                        {stats?.epicCount || 0} Epic • {stats?.legendaryCount || 0} Legendary
                    </div>
                </div>
            </div>

            {/* Avatar Information */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Character</h3>
                <div className="flex items-center space-x-4">
                    <div className="text-5xl">🧙</div>
                    <div>
                        <p className="text-lg font-semibold text-gray-900">{profile.avatarClass}</p>
                        <p className="text-sm text-gray-600 mb-2">
                            {profile.avatarClass === 'Scholar' && 'Balanced learner. +10% XP gain'}
                            {profile.avatarClass === 'Mage' && 'Intellectual focus. +15% AI feature usage'}
                            {profile.avatarClass === 'Warrior' && 'Discipline master. +20% streak bonus'}
                            {profile.avatarClass === 'Explorer' && 'Curious learner. +25% topic unlock speed'}
                            {profile.avatarClass === 'Guardian' && 'Community helper. +30% help effect'}
                        </p>
                        {profile.equippedWeapon && (
                            <p className="text-xs text-indigo-600">
                                ⚔️ Weapon: {profile.equippedWeapon}
                            </p>
                        )}
                        {profile.equippedArmor && (
                            <p className="text-xs text-indigo-600">
                                🛡️ Armor: {profile.equippedArmor}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Badges Display */}
            {badges.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Unlocked Badges</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {badges.slice(0, 8).map((badge, index) => (
                            <div
                                key={index}
                                className={`relative group p-3 rounded-lg text-center transition-transform hover:scale-105 ${badge.rarity === 'LEGENDARY'
                                        ? 'bg-yellow-50 border-2 border-yellow-400'
                                        : badge.rarity === 'EPIC'
                                            ? 'bg-purple-50 border-2 border-purple-400'
                                            : badge.rarity === 'RARE'
                                                ? 'bg-blue-50 border-2 border-blue-400'
                                                : 'bg-gray-50 border-2 border-gray-300'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{badge.badgeIcon}</div>
                                <p className="text-xs font-semibold text-gray-700">{badge.badgeName}</p>
                                <p className="text-xs text-gray-500">{badge.rarity}</p>
                                {/* Tooltip on hover */}
                                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                    {badge.description}
                                </div>
                            </div>
                        ))}
                    </div>
                    {badges.length > 8 && (
                        <p className="text-sm text-gray-600 mt-3 text-center">
                            +{badges.length - 8} more badges
                        </p>
                    )}
                </div>
            )}

            {/* Empty State */}
            {badges.length === 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                    <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-gray-700 font-medium">No Badges Yet</p>
                    <p className="text-sm text-gray-600">
                        Complete quizzes, maintain streaks, and master topics to unlock badges!
                    </p>
                </div>
            )}

            {/* Footer Tips */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">💡 RPG Tips</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Maintain your streak for bonus XP multipliers</li>
                    <li>• Complete flashcard reviews to earn coins faster</li>
                    <li>• Reach 30-day streaks to unlock legendary badges</li>
                    <li>• Use gems to unlock premium avatar skins</li>
                </ul>
            </div>
        </div>
    );
}
