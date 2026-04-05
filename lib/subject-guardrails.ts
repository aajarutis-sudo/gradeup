const SUBJECT_GUARDRAILS: Record<
  string,
  {
    allowedFocus: string[];
    forbiddenTerms: string[];
  }
> = {
  biology: {
    allowedFocus: ["cells", "organisms", "ecology", "inheritance", "homeostasis"],
    forbiddenTerms: ["marketing", "finance", "construction site", "algorithm", "cash flow", "profit margin"],
  },
  chemistry: {
    allowedFocus: ["atoms", "bonding", "reactions", "moles", "electrolysis"],
    forbiddenTerms: ["marketing", "enterprise", "computer network", "construction site", "shakespeare"],
  },
  physics: {
    allowedFocus: ["energy", "forces", "electricity", "waves", "space"],
    forbiddenTerms: ["marketing", "enterprise", "poetry anthology", "construction site", "enzymes"],
  },
  "combined science": {
    allowedFocus: ["biology", "chemistry", "physics", "core science ideas"],
    forbiddenTerms: ["marketing", "enterprise", "construction site", "poetry anthology"],
  },
  mathematics: {
    allowedFocus: ["number", "algebra", "ratio", "geometry", "statistics"],
    forbiddenTerms: ["cells", "organs", "marketing", "construction site", "poetry anthology"],
  },
  "english language": {
    allowedFocus: ["reading", "writing", "language analysis", "structure", "transactional writing"],
    forbiddenTerms: ["cells", "atoms", "construction site", "cash flow", "algorithm"],
  },
  "english literature": {
    allowedFocus: ["themes", "characters", "quotes", "context", "comparison"],
    forbiddenTerms: ["cells", "atoms", "construction site", "cash flow", "algorithm"],
  },
  geography: {
    allowedFocus: ["hazards", "ecosystems", "urban issues", "resources", "fieldwork"],
    forbiddenTerms: ["organelle", "enzyme", "cash flow", "algorithm", "construction site"],
  },
  "computer science": {
    allowedFocus: ["algorithms", "systems", "memory", "storage", "cyber security"],
    forbiddenTerms: ["organelle", "photosynthesis", "cash flow", "construction site", "poetry anthology"],
  },
  "business studies": {
    allowedFocus: ["enterprise", "marketing", "finance", "operations", "growth"],
    forbiddenTerms: ["organelle", "photosynthesis", "atomic structure", "construction site", "trigonometry"],
  },
  construction: {
    allowedFocus: ["materials", "site safety", "planning", "structures", "construction processes"],
    forbiddenTerms: ["organelle", "organ", "photosynthesis", "enzyme", "circulatory", "genetic", "ecosystem", "cell membrane"],
  },
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function findSubjectProfile(subject: string) {
  const normalized = normalize(subject);

  for (const [key, profile] of Object.entries(SUBJECT_GUARDRAILS)) {
    if (normalized.includes(key)) {
      return profile;
    }
  }

  return null;
}

export function buildSubjectGuardrails(input: {
  subject: string;
  topic?: string | null;
  examBoard?: string | null;
  summary?: string | null;
  subtopics?: string[];
}) {
  const profile = findSubjectProfile(input.subject);
  const parts = [
    `Stay strictly inside the GCSE subject "${input.subject}".`,
    input.topic ? `The exact topic is "${input.topic}".` : "",
    input.examBoard ? `Use ${input.examBoard} wording and scope where relevant.` : "",
    input.summary ? `Topic summary: ${input.summary}` : "",
    input.subtopics?.length ? `Only cover these subtopics: ${input.subtopics.join(", ")}.` : "",
    profile?.allowedFocus?.length
      ? `Keep the content focused on ideas such as: ${profile.allowedFocus.join(", ")}.`
      : "",
    profile?.forbiddenTerms?.length
      ? `Do not mention or drift into unrelated areas such as: ${profile.forbiddenTerms.join(", ")}.`
      : "",
    "If any idea belongs to another subject, leave it out rather than guessing.",
  ];

  return parts.filter(Boolean).join("\n");
}

export function hasSubjectMismatch(input: {
  subject: string;
  text: string;
}) {
  const profile = findSubjectProfile(input.subject);
  if (!profile) {
    return false;
  }

  const normalizedText = normalize(input.text);
  return profile.forbiddenTerms.some((term) => normalizedText.includes(normalize(term)));
}
