export type ExamBoardValue = "AQA" | "Edexcel" | "OCR" | "WJEC" | "CCEA" | "Other";

export const EXAM_BOARD_OPTIONS: Array<{ value: "all" | ExamBoardValue; label: string }> = [
  { value: "all", label: "All boards" },
  { value: "AQA", label: "AQA" },
  { value: "Edexcel", label: "Edexcel" },
  { value: "OCR", label: "OCR" },
  { value: "WJEC", label: "WJEC" },
  { value: "CCEA", label: "CCEA" },
  { value: "Other", label: "Other" },
];

export function parseExamBoard(value?: string): ExamBoardValue | undefined {
  if (value === "AQA" || value === "Edexcel" || value === "OCR" || value === "WJEC" || value === "CCEA" || value === "Other") {
    return value;
  }

  return undefined;
}

export const PAPER_YEAR_OPTIONS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017] as const;
