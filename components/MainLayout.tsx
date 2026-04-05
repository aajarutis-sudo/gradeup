// app/components/MainLayout.tsx
'use client'

import React from 'react'
import { Sidebar } from './Sidebar'

interface MainLayoutProps {
    children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 lg:ml-64">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
