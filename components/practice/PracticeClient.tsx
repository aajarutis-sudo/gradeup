"use client";

import { useState } from "react";
import type { Subject } from "@prisma/client";

interface Question {
    id: string;
    subjectId: string;
    topicId: string | null;
    questionText: string;
    marks: number;
    sampleAnswer: string;
    markingCriteria: string;
    difficulty: number;
    examBoard: string | null;
    year: number | null;
    createdAt: Date;
}

interface QuestionAnswer {
    id: string;
    userId: string;
    questionId: string;
    userAnswer: string;
    markedScore: number | null;
    aiMarkingComment: string | null;
    confidence: number | null;
    markedAt: Date | null;
    createdAt: Date;
}
import MainLayout from "@/components/layout/MainLayout";
import Card from "@/components/cards/Card";
import PageTitle from "@/components/ui/PageTitle";
import SubTitle from "@/components/ui/SubTitle";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface QuestionWithAnswer extends Question {
    currentAnswer?: QuestionAnswer | null;
}

interface PracticeClientProps {
    subject: Subject;
    questions: Question[];
    userAnswerMap: Record<string, QuestionAnswer>;
}

function GradeDisplay({ grade, percentage }: { grade: number; percentage: number }) {
    const getGradeColor = (g: number) => {
        if (g >= 7) return "text-green-600 bg-green-100";
        if (g >= 5) return "text-blue-600 bg-blue-100";
        if (g >= 4) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    const GRADE_BOUNDARIES = [
        { grade: 9, min: 80 },
        { grade: 8, min: 70 },
        { grade: 7, min: 60 },
        { grade: 6, min: 50 },
        { grade: 5, min: 40 },
        { grade: 4, min: 30 },
        { grade: 3, min: 20 },
        { grade: 2, min: 10 },
        { grade: 1, min: 0 }
    ];

    const calculateGrade = (perc: number) => {
        for (const boundary of GRADE_BOUNDARIES) {
            if (perc >= boundary.min) {
                return boundary.grade;
            }
        }
        return 1;
    };

    const g = calculateGrade(percentage);

    return (
        <div className={`px-4 py-3 rounded-lg ${getGradeColor(g)} text-sm font-semibold`}>
            Grade {g} • {percentage}%
        </div>
    );
}

export default function PracticeClient({
    subject,
    questions,
    userAnswerMap
}: PracticeClientProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>(
        Object.fromEntries(
            Object.entries(userAnswerMap).map(([qId, existing]) => [qId, existing.userAnswer || ""])
        )
    );
    const [marking, setMarking] = useState<Record<string, any>>({});
    const [isMarking, setIsMarking] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion.id] || "";
    const currentMarking = marking[currentQuestion.id];

    const handleAnswerChange = (text: string) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: text
        }));
    };

    const handleSubmitAnswer = async () => {
        if (!currentAnswer.trim()) {
            alert("Please provide an answer");
            return;
        }

        setIsMarking(true);
        try {
            const response = await fetch("/api/questions/mark", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    questionId: currentQuestion.id,
                    userAnswer: currentAnswer
                })
            });

            if (response.ok) {
                const data = await response.json();
                setMarking(prev => ({
                    ...prev,
                    [currentQuestion.id]: data.marking
                }));
            } else {
                alert("Failed to mark answer");
            }
        } catch (error) {
            console.error("Error marking answer:", error);
            alert("Error marking answer");
        } finally {
            setIsMarking(false);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    if (showResults) {
        const markedAnswers = Object.values(marking).filter(m => m !== undefined);
        const totalMarksEarned = markedAnswers.reduce((sum, m) => sum + m.score, 0);
        const totalMarksPossible = questions.reduce((sum, q) => sum + q.marks, 0);
        const percentage = Math.round((totalMarksEarned / totalMarksPossible) * 100);

        return (
            <MainLayout>
                <div className="max-w-4xl mx-auto py-8 space-y-8">
                    <div>
                        <PageTitle className="text-4xl">{subject.title} Results</PageTitle>
                        <SubTitle>Your overall performance</SubTitle>
                    </div>

                    <Card className="p-8">
                        <div className="space-y-6">
                            <div className="text-center space-y-4">
                                <div className="text-6xl font-bold">{percentage}%</div>
                                <GradeDisplay grade={1} percentage={percentage} />
                                <p className="text-lg text-muted">
                                    {totalMarksEarned} marks out of {totalMarksPossible}
                                </p>
                            </div>

                            <div className="border-t border-[var(--border)] pt-6">
                                <h3 className="font-semibold text-lg mb-4">Question Breakdown</h3>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {questions.map((q, idx) => {
                                        const m = marking[q.id];
                                        return (
                                            <div key={q.id} className="flex justify-between items-center p-3 rounded-lg bg-[var(--background)]">
                                                <span className="text-sm">
                                                    Q{idx + 1}: {q.marks > 3 ? `${q.marks} marks` : "Short answer"}
                                                </span>
                                                {m ? (
                                                    <span className="font-semibold">{m.score}/{q.marks}</span>
                                                ) : (
                                                    <span className="text-muted">Not marked</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex gap-4 justify-center">
                        <Link href="/dashboard">
                            <Button>Back to Dashboard</Button>
                        </Link>
                        <Button
                            onClick={() => {
                                setShowResults(false);
                                setCurrentQuestionIndex(0);
                            }}
                        >
                            Review Answers
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto py-8 space-y-8">
                <div>
                    <PageTitle className="text-3xl">{subject.title}</PageTitle>
                    <SubTitle>Question {currentQuestionIndex + 1} of {questions.length}</SubTitle>
                    <div className="mt-4 w-full bg-[var(--border)] rounded-full h-2">
                        <div
                            className="bg-[var(--primary)] h-2 rounded-full transition-all"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                <Card className="p-8 space-y-6">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-semibold flex-1">{currentQuestion.questionText}</h2>
                            <span className="text-sm font-medium ml-4 whitespace-nowrap text-[var(--primary)]">
                                {currentQuestion.marks} marks
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block">
                            <p className="text-sm font-medium mb-2">Your Answer</p>
                            <textarea
                                value={currentAnswer}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                placeholder="Write your full answer here..."
                                className="w-full p-4 border border-[var(--border)] rounded-lg bg-[var(--background)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                                rows={6}
                                disabled={isMarking || currentMarking}
                            />
                        </label>

                        {currentMarking && (
                            <div className="space-y-4 p-4 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/20">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-semibold">Marker Feedback</p>
                                        <GradeDisplay grade={1} percentage={Math.round((currentMarking.score / currentQuestion.marks) * 100)} />
                                    </div>
                                    <p className="text-sm font-medium mb-3">
                                        Awarded: {currentMarking.score}/{currentQuestion.marks} marks
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold mb-1">Comment</p>
                                    <p className="text-sm text-muted">{currentMarking.comment}</p>
                                </div>

                                {currentMarking.feedback && (
                                    <div>
                                        <p className="text-sm font-semibold mb-1">Feedback for Improvement</p>
                                        <p className="text-sm text-muted">{currentMarking.feedback}</p>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-xs text-muted pt-2 border-t border-[var(--primary)]/10">
                                    <span>AI Confidence: {(currentMarking.confidence * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        )}

                        {!currentMarking && (
                            <Button
                                onClick={handleSubmitAnswer}
                                disabled={isMarking || !currentAnswer.trim()}
                                className="w-full"
                            >
                                {isMarking ? "Marking..." : "Submit & Get Marked"}
                            </Button>
                        )}
                    </div>
                </Card>

                <div className="flex gap-4 justify-between">
                    <Button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </Button>

                    <div className="flex gap-2">
                        {questions.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${idx === currentQuestionIndex
                                    ? "bg-[var(--primary)] text-white"
                                    : marking[questions[idx].id]
                                        ? "bg-green-500 text-white"
                                        : "bg-[var(--border)] text-muted hover:bg-[var(--primary)]/20"
                                    }`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    <Button
                        onClick={handleNext}
                        disabled={isMarking}
                    >
                        {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
}
