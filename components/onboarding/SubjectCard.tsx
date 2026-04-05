"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Subject } from "@prisma/client";

interface SubjectCardProps {
    subject: Subject;
    onSelect: (subjectId: string, examBoard?: string) => Promise<void>;
    isLoading: boolean;
}

export function SubjectCard({ subject, onSelect, isLoading }: SubjectCardProps) {
    const [showExamBoards, setShowExamBoards] = useState(false);
    const [selectedExamBoard, setSelectedExamBoard] = useState<string | null>(null);
    const router = useRouter();

    const examBoards = ["AQA", "Edexcel", "OCR", "WJEC", "CCEA"];

    const handleSelect = async (examBoard?: string) => {
        await onSelect(subject.id, examBoard);
        setShowExamBoards(false);
        setSelectedExamBoard(null);
        // Redirect to continue dashboard
        setTimeout(() => router.push("/dashboard"), 500);
    };

    return (
        <div className="group relative">
            <button
                onClick={() => setShowExamBoards(!showExamBoards)}
                disabled={isLoading}
                className="w-full rounded-3xl bg-[var(--background)] p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
                <div className="space-y-3">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: subject.color || "var(--primary)" }}
                    >
                        <span className="text-white font-bold text-lg">{subject.title.charAt(0)}</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg group-hover:text-[var(--primary)]">
                            {subject.title}
                        </h3>
                        {subject.description && (
                            <p className="mt-2 text-sm text-muted line-clamp-2">{subject.description}</p>
                        )}
                    </div>
                </div>
            </button>

            {showExamBoards && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-lg z-50">
                    <div className="p-4 space-y-2">
                        <p className="text-sm font-semibold text-muted px-2">Choose Exam Board:</p>
                        {examBoards.map((board) => (
                            <button
                                key={board}
                                onClick={() => handleSelect(board)}
                                disabled={isLoading}
                                className="w-full text-left px-4 py-2 rounded-lg hover:bg-[var(--primary)] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {board}
                            </button>
                        ))}
                        <button
                            onClick={() => setShowExamBoards(false)}
                            className="w-full text-left px-4 py-2 rounded-lg text-muted hover:bg-[var(--background)] transition-colors text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
