/**
 * Weakness Predictor
 * Analyzes student performance to predict topics they'll lose marks on
 */

export interface TopicPerformance {
    topicId: string
    topicName: string
    quizAccuracy: number // 0-100
    flashcardAccuracy: number // 0-100
    timeSpent: number // Minutes
    practiceAttempts: number
    recentAttempts: {
        score: number
        maxScore: number
        timestamp: Date
    }[]
}

export interface WeaknessPrediction {
    topicId: string
    topicName: string
    riskScore: number // 0-100, higher = more likely to lose marks
    predictedMarkLoss: number // Expected marks lost
    confidence: number // 0-100
    factors: {
        name: string
        weight: number // Contribution to risk score
        value: number // Current value
    }[]
    recommendations: string[]
}

/**
 * Calculate weakness predictions for a student
 */
export const predictWeaknesses = (
    topicPerformances: TopicPerformance[]
): WeaknessPrediction[] => {
    return topicPerformances.map((performance) => {
        // Calculate risk factors
        const quizAccuracyFactor = 100 - performance.quizAccuracy; // Higher miss rate = higher risk
        const flashcardAccuracyFactor = 100 - performance.flashcardAccuracy;
        const timeSpentFactor = Math.max(0, 100 - performance.timeSpent / 10); // Less time = more risk
        const practiceFactor =
            performance.practiceAttempts < 3
                ? 100 - performance.practiceAttempts * 30
                : 0; // Few attempts = more risk

        // Recent performance trend
        let recentTrend = 0;
        if (performance.recentAttempts.length > 1) {
            const recent = performance.recentAttempts.slice(-3);
            const accuracies = recent.map((a) => (a.score / a.maxScore) * 100);
            const trend = accuracies[accuracies.length - 1] - accuracies[0];
            recentTrend = Math.max(-30, Math.min(30, trend)); // -30 to 30 point trend
        }

        // Weighted risk calculation
        const factors = [
            { name: 'Quiz Accuracy', weight: 0.35, value: quizAccuracyFactor },
            { name: 'Flashcard Accuracy', weight: 0.25, value: flashcardAccuracyFactor },
            { name: 'Practice Time', weight: 0.2, value: timeSpentFactor },
            { name: 'Practice Attempts', weight: 0.15, value: practiceFactor },
            { name: 'Recent Trend', weight: 0.05, value: Math.max(0, -recentTrend) },
        ];

        const riskScore = factors.reduce(
            (sum, f) => sum + f.value * f.weight,
            0
        );

        // Normalize risk score
        const normalizedRiskScore = Math.min(100, Math.max(0, riskScore));

        // Predict mark loss (assume 100-mark paper)
        const predictedMarkLoss = (normalizedRiskScore / 100) * 20; // Up to 20 marks

        // Calculate confidence based on data points
        const dataPoints =
            performance.recentAttempts.length + performance.practiceAttempts;
        const confidence = Math.min(95, (dataPoints / 20) * 100); // Up to 95%

        // Generate recommendations
        const recommendations = generateRecommendations(
            performance,
            normalizedRiskScore
        );

        return {
            topicId: performance.topicId,
            topicName: performance.topicName,
            riskScore: normalizedRiskScore,
            predictedMarkLoss,
            confidence,
            factors: factors.map((f) => ({
                name: f.name,
                weight: f.weight,
                value: f.value,
            })),
            recommendations,
        };
    });
};

/**
 * Generate revision recommendations based on weakness analysis
 */
const generateRecommendations = (
    performance: TopicPerformance,
    riskScore: number
): string[] => {
    const recommendations: string[] = [];

    if (performance.quizAccuracy < 70) {
        recommendations.push(
            `Focus on quiz practice for "${performance.topicName}" - current accuracy is only ${performance.quizAccuracy}%`
        );
    }

    if (performance.flashcardAccuracy < 70) {
        recommendations.push(
            `Use spaced repetition to memorize key concepts in "${performance.topicName}"`
        );
    }

    if (performance.timeSpent < 60) {
        recommendations.push(
            `Spend more time revising "${performance.topicName}" - currently only ${performance.timeSpent} minutes invested`
        );
    }

    if (performance.practiceAttempts < 3) {
        recommendations.push(
            `Practice more past paper questions on "${performance.topicName}" (current: ${performance.practiceAttempts} attempts)`
        );
    }

    if (riskScore > 70) {
        recommendations.push(
            `HIGH PRIORITY: Schedule an urgent revision session for "${performance.topicName}" - this is your weakest area`
        );
    }

    if (riskScore > 50) {
        recommendations.push(
            `Consider getting extra help or tutoring for "${performance.topicName}"`
        );
    }

    return recommendations;
};

/**
 * Calculate exam risk score (overall probability of failing the exam)
 */
export const calculateExamRiskScore = (
    predictions: WeaknessPrediction[]
): number => {
    if (predictions.length === 0) return 0;

    // Calculate weighted average risk
    const totalRisk = predictions.reduce((sum, p) => sum + p.riskScore, 0);
    const avgRisk = totalRisk / predictions.length;

    // Factor in mark loss
    const totalMarkLoss = predictions.reduce(
        (sum, p) => sum + p.predictedMarkLoss,
        0
    );
    const markLossPercentage = (totalMarkLoss / 200) * 100; // Assuming 200 total marks

    // Combine metrics (70% on average risk, 30% on mark loss)
    const examRiskScore = avgRisk * 0.7 + markLossPercentage * 0.3;

    return Math.min(100, Math.round(examRiskScore));
};

/**
 * Categorize student's overall progress
 */
export const categorizeProgress = (
    predictions: WeaknessPrediction[]
): 'Struggling' | 'Below Average' | 'Average' | 'Good' | 'Excellent' => {
    if (predictions.length === 0) return 'Average';

    const avgRisk =
        predictions.reduce((sum, p) => sum + p.riskScore, 0) / predictions.length;

    if (avgRisk > 70) return 'Struggling';
    if (avgRisk > 52) return 'Below Average';
    if (avgRisk > 35) return 'Average';
    if (avgRisk > 20) return 'Good';
    return 'Excellent';
};
