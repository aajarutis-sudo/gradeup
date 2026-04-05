'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight } from 'lucide-react';
import {
    fuzzySearch,
    sortSearchResults,
    groupByCategory,
    getCategoryIcon,
    DEFAULT_COMMANDS,
    SearchItem,
} from '@/lib/commandPalette';

export interface CommandPaletteProps {
    additionalItems?: SearchItem[];
    onSelect?: (item: SearchItem) => void;
}

export default function CommandPalette({ additionalItems = [], onSelect }: CommandPaletteProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentlyUsed, setRecentlyUsed] = useState<string[]>(() => {
        if (typeof window === 'undefined') {
            return [];
        }

        try {
            const stored = localStorage.getItem('commandPaletteRecent');
            return stored ? (JSON.parse(stored) as string[]) : [];
        } catch {
            return [];
        }
    });
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    // Calculate search results
    const allItems = [...DEFAULT_COMMANDS, ...additionalItems];
    const results = allItems
        .map((item) => ({
            ...item,
            score: fuzzySearch(query, item),
        }))
        .filter((item) => item.score > 0 || !query)
        .sort((a, b) => {
            if (!query) {
                const aRecent = recentlyUsed.includes(a.id);
                const bRecent = recentlyUsed.includes(b.id);
                if (aRecent !== bRecent) return aRecent ? -1 : 1;
            }
            return sortSearchResults([a, b], recentlyUsed)[0] === a ? -1 : 1;
        })
        .slice(0, 10);

    const selectItem = (item: SearchItem) => {
        const updated = [item.id, ...recentlyUsed.filter((id) => id !== item.id)].slice(0, 5);
        setRecentlyUsed(updated);
        localStorage.setItem('commandPaletteRecent', JSON.stringify(updated));

        if (item.route) {
            router.push(item.route);
        }

        if (onSelect) {
            onSelect(item);
        }

        setIsOpen(false);
        setQuery('');
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+K or Cmd+K
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(!isOpen);
                setQuery('');
                setSelectedIndex(0);
            }
            // Forward slash (/) at start
            else if (e.key === '/' && !isOpen) {
                setIsOpen(true);
            }
            // Escape to close
            else if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
            // Arrow down
            else if (e.key === 'ArrowDown' && isOpen) {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
            }
            // Arrow up
            else if (e.key === 'ArrowUp' && isOpen) {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + (results.length || 1)) % (results.length || 1));
            }
            // Enter to select
            else if (e.key === 'Enter' && isOpen && results.length > 0) {
                e.preventDefault();
                selectItem(results[selectedIndex]);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, query, selectedIndex, recentlyUsed]);

    // Focus input when opening
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [isOpen]);

    const grouped = groupByCategory(results);
    const categoryOrder = ['Topic', 'Paper', 'Flashcard', 'Note', 'Community', 'Tool', 'Setting'];

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm transition-colors"
            >
                <Search className="w-4 h-4" />
                <span className="hidden md:inline">Search...</span>
                <kbd className="hidden sm:inline-block ml-auto px-2 py-1 text-xs font-semibold text-gray-600 bg-white border border-gray-300 rounded">
                    ⌘K
                </kbd>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity"
                    onClick={() => setIsOpen(false)}
                >
                    {/* Command Palette */}
                    <div
                        className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-white rounded-lg shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Input */}
                        <div className="border-b border-gray-200 p-4 bg-gray-50">
                            <div className="flex items-center gap-2">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Type / to search topics, papers, tools..."
                                    className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                                    value={query}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                />
                                {query && (
                                    <button
                                        onClick={() => {
                                            setQuery('');
                                            setSelectedIndex(0);
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-96 overflow-y-auto">
                            {results.length === 0 && query ? (
                                <div className="p-8 text-center text-gray-500">
                                    <p>No results found for &quot;{query}&quot;</p>
                                </div>
                            ) : results.length === 0 ? (
                                <div className="p-8">
                                    <p className="text-sm text-gray-600 mb-4">Recent</p>
                                    {recentlyUsed.length === 0 ? (
                                        <p className="text-sm text-gray-500 text-center py-4">
                                            No recent items. Use the palette to search!
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {recentlyUsed
                                                .map((id) => allItems.find((item) => item.id === id))
                                                .filter(Boolean)
                                                .slice(0, 5)
                                                .map((item, index) => (
                                                    <ResultItem
                                                        key={item!.id}
                                                        item={item!}
                                                        isSelected={index === selectedIndex}
                                                        onClick={() => selectItem(item!)}
                                                    />
                                                ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-4">
                                    {categoryOrder.map((category) => {
                                        if (!grouped[category]) return null;
                                        return (
                                            <div key={category} className="mb-4">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                                    {getCategoryIcon(category)} {category}
                                                </p>
                                                <div className="space-y-2">
                                                    {grouped[category].map((item) => (
                                                        <ResultItem
                                                            key={item.id}
                                                            item={item}
                                                            isSelected={selectedIndex === results.indexOf(item)}
                                                            onClick={() => selectItem(item)}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer Help */}
                        {results.length > 0 && (
                            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-700">
                                            ↑↓
                                        </kbd>
                                        Navigate
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-700">
                                            ⏎
                                        </kbd>
                                        Select
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-700">
                                            ESC
                                        </kbd>
                                        Close
                                    </span>
                                </div>
                                <span className="text-gray-400">{results.length} results</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

interface ResultItemProps {
    item: SearchItem & { score?: number };
    isSelected: boolean;
    onClick: () => void;
}

function ResultItem({ item, isSelected, onClick }: ResultItemProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center justify-between group ${isSelected
                    ? 'bg-indigo-50 text-indigo-900'
                    : 'hover:bg-gray-100 text-gray-900'
                }`}
        >
            <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl flex-shrink-0">{item.icon || '📌'}</span>
                <div className="min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    {item.description && (
                        <p className="text-sm text-gray-500 truncate">{item.description}</p>
                    )}
                </div>
            </div>
            <ChevronRight
                className={`w-4 h-4 flex-shrink-0 transition-opacity ${isSelected ? 'opacity-100 text-indigo-600' : 'opacity-0 group-hover:opacity-100'
                    }`}
            />
        </button>
    );
}
