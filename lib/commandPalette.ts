// Fuzzy search algorithm for command palette
export interface SearchItem {
    id: string;
    title: string;
    category: 'Topic' | 'Paper' | 'Flashcard' | 'Note' | 'Community' | 'Tool' | 'Setting';
    description?: string;
    route?: string;
    icon?: string;
    keywords?: string[];
}

/**
 * Simple fuzzy search algorithm
 * Calculates match score between search query and item
 */
export function fuzzySearch(query: string, item: SearchItem): number {
    const searchText = (query || '').toLowerCase();
    if (!searchText) return 0;

    const titleScore = calculateMatchScore(searchText, item.title.toLowerCase());
    const descriptionScore = item.description
        ? calculateMatchScore(searchText, item.description.toLowerCase()) * 0.5
        : 0;
    const keywordScore =
        item.keywords
            ?.reduce((max, keyword) => Math.max(max, calculateMatchScore(searchText, keyword.toLowerCase())), 0)
            .valueOf() || 0 * 0.7;

    return Math.max(titleScore, descriptionScore, keywordScore);
}

/**
 * Calculate match score for a single field
 * Prioritizes:
 * 1. Exact matches
 * 2. Prefix matches
 * 3. Substring matches with position weight
 */
function calculateMatchScore(query: string, text: string): number {
    // Exact match
    if (query === text) return 100;

    // Prefix match
    if (text.startsWith(query)) {
        return 80 + (1 - query.length / text.length) * 10;
    }

    // Substring match with position boost
    const index = text.indexOf(query);
    if (index !== -1) {
        // Earlier position = higher score
        const positionBonus = Math.max(0, 40 - index * 2);
        const lengthFactor = query.length / text.length;
        return 30 + positionBonus + lengthFactor * 20;
    }

    // Subsequence match (first letter of each word)
    const queryChars = query.split('');
    let matchIndex = 0;
    let score = 0;

    for (const char of text.split('')) {
        if (char === queryChars[matchIndex]) {
            matchIndex++;
            score += 5;
        }
    }

    if (matchIndex === queryChars.length) {
        return score;
    }

    return 0;
}

/**
 * Sort search results by score and recency
 */
export function sortSearchResults(
    results: Array<SearchItem & { score: number }>,
    recentlyUsed?: string[]
): Array<SearchItem & { score: number }> {
    return results.sort((a, b) => {
        // Prioritize recently used items
        const aRecent = recentlyUsed?.includes(a.id) ? 10 : 0;
        const bRecent = recentlyUsed?.includes(b.id) ? 10 : 0;

        // Sort by score and recency
        const scoreA = a.score + aRecent;
        const scoreB = b.score + bRecent;

        if (scoreB !== scoreA) return scoreB - scoreA;

        // Tiebreaker: by category order
        const categoryOrder = {
            Topic: 1,
            Paper: 2,
            Flashcard: 3,
            Note: 4,
            Community: 5,
            Tool: 6,
            Setting: 7,
        };

        return (categoryOrder[a.category] || 8) - (categoryOrder[b.category] || 8);
    });
}

/**
 * Group search results by category
 */
export function groupByCategory(
    results: Array<SearchItem & { score: number }>
): Record<string, Array<SearchItem & { score: number }>> {
    const grouped: Record<string, Array<SearchItem & { score: number }>> = {};

    results.forEach((item) => {
        if (!grouped[item.category]) {
            grouped[item.category] = [];
        }
        grouped[item.category].push(item);
    });

    return grouped;
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
        Topic: '📚',
        Paper: '📄',
        Flashcard: '🎯',
        Note: '📝',
        Community: '👥',
        Tool: '🛠️',
        Setting: '⚙️',
    };
    return icons[category] || '📌';
}

/**
 * Default command palette items (tools and settings)
 */
export const DEFAULT_COMMANDS: SearchItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        category: 'Tool',
        description: 'View your learning overview and progress',
        route: '/dashboard',
        icon: '📊',
        keywords: ['home', 'overview', 'stats', 'progress'],
    },
    {
        id: 'rpg-profile',
        title: 'RPG Profile',
        category: 'Tool',
        description: 'Check your level, XP, and achievements',
        route: '/dashboard?tab=rpg',
        icon: '🎮',
        keywords: ['level', 'xp', 'badges', 'achievements', 'gamification'],
    },
    {
        id: 'spaced-repetition',
        title: 'Review Flashcards',
        category: 'Tool',
        description: 'Practice spaced repetition with flashcards',
        route: '/revision/flashcards',
        icon: '🔄',
        keywords: ['flashcard', 'study', 'spaced', 'repetition', 'memorize'],
    },
    {
        id: 'weakness-predictor',
        title: 'Weakness Predictor',
        category: 'Tool',
        description: 'Analyze weak topics and improve predictions',
        route: '/dashboard?tab=weakness',
        icon: '⚠️',
        keywords: ['weakness', 'analysis', 'predict', 'risk', 'improve'],
    },
    {
        id: 'papers',
        title: 'Past Papers',
        category: 'Tool',
        description: 'Browse and attempt past papers',
        route: '/subjects',
        icon: '📋',
        keywords: ['paper', 'exam', 'practice', 'attempt'],
    },
    {
        id: 'community-wall',
        title: 'Community Wall',
        category: 'Community',
        description: 'Share your progress and connect with others',
        route: '/community/wall',
        icon: '👥',
        keywords: ['community', 'social', 'discuss', 'wall'],
    },
    {
        id: 'settings',
        title: 'Settings',
        category: 'Setting',
        description: 'Manage your preferences and account',
        route: '/settings',
        icon: '⚙️',
        keywords: ['preferences', 'account', 'theme', 'notification'],
    },
    {
        id: 'profile',
        title: 'My Profile',
        category: 'Setting',
        description: 'View and edit your profile',
        route: '/profile',
        icon: '👤',
        keywords: ['profile', 'account', 'information', 'user'],
    },
    {
        id: 'help',
        title: 'Help & Support',
        category: 'Setting',
        description: 'Get help and contact support',
        route: '/support',
        icon: '❓',
        keywords: ['help', 'support', 'faq', 'contact'],
    },
];
