// app/components/Sidebar.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Sparkles,
    MessageSquare,
    Users,
    Lightbulb,
    Settings,
    Heart,
    Menu,
    X,
    ChevronDown
} from 'lucide-react'

export const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const pathname = usePathname()

    const isActive = (href: string) => pathname.startsWith(href)

    const menuItems = [
        { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { href: '/subjects', icon: BookOpen, label: 'Subjects' },
        { href: '/papers', icon: FileText, label: 'Past Papers' },
        { href: '/flashcards', icon: Sparkles, label: 'Flashcards' },
        { href: '/chatbot', icon: MessageSquare, label: 'AI Tutor' },
        { href: '/community', icon: Users, label: 'Community Wall' },
        { href: '/study-groups', icon: Users, label: 'Study Groups' },
        { href: '/notes', icon: Lightbulb, label: 'Notes' },
    ]

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Overlay Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 ${isCollapsed ? 'w-20' : 'w-64'
                    } ${!isOpen ? '-translate-x-full lg:translate-x-0' : ''}`}
            >
                {/* Logo Section */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="text-white" size={20} />
                            </div>
                            <h1 className="font-bold text-lg text-gray-900">GradeUp</h1>
                        </div>
                    )}
                    {isCollapsed && (
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
                            <Sparkles className="text-white" size={20} />
                        </div>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 px-3 py-6 overflow-y-auto">
                    <ul className="space-y-2">
                        {menuItems.map(({ href, icon: Icon, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive(href)
                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Icon size={20} className="flex-shrink-0" />
                                    {!isCollapsed && <span>{label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Donate & Settings Section */}
                <div className="border-t border-gray-200 p-3 space-y-2">
                    <Link
                        href="/donate"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <Heart size={20} className="flex-shrink-0" />
                        {!isCollapsed && <span>Donate</span>}
                    </Link>
                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsOpen(false)}
                    >
                        <Settings size={20} className="flex-shrink-0" />
                        {!isCollapsed && <span>Settings</span>}
                    </Link>
                </div>

                {/* Collapse Button */}
                <div className="border-t border-gray-200 p-3">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <ChevronDown
                            size={20}
                            className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
            </aside>

            {/* Main Content Margin */}
            <div className={`${!isCollapsed ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`} />
        </>
    )
}
