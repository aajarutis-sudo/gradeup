export type DiagnosticQuestion = {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  topic: string;
};

export type PredictedGradeResult = {
  predictedGrade: number;
  weakTopics: string[];
  strongTopics: string[];
  explanation: string;
};

export type RevisionPlanDay = {
  day: string;
  tasks: Array<{
    type: "flashcards" | "quiz" | "revision";
    topic: string;
    duration: number;
  }>;
};

export type FlashcardPromptItem = {
  front: string;
  back: string;
};

export type LessonNotesResult = {
  title: string;
  overview: string;
  keyPoints: string[];
  subtopicNotes: Array<{
    subtopic: string;
    notes: string[];
  }>;
  examLinks: string[];
  quickCheck: string[];
};

export type QuizPromptItem = {
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
};

export type NextStepResult = {
  action: string;
  topic: string;
  reason: string;
};

export type ExplanationResult = {
  question: string;
  correctAnswer: string;
  studentAnswer: string;
  explanation: string;
};

export type PromptBundle = {
  systemPrompt: string;
  userPrompt: string;
  responseFormat: "json";
  parserHint: string;
  schemaName: string;
  schema: Record<string, unknown>;
};

function stableJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function buildDiagnosticPrompt(input: { subject: string }): PromptBundle {
  return {
    systemPrompt:
      "You are an expert GCSE teacher. Be accurate, concise, safe, and supportive. Avoid copyrighted text. Return only valid JSON.",
    userPrompt: `Generate a short diagnostic quiz for a student.

Requirements:
- Subject: ${input.subject}
- Output 5-10 multiple-choice questions.
- Each question must test a different topic within the subject.
- Difficulty: standard GCSE level.
- No copyrighted text.
- No long explanations.
- Keep questions short and clear.

For each question, return:
{
  "question": "",
  "options": ["", "", "", ""],
  "correctIndex": 0,
  "topic": ""
}

Return JSON:
{
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctIndex": 0,
      "topic": ""
    }
  ]
}`,
    responseFormat: "json",
    parserHint: "Parse as { questions: DiagnosticQuestion[] }",
    schemaName: "gradeup_diagnostic_questions",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              question: { type: "string" },
              options: {
                type: "array",
                items: { type: "string" },
              },
              correctIndex: { type: "integer", minimum: 0, maximum: 3 },
              topic: { type: "string" },
            },
            required: ["question", "options", "correctIndex", "topic"],
          },
        },
      },
      required: ["questions"],
    },
  };
}

export function buildPredictedGradePrompt(input: {
  subject: string;
  questions: unknown;
  answers: unknown;
}): PromptBundle {
  return {
    systemPrompt:
      "You are an expert GCSE examiner. Be evidence-based, student-friendly, and conservative in your prediction. Return only valid JSON.",
    userPrompt: `A student has completed a diagnostic quiz.

Input:
- Subject: ${input.subject}
- Questions: ${stableJson(input.questions)}
- StudentAnswers: ${stableJson(input.answers)}

Tasks:
1. Analyse the student's performance.
2. Estimate a predicted GCSE grade (1-9).
3. Identify weak topics (2-3).
4. Identify strong topics (2-3).
5. Provide a short explanation (2-3 sentences).

Return JSON:
{
  "predictedGrade": 0,
  "weakTopics": [],
  "strongTopics": [],
  "explanation": ""
}`,
    responseFormat: "json",
    parserHint: "Parse as PredictedGradeResult",
    schemaName: "gradeup_predicted_grade",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedGrade: { type: "integer", minimum: 1, maximum: 9 },
        weakTopics: { type: "array", items: { type: "string" } },
        strongTopics: { type: "array", items: { type: "string" } },
        explanation: { type: "string" },
      },
      required: ["predictedGrade", "weakTopics", "strongTopics", "explanation"],
    },
  };
}

export function buildRevisionPlanPrompt(input: {
  subject: string;
  grade: number;
  weakTopics: string[];
  strongTopics: string[];
  xp: number;
  level: number;
  streak: number;
}): PromptBundle {
  return {
    systemPrompt:
      "You are an AI GCSE tutor. Create realistic, supportive, structured revision plans. Keep output deterministic and return only valid JSON.",
    userPrompt: `Create a personalised weekly revision plan.

Input:
- Subject: ${input.subject}
- PredictedGrade: ${input.grade}
- WeakTopics: ${stableJson(input.weakTopics)}
- StrongTopics: ${stableJson(input.strongTopics)}
- XP: ${input.xp}
- Level: ${input.level}
- Streak: ${input.streak}

Rules:
- Focus more time on weak topics.
- Include quizzes, flashcards, and revision sessions.
- Keep it realistic: 20-40 minutes per day.
- Tone: supportive, encouraging.

Return JSON:
{
  "days": [
    {
      "day": "Monday",
      "tasks": [
        {"type": "flashcards", "topic": "", "duration": 20},
        {"type": "quiz", "topic": "", "duration": 10}
      ]
    }
  ]
}`,
    responseFormat: "json",
    parserHint: "Parse as { days: RevisionPlanDay[] }",
    schemaName: "gradeup_revision_plan",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        days: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              day: { type: "string" },
              tasks: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    type: { type: "string", enum: ["flashcards", "quiz", "revision"] },
                    topic: { type: "string" },
                    duration: { type: "integer", minimum: 10, maximum: 40 },
                  },
                  required: ["type", "topic", "duration"],
                },
              },
            },
            required: ["day", "tasks"],
          },
        },
      },
      required: ["days"],
    },
  };
}

export function buildFlashcardsPrompt(input: { topic: string; subject: string }): PromptBundle {
  return {
    systemPrompt:
      "You generate GCSE flashcards that are clear, short, safe, and original. Return only valid JSON.",
    userPrompt: `Generate GCSE flashcards for the topic below.

Topic: ${input.topic}
Subject: ${input.subject}

Requirements:
- 10-20 flashcards.
- Front: question, keyword, or concept.
- Back: simple explanation.
- No copyrighted text.
- Keep explanations short.

Return JSON:
{
  "flashcards": [
    { "front": "", "back": "" }
  ]
}`,
    responseFormat: "json",
    parserHint: "Parse as { flashcards: FlashcardPromptItem[] }",
    schemaName: "gradeup_flashcards",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flashcards: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              front: { type: "string" },
              back: { type: "string" },
            },
            required: ["front", "back"],
          },
        },
      },
      required: ["flashcards"],
    },
  };
}

export function buildLessonNotesPrompt(input: {
  subject: string;
  topic: string;
  examBoard?: string | null;
  summary?: string | null;
  subtopics?: string[];
}): PromptBundle {
  return {
    systemPrompt:
      "You are an expert GCSE teacher. Create accurate, student-friendly lesson notes aligned to the named exam specification area. Keep them original, clear, and easy to revise from. Return only valid JSON.",
    userPrompt: `Create GCSE lesson notes for the topic below.

Subject: ${input.subject}
Topic: ${input.topic}
ExamBoard: ${input.examBoard ?? "GCSE specification"}
Summary: ${input.summary ?? "No summary provided."}
Subtopics: ${stableJson(input.subtopics ?? [])}

Requirements:
- Match the specification area named above.
- Keep the writing clear, supportive, and concise.
- No copyrighted text.
- Focus on what a student needs to know for revision and exam questions.
- Make the notes feel complete, not skeletal.
- Write a full overview, at least several key points, and notes for each listed subtopic if subtopics are provided.
- Avoid repeating the same idea across key points and subtopic notes.

Return JSON:
{
  "title": "",
  "overview": "",
  "keyPoints": ["", "", "", "", ""],
  "subtopicNotes": [
    {
      "subtopic": "",
      "notes": ["", ""]
    }
  ],
  "examLinks": ["", "", ""],
  "quickCheck": ["", "", ""]
}`,
    responseFormat: "json",
    parserHint: "Parse as LessonNotesResult",
    schemaName: "gradeup_lesson_notes",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        overview: { type: "string" },
        keyPoints: { type: "array", items: { type: "string" } },
        subtopicNotes: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              subtopic: { type: "string" },
              notes: { type: "array", items: { type: "string" } },
            },
            required: ["subtopic", "notes"],
          },
        },
        examLinks: { type: "array", items: { type: "string" } },
        quickCheck: { type: "array", items: { type: "string" } },
      },
      required: ["title", "overview", "keyPoints", "subtopicNotes", "examLinks", "quickCheck"],
    },
  };
}

export function buildQuizPrompt(input: { topic: string; subject: string; level: number }): PromptBundle {
  return {
    systemPrompt:
      "You generate GCSE multiple-choice quizzes that are clear, varied, and aligned to the student's level. Return only valid JSON.",
    userPrompt: `Generate a GCSE quiz for the topic below.

Topic: ${input.topic}
Subject: ${input.subject}
Difficulty: adapt to user level ${input.level}

Requirements:
- 5-10 multiple-choice questions.
- Each question must be unique.
- Include 4 options.
- Mark the correct answer.

Return JSON:
{
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctIndex": 0
    }
  ]
}`,
    responseFormat: "json",
    parserHint: "Parse as { questions: QuizPromptItem[] }",
    schemaName: "gradeup_topic_quiz",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              question: { type: "string" },
              options: {
                type: "array",
                items: { type: "string" },
              },
              correctIndex: { type: "integer", minimum: 0, maximum: 3 },
            },
            required: ["question", "options", "correctIndex"],
          },
        },
      },
      required: ["questions"],
    },
  };
}

export function buildNextStepPrompt(input: {
  subject: string;
  weakTopics: string[];
  strongTopics: string[];
  progress: unknown;
  xp: number;
  level: number;
  streak: number;
}): PromptBundle {
  return {
    systemPrompt:
      "You are an AI GCSE tutor. Recommend one clear next step only. Be supportive, brief, and practical. Return only valid JSON.",
    userPrompt: `Recommend the next best action for the student.

Input:
- Subject: ${input.subject}
- WeakTopics: ${stableJson(input.weakTopics)}
- StrongTopics: ${stableJson(input.strongTopics)}
- Progress: ${stableJson(input.progress)}
- XP: ${input.xp}
- Level: ${input.level}
- Streak: ${input.streak}

Choose ONE next step:
- revise a weak topic
- take a quiz
- review flashcards
- continue a topic
- start a new topic

Return JSON:
{
  "action": "",
  "topic": "",
  "reason": ""
}`,
    responseFormat: "json",
    parserHint: "Parse as NextStepResult",
    schemaName: "gradeup_next_step",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        action: {
          type: "string",
          enum: ["revise a weak topic", "take a quiz", "review flashcards", "continue a topic", "start a new topic"],
        },
        topic: { type: "string" },
        reason: { type: "string" },
      },
      required: ["action", "topic", "reason"],
    },
  };
}

export function buildExplanationPrompt(input: {
  questions: unknown;
  answers: unknown;
}): PromptBundle {
  return {
    systemPrompt:
      "You are an AI GCSE tutor. Give simple, supportive quiz feedback. Be accurate, gentle, and concise. Return only valid JSON.",
    userPrompt: `Provide feedback on a completed quiz.

Input:
- Questions: ${stableJson(input.questions)}
- StudentAnswers: ${stableJson(input.answers)}

For each question:
- Explain the correct answer in simple terms.
- If the student was wrong, explain why gently.
- Tone: supportive, encouraging.

Return JSON:
{
  "feedback": [
    {
      "question": "",
      "correctAnswer": "",
      "studentAnswer": "",
      "explanation": ""
    }
  ]
}`,
    responseFormat: "json",
    parserHint: "Parse as { feedback: ExplanationResult[] }",
    schemaName: "gradeup_quiz_feedback",
    schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feedback: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              question: { type: "string" },
              correctAnswer: { type: "string" },
              studentAnswer: { type: "string" },
              explanation: { type: "string" },
            },
            required: ["question", "correctAnswer", "studentAnswer", "explanation"],
          },
        },
      },
      required: ["feedback"],
    },
  };
}
