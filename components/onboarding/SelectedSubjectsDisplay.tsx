"use client";

import { useEffect, useState } from "react";
import type { Subject } from "@prisma/client";
import Card from "@/components/cards/Card";
import PageTitle from "@/components/ui/PageTitle";
import SubTitle from "@/components/ui/SubTitle";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface UserSubject {
    id: string;
    userId: string;
    subjectId: string;
    examBoardSlug: string | null;
    examBoardId: string | null;
    createdAt: Date;
}

interface UserSubjectWithRelations extends UserSubject {
    subject: Subject & { _count?: { questions: number } };
}

interface PerformanceData {
    totalQuestions: number;
    attemptedQuestions: number;
    totalMarksEarned: number;
    totalMarksPossible: number;
    percentage: number;
    grade: number;
    feedback: string;
}

function GradeDisplay({ grade, percentage }: { grade: number; percentage: number }) {
    const getGradeColor = (g: number) => {
        if (g >= 7) return "text-green-600 bg-green-100";
        if (g >= 5) return "text-blue-600 bg-blue-100";
        if (g >= 4) return "text-yellow-600 bg-yellow-100";
        return "text-red-600 bg-red-100";
    };

    return (
        <div className="flex items-center gap-3">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-2xl ${getGradeColor(grade)}`}>
                {grade}
            </div>
            <div className="flex-1">
                <p className="text-sm text-muted">Predicted Grade</p>
                <p className="text-lg font-semibold">{percentage}% Score</p>
            </div>
        </div>
    );
}

export function SelectedSubjectsDisplay() {
    const [userSubjects, setUserSubjects] = useState<UserSubjectWithRelations[]>([]);
    const [performance, setPerformance] = useState<Record<string, PerformanceData>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/onboarding/subjects");
                if (response.ok) {
                    const data = await response.json();
                    setUserSubjects(data.userSubjects);

                    // Fetch performance for each subject
                    const perfData: Record<string, PerformanceData> = {};
                    for (const userSubject of data.userSubjects) {
                        try {
                            const perfResponse = await fetch(
                                `/api/questions/performance?subjectId=${userSubject.subjectId}`
                            );
                            if (perfResponse.ok) {
                                const perfJson = await perfResponse.json();
                                perfData[userSubject.subjectId] = perfJson.performance;
                            }
                        } catch (err) {
                            console.error(`Error fetching performance for subject ${userSubject.subjectId}:`, err);
                        }
                    }
                    setPerformance(perfData);
                } else {
                    setError("Failed to load subjects");
                }
            } catch (err) {
                console.error("Error fetching subjects:", err);
                setError("Error loading subjects");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <Card className="py-8 text-center">
                <p className="text-muted">Loading your subjects...</p>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="py-8 text-center">
                <p className="text-red-500">{error}</p>
            </Card>
        );
    }

    if (userSubjects.length === 0) {
        return (
            <Card className="py-8 text-center">
                <PageTitle>No subjects selected</PageTitle>
                <SubTitle className="mt-2">Go to settings to add revision subjects.</SubTitle>
                <Link href="/settings" className="inline-block mt-4">
                    <Button>Add Subjects</Button>
                </Link>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <PageTitle className="text-2xl">Your Revision Subjects</PageTitle>
                <SubTitle>{userSubjects.length} subject{userSubjects.length !== 1 ? "s" : ""} selected</SubTitle>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userSubjects.map((userSubject) => {
                    const perf = performance[userSubject.subjectId];

                    return (
                        <Card
                            key={userSubject.id}
                            className="p-6 hover:shadow-lg transition-shadow flex flex-col"
                        >
                            <div className="space-y-4 flex-1">
                                <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                    style={{
                                        backgroundColor: userSubject.subject.color || "var(--primary)"
                                    }}
                                >
                                    <span className="text-white font-bold text-lg">
                                        {userSubject.subject.title.charAt(0)}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg">{userSubject.subject.title}</h3>
                                    {userSubject.examBoardSlug && (
                                        <p className="text-sm text-muted mt-1">Exam Board: {userSubject.examBoardSlug}</p>
                                    )}
                                    {userSubject.subject._count?.questions && (
                                        <p className="text-sm text-muted mt-1">
                                            {userSubject.subject._count.questions} questions available
                                        </p>
                                    )}
                                </div>

                                {perf && perf.attemptedQuestions > 0 && (
                                    <div className="space-y-3 pt-4 border-t border-[var(--border)]">
                                        <GradeDisplay grade={perf.grade} percentage={perf.percentage} />
                                        <div className="text-xs text-muted space-y-1">
                                            <p>Answered: {perf.attemptedQuestions}/{perf.totalQuestions} questions</p>
                                            <p>Marks: {perf.totalMarksEarned}/{perf.totalMarksPossible}</p>
                                            <p className="italic pt-2">{perf.feedback}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-4 mt-4 border-t border-[var(--border)]">
                                <Link href={`/practice/${userSubject.subject.slug}`} className="flex-1">
                                    <Button className="w-full">
                                        Practice
                                    </Button>
                                </Link>
                                <button
                                    onClick={async () => {
                                        await fetch("/api/onboarding/subjects", {
                                            method: "DELETE",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ subjectId: userSubject.subjectId })
                                        });
                                        setUserSubjects(prev => prev.filter(us => us.id !== userSubject.id));
                                    }}
                                    className="text-muted hover:text-red-500 transition-colors px-3 py-2"
                                >
                                    Remove
                                </button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
