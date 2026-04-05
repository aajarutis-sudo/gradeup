'use client'

import React, { useState, useEffect } from 'react'
import {
    AlertTriangle,
    TrendingDown,
    Target,
    Clock,
    RotateCw,
} from 'lucide-react'

interface Prediction {
    topicId: number
    topicName: string
    riskScore: number
    predictedMarkLoss: number
    confidence: number
    factors: {
        name: string
        weight: number
        value: number
    }[]
    recommendations: string[]
}

interface Overall {
    examRiskScore: number
    progressCategory: string
    topicsAnalyzed: number
    topicsWithHighRisk: number
    estimatedPassProbability: number
}

export const WeaknessPredictor: React.FC = () => {
    const [predictions, setPredictions] = useState<Prediction[]>([])
    const [overall, setOverall] = useState<Overall | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedTopic, setSelectedTopic] = useState<Prediction | null>(null)

    useEffect(() => {
        analyzePredictions()
    }, [])

    const analyzePredictions = async () => {
        try {
            const res = await fetch('/api/learning/weakness-predictor/analyze')
            const data = await res.json()
            if (data.success) {
                setPredictions(data.data.predictions)
                setOverall(data.data.overall)
                setSelectedTopic(data.data.predictions[0])
            }
        } catch (error) {
            console.error('Error fetching predictions:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <RotateCw className="animate-spin" size={48} />
            </div>
        )
    }

    const getRiskColor = (score: number) => {
        if (score > 70) return 'text-red-600'
        if (score > 50) return 'text-orange-600'
        if (score > 30) return 'text-yellow-600'
        return 'text-green-600'
    }

    const getRiskBgColor = (score: number) => {
        if (score > 70) return 'bg-red-50'
        if (score > 50) return 'bg-orange-50'
        if (score > 30) return 'bg-yellow-50'
        return 'bg-green-50'
    }

    return (
        <div className="max-w-6xl mx-auto p-8">
            {/* Overall Stats */}
            {overall && (
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                        <div className="text-sm font-semibold opacity-90">Progress</div>
                        <div className="text-3xl font-bold mt-2">{overall.progressCategory}</div>
                        <div className="text-xs opacity-75 mt-2">Overall performance level</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                        <div className="text-sm font-semibold opacity-90">Exam Risk</div>
                        <div className="text-3xl font-bold mt-2">{overall.examRiskScore}%</div>
                        <div className="text-xs opacity-75 mt-2">Probability of losing marks</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
                        <div className="text-sm font-semibold opacity-90">Pass Rate</div>
                        <div className="text-3xl font-bold mt-2">
                            {overall.estimatedPassProbability.toFixed(0)}%
                        </div>
                        <div className="text-xs opacity-75 mt-2">Estimated pass probability</div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
                        <div className="text-sm font-semibold opacity-90">High Risk</div>
                        <div className="text-3xl font-bold mt-2">{overall.topicsWithHighRisk}</div>
                        <div className="text-xs opacity-75 mt-2">Topics needing focus</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-3 gap-8">
                {/* Left: Prediction List */}
                <div className="col-span-1">
                    <h2 className="text-xl font-bold mb-4">Weak Topics</h2>
                    <div className="space-y-2">
                        {predictions.map((pred) => (
                            <button
                                key={pred.topicId}
                                onClick={() => setSelectedTopic(pred)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition ${selectedTopic?.topicId === pred.topicId
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="font-semibold text-sm">{pred.topicName}</div>
                                <div className={`text-lg font-bold mt-1 ${getRiskColor(pred.riskScore)}`}>
                                    {pred.riskScore.toFixed(0)}% Risk
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Detailed Analysis */}
                {selectedTopic && (
                    <div className="col-span-2">
                        <div className={`${getRiskBgColor(selectedTopic.riskScore)} border-l-4 p-6 rounded-lg mb-6`}>
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-2xl font-bold">{selectedTopic.topicName}</h3>
                                <button
                                    onClick={() => window.location.href = '/revision/quizzes'}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                                >
                                    Revise This Topic
                                </button>
                            </div>

                            {/* Risk Gauge */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Risk Score</span>
                                    <span className={`text-lg font-bold ${getRiskColor(selectedTopic.riskScore)}`}>
                                        {selectedTopic.riskScore.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all ${selectedTopic.riskScore > 70
                                            ? 'bg-red-500'
                                            : selectedTopic.riskScore > 50
                                                ? 'bg-orange-500'
                                                : selectedTopic.riskScore > 30
                                                    ? 'bg-yellow-500'
                                                    : 'bg-green-500'
                                            }`}
                                        style={{ width: `${selectedTopic.riskScore}%` }}
                                    />
                                </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div>
                                    <div className="text-xs text-gray-600">Predicted Mark Loss</div>
                                    <div className="text-2xl font-bold">
                                        {selectedTopic.predictedMarkLoss.toFixed(1)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-600">Confidence</div>
                                    <div className="text-2xl font-bold">
                                        {selectedTopic.confidence.toFixed(0)}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-600">Impact Factors</div>
                                    <div className="text-2xl font-bold">{selectedTopic.factors.length}</div>
                                </div>
                            </div>

                            {/* Factor Breakdown */}
                            <div className="mb-6">
                                <h4 className="font-semibold mb-3">Contributing Factors</h4>
                                {selectedTopic.factors.map((factor) => (
                                    <div key={factor.name} className="mb-3">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{factor.name}</span>
                                            <span className="font-semibold">{(factor.value * factor.weight).toFixed(1)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gray-400 h-2 rounded-full"
                                                style={{ width: `${factor.value}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Recommendations */}
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center">
                                    <Target className="mr-2" size={18} />
                                    Recommendations
                                </h4>
                                <ul className="space-y-2">
                                    {selectedTopic.recommendations.map((rec, idx) => (
                                        <li
                                            key={idx}
                                            className="text-sm bg-white bg-opacity-50 p-3 rounded-lg border-l-4 border-blue-400"
                                        >
                                            {rec}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
