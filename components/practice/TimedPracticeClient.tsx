"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/cards/Card";

interface Question {
    id: string;
    questionText: string;
    marks: number;
    difficulty: number;
    year?: number;
    examBoard?: string;
}

interface TimedPractice {
    question: Question;
    allocatedTime: number; // seconds
}

interface MarkingResult {
    score: number;
    outOf: number;
    percentage: number;
    grade: number;
    reasoning: string;
    improvements: string[];
    confidence: number;
    timingFeedback: string;
    timeSpent: number;
}

export default function TimedPracticeClient({
    questions,
    subject,
}: {
    questions: Question[];
    subject: { id: string; name: string };
}) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [answer, setAnswer] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [isMarking, setIsMarking] = useState(false);
    const [marking, setMarking] = useState<MarkingResult | null>(null);
    const [timeSpent, setTimeSpent] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const allocatedTime = currentQuestion?.marks ? currentQuestion.marks * 60 : 180;

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeLeft !== null && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === null) return null;
                    const newTime = prev - 1;
                    setTimeSpent((s) => s + 1);
                    return newTime;
                });
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            // Auto-submit when time runs out
            handleSubmitAnswer();
        }

        return () => clearInterval(interval);
    }, [isRunning, timeLeft]);

    const startQuestion = () => {
        setTimeLeft(allocatedTime);
        setTimeSpent(0);
        setAnswer("");
        setMarking(null);
        setShowResults(false);
        setIsRunning(true);
    };

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            alert("Please type an answer");
            return;
        }

        setIsRunning(false);
        setIsMarking(true);

        try {
            // Create a temporary question record for marking
            const response = await fetch("/api/questions/mark", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    questionId: currentQuestion.id,
                    userAnswer: answer,
                }),
            });

            if (response.ok) {
                const data = await response.json();

                // Enhance with timing feedback
                const allocSeconds = allocatedTime;
                const timingMsg =
                    timeSpent > allocSeconds
                        ? `⏱️ Over time by ${Math.ceil((timeSpent - allocSeconds) / 60)}m`
                        : `✓ ${Math.floor(timeSpent / 60)}:${String(timeSpent % 60).padStart(2, "0")}`;

                setMarking({
                    ...data.marking,
                    timingFeedback: timingMsg,
                });
                setShowResults(true);
            } else {
                alert("Failed to mark answer");
            }
        } catch (error) {
            console.error("Error marking:", error);
            alert("Error marking answer");
        } finally {
            setIsMarking(false);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setAnswer("");
            setMarking(null);
            setShowResults(false);
            setTimeLeft(null);
            setTimeSpent(0);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${String(secs).padStart(2, "0")}`;
    };

    const getGradeColor = (g: number) => {
        if (g >= 7) return "text-green-600 bg-green-100";
        if (g >= 5) return "text-blue-600 bg-blue-100";
        if (g >= 4) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    const getGradeBg = (g: number) => {
        if (g >= 7) return "bg-green-50";
        if (g >= 5) return "bg-blue-50";
        if (g >= 4) return "bg-yellow-50";
        return "bg-red-50";
    };

    if (!currentQuestion) {
        return (
            <div className="text-center py-12">
                <p className="text-muted">No questions available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass-panel rounded-[28px] p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent)]">
                            Timed Practice
                        </p>
                        <h1 className="mt-2 text-3xl font-semibold">{subject.name}</h1>
                        <p className="mt-1 text-sm text-muted">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </p>
                    </div>

                    {isRunning && timeLeft !== null && (
                        <div
                            className={`text-center px-6 py-4 rounded-2xl font-mono text-2xl font-bold ${timeLeft < allocatedTime * 0.25
                                    ? "bg-red-100 text-red-600 animate-pulse"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                        >
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>
            </div>

            {/* Question Card */}
            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <p className="text-sm text-muted mb-2">
                                {currentQuestion.examBoard} • {currentQuestion.year || "Year unknown"} •{" "}
                                {currentQuestion.marks} mark{currentQuestion.marks !== 1 ? "s" : ""}
                            </p>
                            <h2 className="text-lg font-semibold">{currentQuestion.questionText}</h2>
                        </div>
                        <div className="ml-4 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium whitespace-nowrap">
                            {currentQuestion.marks} min
                        </div>
                    </div>

                    {/* Answer Area */}
                    {!showResults ? (
                        <div className="space-y-4">
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                disabled={!isRunning}
                                placeholder={
                                    isRunning
                                        ? "Type your answer here..."
                                        : "Start the timer to begin answering"
                                }
                                className="w-full h-40 p-4 border border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50 disabled:bg-gray-50"
                            />

                            <div className="flex gap-3">
                                {!isRunning ? (
                                    <Button onClick={startQuestion}>
                                        Start ({currentQuestion.marks} min)
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            onClick={handleSubmitAnswer}
                                            disabled={isMarking || !answer.trim()}
                                        >
                                            {isMarking ? "Marking..." : "Submit Answer"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setIsRunning(false);
                                                setTimeLeft(null);
                                            }}
                                        >
                                            Stop
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Results */
                        <div className={`space-y-4 p-4 rounded-2xl ${getGradeBg(marking!.grade)}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted mb-1">Score</p>
                                    <p className="text-2xl font-bold">
                                        {marking!.score}/{marking!.outOf} ({marking!.percentage}%)
                                    </p>
                                </div>
                                <div
                                    className={`px-6 py-3 rounded-2xl text-center font-bold text-2xl ${getGradeColor(
                                        marking!.grade
                                    )}`}
                                >
                                    Grade {marking!.grade}
                                </div>
                            </div>

                            <div className="border-t border-current opacity-20 pt-4">
                                <p className="text-sm font-semibold mb-2">Examiner Feedback</p>
                                <p className="text-sm leading-relaxed">{marking!.reasoning}</p>
                            </div>

                            {marking!.improvements.length > 0 && (
                                <div>
                                    <p className="text-sm font-semibold mb-2">Areas to Improve</p>
                                    <ul className="space-y-1">
                                        {marking!.improvements.map((improvement, i) => (
                                            <li key={i} className="text-sm flex items-start gap-2">
                                                <span className="text-yellow-600 font-bold">→</span>
                                                <span>{improvement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="border-t border-current opacity-20 pt-4 flex items-center justify-between text-sm">
                                <div>
                                    <p className="text-muted">{marking!.timingFeedback}</p>
                                    <p className="text-xs text-muted mt-1">
                                        Confidence: {Math.round(marking!.confidence * 100)}%
                                    </p>
                                </div>
                            </div>

                            {currentQuestionIndex < questions.length - 1 && (
                                <Button onClick={handleNext} className="w-full mt-4">
                                    Next Question
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Card>

            {/* Question Navigator */}
            <div className="flex gap-2 flex-wrap">
                {questions.map((q, i) => (
                    <button
                        key={i}
                        onClick={() => {
                            setCurrentQuestionIndex(i);
                            setAnswer("");
                            setMarking(null);
                            setShowResults(false);
                            setTimeLeft(null);
                            setTimeSpent(0);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition ${i === currentQuestionIndex
                                ? "bg-[var(--primary)] text-white"
                                : "bg-[var(--background-elevated)] text-[var(--foreground)] hover:bg-[var(--border)]"
                            }`}
                    >
                        Q{i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
