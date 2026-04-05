"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Subject } from "@prisma/client";
import Button from "@/components/ui/Button";

interface OnboardingSubjectSelectionProps {
  subjects: Subject[];
}

export default function OnboardingSubjectSelection({ subjects }: OnboardingSubjectSelectionProps) {
  const [selectedSubjects, setSelectedSubjects] = useState<Map<string, string>>(new Map());
  const [showExamBoardDropdown, setShowExamBoardDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const examBoards = ["AQA", "Edexcel", "OCR", "WJEC", "CCEA"];

  const toggleSubject = (subjectId: string) => {
    const newSelected = new Map(selectedSubjects);
    if (newSelected.has(subjectId)) {
      newSelected.delete(subjectId);
    } else {
      newSelected.set(subjectId, "");
    }
    setSelectedSubjects(newSelected);
  };

  const setExamBoard = (subjectId: string, board: string) => {
    const newSelected = new Map(selectedSubjects);
    newSelected.set(subjectId, board);
    setSelectedSubjects(newSelected);
    setShowExamBoardDropdown(null);
  };

  const handleContinue = async () => {
    if (selectedSubjects.size === 0) {
      alert("Please select at least one subject");
      return;
    }

    setIsLoading(true);
    try {
      // Save all selected subjects
      await Promise.all(
        Array.from(selectedSubjects.entries()).map(([subjectId, examBoard]) =>
          fetch("/api/onboarding/subjects", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              subjectId,
              examBoardSlug: examBoard || null
            })
          })
        )
      );

      // Go to diagnostic quiz for first subject
      const firstSubject = Array.from(selectedSubjects.keys())[0];
      const firstSubjectObj = subjects.find(s => s.id === firstSubject);

      if (firstSubjectObj) {
        router.push(`/onboarding/quiz?subject=${firstSubjectObj.slug}`);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error saving subjects:", error);
      alert("Failed to save subjects. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => {
          const isSelected = selectedSubjects.has(subject.id);
          const examBoard = selectedSubjects.get(subject.id);

          return (
            <div
              key={subject.id}
              className={`relative rounded-3xl p-6 transition-all duration-300 border-2 cursor-pointer ${isSelected
                  ? "bg-[var(--primary)]/10 border-[var(--primary)]"
                  : "bg-[var(--background)] border-transparent hover:shadow-lg hover:scale-105"
                }`}
              onClick={() => toggleSubject(subject.id)}
            >
              <div className="space-y-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    backgroundColor: subject.color || "var(--primary)",
                    opacity: isSelected ? 1 : 0.8
                  }}
                >
                  <span className="text-white font-bold text-lg">{subject.title.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{subject.title}</h3>
                  {subject.description && (
                    <p className="mt-2 text-sm text-muted line-clamp-2">{subject.description}</p>
                  )}
                </div>

                {isSelected && (
                  <div className="pt-3 border-t border-[var(--border)]">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowExamBoardDropdown(
                            showExamBoardDropdown === subject.id ? null : subject.id
                          );
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm font-medium hover:bg-[var(--primary)]/5 transition-colors"
                      >
                        {examBoard ? `${examBoard} ✓` : "Choose exam board"}
                      </button>

                      {showExamBoardDropdown === subject.id && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] border border-[var(--border)] rounded-lg shadow-lg z-50">
                          <div className="p-2 space-y-1">
                            {examBoards.map((board) => (
                              <button
                                key={board}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExamBoard(subject.id, board);
                                }}
                                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${examBoard === board
                                    ? "bg-[var(--primary)] text-white"
                                    : "hover:bg-[var(--primary)]/10"
                                  }`}
                              >
                                {board}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 justify-between pt-6">
        <p className="text-sm text-muted self-center">
          {selectedSubjects.size === 0
            ? "Select subjects to continue"
            : `${selectedSubjects.size} subject${selectedSubjects.size !== 1 ? "s" : ""} selected`}
        </p>
        <Button
          onClick={handleContinue}
          disabled={selectedSubjects.size === 0 || isLoading}
          className="px-8"
        >
          {isLoading ? "Saving..." : "Continue to Dashboard"}
        </Button>
      </div>
    </div>
  );
}
