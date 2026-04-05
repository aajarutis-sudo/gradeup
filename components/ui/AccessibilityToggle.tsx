// app/components/ui/AccessibilityToggle.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Volume2, Eye, Type, Settings } from 'lucide-react'

interface AccessibilitySettings {
    dyslexiaFriendly: boolean
    highContrast: boolean
    simplifiedEnglish: boolean
    audioEnabled: boolean
}

export const AccessibilityToggle: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [settings, setSettings] = useState<AccessibilitySettings>(() => {
        if (typeof window === 'undefined') {
            return {
                dyslexiaFriendly: false,
                highContrast: false,
                simplifiedEnglish: false,
                audioEnabled: false,
            }
        }

        const stored = localStorage.getItem('a11y-settings')
        return stored
            ? JSON.parse(stored)
            : {
                dyslexiaFriendly: false,
                highContrast: false,
                simplifiedEnglish: false,
                audioEnabled: false,
            }
    })

    // Apply settings to DOM
    useEffect(() => {
        const root = document.documentElement

        if (settings.dyslexiaFriendly) {
            root.classList.add('dyslexia-friendly')
        } else {
            root.classList.remove('dyslexia-friendly')
        }

        if (settings.highContrast) {
            root.classList.add('high-contrast')
        } else {
            root.classList.remove('high-contrast')
        }

        if (settings.simplifiedEnglish) {
            root.classList.add('simplified-english')
        } else {
            root.classList.remove('simplified-english')
        }

        localStorage.setItem('a11y-settings', JSON.stringify(settings))
    }, [settings])

    const toggleSetting = (key: keyof AccessibilitySettings) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }))
    }

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                aria-label="Accessibility settings"
                aria-expanded={isOpen}
            >
                <Settings size={20} className="text-gray-600" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                    <h3 className="font-semibold text-gray-900 mb-4">Accessibility Settings</h3>

                    {/* Dyslexia-Friendly Toggle */}
                    <div className="mb-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.dyslexiaFriendly}
                                onChange={() => toggleSetting('dyslexiaFriendly')}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600"
                                aria-label="Dyslexia-friendly mode"
                            />
                            <div className="flex-1">
                                <span className="block text-sm font-medium text-gray-900">
                                    Dyslexia-Friendly
                                </span>
                                <span className="text-xs text-gray-500">
                                    OpenDyslexic font, increased spacing
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* High Contrast Toggle */}
                    <div className="mb-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.highContrast}
                                onChange={() => toggleSetting('highContrast')}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600"
                                aria-label="High contrast mode"
                            />
                            <div className="flex-1">
                                <span className="block text-sm font-medium text-gray-900">High Contrast</span>
                                <span className="text-xs text-gray-500">Enhanced colors & borders</span>
                            </div>
                        </label>
                    </div>

                    {/* Simplified English Toggle */}
                    <div className="mb-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.simplifiedEnglish}
                                onChange={() => toggleSetting('simplifiedEnglish')}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600"
                                aria-label="Simplified English"
                            />
                            <div className="flex-1">
                                <span className="block text-sm font-medium text-gray-900">
                                    Simplified English
                                </span>
                                <span className="text-xs text-gray-500">Plain language, shorter text</span>
                            </div>
                        </label>
                    </div>

                    {/* Audio Toggle */}
                    <div className="mb-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.audioEnabled}
                                onChange={() => toggleSetting('audioEnabled')}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600"
                                aria-label="Enable audio"
                            />
                            <div className="flex-1">
                                <span className="block text-sm font-medium text-gray-900">Audio Support</span>
                                <span className="text-xs text-gray-500">Text-to-speech enabled</span>
                            </div>
                        </label>
                    </div>

                    {/* Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                            These settings are saved to your device and applied across GradeUp.
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
