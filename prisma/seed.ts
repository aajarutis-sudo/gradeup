import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

function readEnvValue(key: string) {
  const candidateFiles = [".env.local", ".env"];

  for (const fileName of candidateFiles) {
    const filePath = path.join(process.cwd(), fileName);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, "utf8");
    const line = content
      .split(/\r?\n/)
      .find((entry) => entry.trim().startsWith(`${key}=`));

    if (line) {
      return line.slice(line.indexOf("=") + 1).trim();
    }
  }

  return undefined;
}

const databaseUrl = process.env.DATABASE_URL ?? readEnvValue("DATABASE_URL");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set for seeding.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

type TopicBlueprint = {
  slug: string;
  title: string;
  summary: string;
  subtopics: string[];
};

type SubjectBlueprint = {
  slug: string;
  title: string;
  examBoard: string;
  color: string;
  description: string;
  topics: TopicBlueprint[];
};

function uniqueStrings(values: string[]) {
  return values.filter((value, index) => values.indexOf(value) === index);
}

function hashString(input: string) {
  return input.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}

function buildExpandedSubtopics(subject: SubjectBlueprint, topic: TopicBlueprint) {
  const context = `${subject.title} ${topic.title} ${topic.summary}`.toLowerCase();
  const extras: string[] = [];

  if (/(paper|writing|essay|analysis|comparison|speaking|listening|reading|translation|evaluation)/.test(context)) {
    extras.push("exam technique", "model responses");
  }

  if (/(practical|fieldwork|data|graphs|calculations|methods|variables)/.test(context)) {
    extras.push("methods and variables", "data analysis");
  }

  if (/(case study|examples|context|history|geography|literature|religious|classics)/.test(context)) {
    extras.push("named examples or context");
  }

  if (/(language|grammar|vocabulary|translation|speaking|listening|reading|writing)/.test(context)) {
    extras.push("key vocabulary and grammar");
  }

  if (/(biology|chemistry|physics|science|combined|cells|energy|forces|electricity|atomic)/.test(context)) {
    extras.push("required practical links");
  }

  if (/(business|economics|construction|engineering|design|media|digital|health|care)/.test(context)) {
    extras.push("real-world application");
  }

  if (/(math|algebra|probability|geometry|trigonometry|statistics)/.test(context)) {
    extras.push("worked examples", "common mistakes");
  }

  const fallbackExtras = [
    "key terminology",
    "common misconceptions",
    "applied questions",
    "revision checkpoints",
  ];

  const targetCount = 4 + (hashString(topic.slug) % 3);
  return uniqueStrings([...topic.subtopics, ...extras, ...fallbackExtras]).slice(0, targetCount);
}

const subjectBlueprints: SubjectBlueprint[] = [
  {
    slug: "english-language",
    title: "English Language",
    examBoard: "AQA",
    color: "#6366F1",
    description: "AQA 8700 Paper 1 and Paper 2 reading and writing skills with clear question-by-question revision.",
    topics: [
      { slug: "lang-paper-1-reading-fiction", title: "Paper 1: Reading fiction", summary: "Read extracts quickly, track what happens, and select the most useful evidence.", subtopics: ["retrieval", "inference", "short evidence selection"] },
      { slug: "lang-paper-1-language-analysis", title: "Paper 1: Language analysis", summary: "Analyse how language creates mood, viewpoint, and atmosphere with precise terminology.", subtopics: ["word choice", "imagery", "connotation"] },
      { slug: "lang-paper-1-structure", title: "Paper 1: Structure analysis", summary: "Explain shifts in focus, pacing, tension, and narrative movement.", subtopics: ["openings", "shifts", "endings"] },
      { slug: "lang-paper-1-descriptive-writing", title: "Paper 1: Descriptive writing", summary: "Craft vivid setting and mood descriptions with control and structure.", subtopics: ["sensory detail", "sentence variety", "paragraphing"] },
      { slug: "lang-paper-1-narrative-writing", title: "Paper 1: Narrative writing", summary: "Shape a short narrative with a clear opening, turning point, and controlled ending.", subtopics: ["plot shaping", "character viewpoint", "tension"] },
      { slug: "lang-paper-2-comparison", title: "Paper 2: Non-fiction comparison", summary: "Compare writers' viewpoints and methods across two sources without drifting into summary.", subtopics: ["viewpoint", "comparison", "evidence pairing"] },
      { slug: "lang-paper-2-articles", title: "Paper 2: Article writing", summary: "Write clear, persuasive articles with tone, audience, and structure under control.", subtopics: ["headline", "tone", "persuasion"] },
      { slug: "lang-paper-2-speeches", title: "Paper 2: Speech writing", summary: "Use direct address, rhetorical devices, and a clear line of argument in speeches.", subtopics: ["opening hook", "audience address", "call to action"] },
      { slug: "lang-paper-2-letters", title: "Paper 2: Letter writing", summary: "Adapt tone for formal and semi-formal letter tasks while staying persuasive.", subtopics: ["register", "paragraph flow", "purpose"] },
      { slug: "lang-technical-accuracy", title: "Technical accuracy", summary: "Improve spelling, punctuation, sentence control, and clarity for higher marks.", subtopics: ["sentence boundaries", "punctuation", "proofreading"] },
    ],
  },
  {
    slug: "english-literature",
    title: "English Literature",
    examBoard: "AQA",
    color: "#4F46E5",
    description: "AQA 8702 with Romeo and Juliet, A Christmas Carol, An Inspector Calls, and poetry.",
    topics: [
      { slug: "lit-romeo-juliet-characters", title: "Romeo and Juliet: characters", summary: "Track the motives, changes, and conflicts of Romeo, Juliet, Mercutio, Tybalt, and Friar Laurence.", subtopics: ["Romeo", "Juliet", "key contrasts"] },
      { slug: "lit-romeo-juliet-themes", title: "Romeo and Juliet: themes", summary: "Revise love, conflict, fate, violence, family pressure, and youth with strong textual support.", subtopics: ["love", "fate", "conflict"] },
      { slug: "lit-romeo-juliet-quotes", title: "Romeo and Juliet: quotation learning", summary: "Choose short, flexible quotations you can use across character and theme questions.", subtopics: ["short quotes", "methods", "memory links"] },
      { slug: "lit-christmas-carol-themes", title: "A Christmas Carol: themes", summary: "Understand social responsibility, greed, redemption, family, and change.", subtopics: ["greed", "redemption", "social duty"] },
      { slug: "lit-christmas-carol-context", title: "A Christmas Carol: context and methods", summary: "Connect Dickens' methods to Victorian inequality and his message about generosity.", subtopics: ["Victorian context", "symbolism", "narrative voice"] },
      { slug: "lit-inspector-calls-characters", title: "An Inspector Calls: characters", summary: "Revise the Birling family, the Inspector, and the way Priestley exposes their values.", subtopics: ["Mr Birling", "Sheila", "Inspector Goole"] },
      { slug: "lit-inspector-calls-themes", title: "An Inspector Calls: themes", summary: "Focus on responsibility, class, gender, capitalism, and generational tension.", subtopics: ["responsibility", "class", "generation gap"] },
      { slug: "lit-poetry-comparison", title: "Poetry anthology comparison", summary: "Compare ideas, methods, and viewpoints across anthology poems without listing techniques.", subtopics: ["comparison", "structure", "message"] },
      { slug: "lit-unseen-poetry", title: "Unseen poetry", summary: "Annotate fast, find the main message, and compare tone and method clearly.", subtopics: ["first reading", "tone", "comparison"] },
      { slug: "lit-essay-structure", title: "Essay structure and exam method", summary: "Build whole-text essays with a line of argument, precise evidence, and clear analysis.", subtopics: ["introduction", "paragraph structure", "judgement"] },
    ],
  },
  {
    slug: "business-studies",
    title: "Business Studies",
    examBoard: "Edexcel",
    color: "#06B6D4",
    description: "Edexcel 1BS0 with Theme 1 Investigating Small Business and Theme 2 Building a Business.",
    topics: [
      { slug: "business-enterprise", title: "Theme 1: Enterprise and entrepreneurship", summary: "Understand risk, reward, innovation, and the role of the entrepreneur.", subtopics: ["risk", "reward", "enterprise skills"] },
      { slug: "business-role", title: "Theme 1: The role of business", summary: "Revise customer needs, market gaps, added value, and business activity.", subtopics: ["customer needs", "market gap", "added value"] },
      { slug: "business-objectives", title: "Theme 1: Business aims and objectives", summary: "Explain why businesses set aims and how objectives shape decisions.", subtopics: ["aims", "SMART objectives", "trade-offs"] },
      { slug: "business-market-research", title: "Theme 1: Market research", summary: "Use primary and secondary research to understand customers and reduce risk.", subtopics: ["primary research", "secondary research", "sampling"] },
      { slug: "business-segmentation", title: "Theme 1: Market segmentation", summary: "Divide the market clearly and match products to the right customers.", subtopics: ["demographic", "geographic", "behavioural"] },
      { slug: "business-marketing-mix", title: "Theme 1: Marketing mix", summary: "Apply product, price, promotion, and place to realistic business scenarios.", subtopics: ["product", "price", "promotion"] },
      { slug: "business-finance", title: "Theme 1: Finance", summary: "Revise costs, revenue, profit, cash flow, and sources of finance.", subtopics: ["revenue and costs", "cash flow", "finance options"] },
      { slug: "business-operations", title: "Theme 1: Operations", summary: "Choose production methods, manage stock, and improve quality in small firms.", subtopics: ["production methods", "stock control", "quality"] },
      { slug: "business-human-resources", title: "Theme 1: Human resources", summary: "Recruit, train, motivate, and organise staff effectively.", subtopics: ["recruitment", "training", "motivation"] },
      { slug: "business-growth", title: "Theme 2: Growth", summary: "Understand internal and external growth, expansion, and the risks of scaling up.", subtopics: ["organic growth", "external growth", "risk"] },
      { slug: "business-globalisation", title: "Theme 2: Globalisation", summary: "Explain imports, exports, global supply chains, and wider competition.", subtopics: ["imports and exports", "supply chains", "competition"] },
      { slug: "business-ethics", title: "Theme 2: Ethics and the environment", summary: "Judge ethical decisions, sustainability pressures, and business reputation.", subtopics: ["ethics", "environment", "reputation"] },
    ],
  },
  {
    slug: "combined-science",
    title: "Combined Science",
    examBoard: "OCR",
    color: "#F59E0B",
    description: "OCR J260H higher with biology, chemistry, physics, and mixed combined coverage.",
    topics: [
      { slug: "combined-biology-cells", title: "Biology: Cell biology", summary: "Revise cell structure, microscopy, transport, and specialised cells.", subtopics: ["animal and plant cells", "microscopy", "transport"] },
      { slug: "combined-biology-organisation", title: "Biology: Organisation", summary: "Digestive system, enzymes, circulation, and plant transport.", subtopics: ["digestion", "enzymes", "circulation"] },
      { slug: "combined-biology-infection", title: "Biology: Infection and response", summary: "Understand pathogens, immune response, vaccination, and treatment.", subtopics: ["pathogens", "immune system", "vaccination"] },
      { slug: "combined-biology-bioenergetics", title: "Biology: Bioenergetics", summary: "Compare photosynthesis and respiration with practical interpretation.", subtopics: ["photosynthesis", "respiration", "limiting factors"] },
      { slug: "combined-biology-homeostasis", title: "Biology: Homeostasis and response", summary: "Revise nervous coordination, hormones, and kidney function.", subtopics: ["nervous system", "hormones", "kidneys"] },
      { slug: "combined-biology-inheritance", title: "Biology: Inheritance and evolution", summary: "Genes, genetic inheritance, evolution, and natural selection.", subtopics: ["DNA", "inheritance", "evolution"] },
      { slug: "combined-chemistry-atomic", title: "Chemistry: Atomic structure", summary: "Revise atoms, elements, compounds, isotopes, and electron arrangement.", subtopics: ["atoms", "isotopes", "electronic structure"] },
      { slug: "combined-chemistry-bonding", title: "Chemistry: Bonding", summary: "Compare ionic, covalent, and metallic bonding and their linked properties.", subtopics: ["ionic", "covalent", "metallic"] },
      { slug: "combined-chemistry-quantitative", title: "Chemistry: Quantitative chemistry", summary: "Use moles, equations, and concentration in short and extended questions.", subtopics: ["moles", "equations", "concentration"] },
      { slug: "combined-chemistry-changes", title: "Chemistry: Chemical changes", summary: "Study acids, reactivity, electrolysis, and practical observations.", subtopics: ["acids and alkalis", "reactivity", "electrolysis"] },
      { slug: "combined-physics-energy", title: "Physics: Energy", summary: "Energy stores, transfers, efficiency, and calculations.", subtopics: ["stores", "transfers", "efficiency"] },
      { slug: "combined-physics-electricity", title: "Physics: Electricity", summary: "Circuits, current, potential difference, resistance, and power.", subtopics: ["circuits", "resistance", "power"] },
      { slug: "combined-physics-waves", title: "Physics: Waves", summary: "Wave properties, EM spectrum, and required interpretation skills.", subtopics: ["wave speed", "EM spectrum", "applications"] },
      { slug: "combined-physics-forces", title: "Physics: Forces", summary: "Motion, Newton's laws, momentum, and graph interpretation.", subtopics: ["motion", "Newton's laws", "momentum"] },
      { slug: "combined-physics-particles", title: "Physics: Particle model and radioactivity", summary: "States of matter, density, radiation, and half-life.", subtopics: ["states of matter", "density", "radiation"] },
    ],
  },
  {
    slug: "geography",
    title: "Geography",
    examBoard: "AQA",
    color: "#10B981",
    description: "AQA 8035 with Paper 1 physical geography, Paper 2 human geography, and Paper 3 fieldwork.",
    topics: [
      { slug: "geo-paper-1-natural-hazards", title: "Paper 1: Natural hazards", summary: "Understand tectonic hazards, weather hazards, climate change, and management.", subtopics: ["tectonic hazards", "weather hazards", "climate change"] },
      { slug: "geo-paper-1-ecosystems", title: "Paper 1: Ecosystems", summary: "Study ecosystems, tropical rainforests, and cold environments.", subtopics: ["ecosystems", "rainforests", "cold environments"] },
      { slug: "geo-paper-1-rivers", title: "Paper 1: Rivers", summary: "Explain river processes, landforms, flooding, hydrographs, and management.", subtopics: ["erosion and transport", "landforms", "flood management"] },
      { slug: "geo-paper-1-coasts", title: "Paper 1: Coasts", summary: "Revise coastal processes, landforms, erosion, and coastal management.", subtopics: ["wave action", "landforms", "management"] },
      { slug: "geo-paper-2-urban-issues", title: "Paper 2: Urban issues", summary: "Urban growth, opportunities, challenges, sustainability, and regeneration.", subtopics: ["urbanisation", "challenges", "regeneration"] },
      { slug: "geo-paper-2-economic-world", title: "Paper 2: Changing economic world", summary: "Development, inequality, economic change, and reducing the gap.", subtopics: ["development measures", "causes of inequality", "reducing the gap"] },
      { slug: "geo-paper-2-resources", title: "Paper 2: Resource management", summary: "Food, water, and energy supply and the pressure on resources.", subtopics: ["food", "water", "energy"] },
      { slug: "geo-paper-3-fieldwork", title: "Paper 3: Fieldwork methods", summary: "Know how to collect, present, analyse, and evaluate fieldwork data.", subtopics: ["data collection", "presentation", "evaluation"] },
      { slug: "geo-paper-3-skills", title: "Paper 3: Geographical skills", summary: "Use maps, graphs, statistics, and decision-making booklet skills confidently.", subtopics: ["maps", "graphs", "statistics"] },
      { slug: "geo-case-studies", title: "Case studies and named examples", summary: "Keep named examples accurate and flexible across all three papers.", subtopics: ["physical examples", "human examples", "linking evidence"] },
    ],
  },
  {
    slug: "computer-science",
    title: "Computer Science",
    examBoard: "OCR",
    color: "#3B82F6",
    description: "OCR J277 with Computer Systems and Computational Thinking, Algorithms, and Programming.",
    topics: [
      { slug: "cs-paper-1-cpu", title: "Paper 1: CPU and systems architecture", summary: "Understand CPU components, the fetch-decode-execute cycle, and performance.", subtopics: ["CPU components", "FDE cycle", "performance"] },
      { slug: "cs-paper-1-memory", title: "Paper 1: Memory and storage", summary: "Compare primary and secondary storage, units, and data capacity.", subtopics: ["RAM and ROM", "secondary storage", "units"] },
      { slug: "cs-paper-1-networks", title: "Paper 1: Networks", summary: "Revise network types, topologies, hardware, and protocols.", subtopics: ["topologies", "hardware", "protocols"] },
      { slug: "cs-paper-1-security", title: "Paper 1: Cyber security", summary: "Study threats, vulnerabilities, prevention, and secure system design.", subtopics: ["threats", "prevention", "authentication"] },
      { slug: "cs-paper-1-software", title: "Paper 1: Systems software", summary: "Operating systems, utility software, and translation software.", subtopics: ["operating systems", "utilities", "translators"] },
      { slug: "cs-paper-2-algorithms", title: "Paper 2: Algorithms", summary: "Use decomposition, abstraction, flowcharts, and pseudocode accurately.", subtopics: ["flowcharts", "pseudocode", "abstraction"] },
      { slug: "cs-paper-2-programming", title: "Paper 2: Programming concepts", summary: "Variables, selection, iteration, arrays, strings, and subroutines.", subtopics: ["selection", "iteration", "arrays"] },
      { slug: "cs-paper-2-boolean", title: "Paper 2: Boolean logic", summary: "Understand logic gates, truth tables, and logic expressions.", subtopics: ["AND OR NOT", "truth tables", "expressions"] },
      { slug: "cs-paper-2-data", title: "Paper 2: Data representation", summary: "Binary, hexadecimal, character sets, images, and sound representation.", subtopics: ["binary", "hex", "media representation"] },
      { slug: "cs-paper-2-testing", title: "Paper 2: Testing and debugging", summary: "Trace code, identify faults, and improve inefficient solutions.", subtopics: ["trace tables", "testing", "debugging"] },
    ],
  },
  {
    slug: "mathematics",
    title: "Mathematics",
    examBoard: "Edexcel",
    color: "#2563EB",
    description: "Edexcel 1MA1 Higher with Paper 1 non-calculator and Papers 2 and 3 calculator content.",
    topics: [
      { slug: "math-number", title: "Number", summary: "Fractions, decimals, percentages, powers, standard form, and surds.", subtopics: ["fractions", "percentages", "surds"] },
      { slug: "math-algebra-expressions", title: "Algebra: expressions and equations", summary: "Simplify expressions, solve equations, rearrange formulae, and work with identities.", subtopics: ["expressions", "equations", "rearranging"] },
      { slug: "math-algebra-graphs", title: "Algebra: graphs and functions", summary: "Interpret straight-line graphs, quadratics, and graph transformations.", subtopics: ["linear graphs", "quadratics", "transformations"] },
      { slug: "math-ratio", title: "Ratio and proportion", summary: "Use direct proportion, inverse proportion, scale factors, and compound measures.", subtopics: ["ratio", "direct proportion", "inverse proportion"] },
      { slug: "math-geometry-angles", title: "Geometry: angles and constructions", summary: "Angle facts, polygon rules, loci, and constructions.", subtopics: ["angle rules", "polygons", "constructions"] },
      { slug: "math-geometry-circles", title: "Geometry: circles", summary: "Circle theorems, circumference, area, arcs, and sectors.", subtopics: ["circle theorems", "area", "sectors"] },
      { slug: "math-trigonometry", title: "Geometry: trigonometry", summary: "Use SOHCAHTOA, exact values, and trigonometry in 2D and 3D contexts.", subtopics: ["SOHCAHTOA", "exact values", "3D trig"] },
      { slug: "math-probability", title: "Probability", summary: "Tree diagrams, Venn diagrams, frequency trees, and expected outcomes.", subtopics: ["probability scale", "tree diagrams", "Venn diagrams"] },
      { slug: "math-statistics", title: "Statistics", summary: "Averages, scatter graphs, histograms, cumulative frequency, and box plots.", subtopics: ["averages", "histograms", "cumulative frequency"] },
      { slug: "math-problem-solving", title: "Higher problem solving", summary: "Break down unfamiliar questions, connect methods, and justify each step.", subtopics: ["multi-step problems", "modelling", "checking answers"] },
    ],
  },
  {
    slug: "biology",
    title: "Biology",
    examBoard: "AQA",
    color: "#22C55E",
    description: "AQA GCSE Biology with clear unit-by-unit revision across the specification.",
    topics: [
      { slug: "bio-cell-biology", title: "Cell biology", summary: "Cell structure, microscopy, transport, and specialised cells.", subtopics: ["cell structure", "microscopy", "transport"] },
      { slug: "bio-organisation", title: "Organisation", summary: "Digestive system, enzymes, circulation, and plant transport.", subtopics: ["digestion", "enzymes", "circulation"] },
      { slug: "bio-infection-response", title: "Infection and response", summary: "Pathogens, immunity, vaccination, and medicine.", subtopics: ["pathogens", "immune system", "vaccination"] },
      { slug: "bio-bioenergetics", title: "Bioenergetics", summary: "Photosynthesis, respiration, and practical interpretation.", subtopics: ["photosynthesis", "respiration", "limiting factors"] },
      { slug: "bio-homeostasis", title: "Homeostasis and response", summary: "Nervous coordination, hormones, and kidney function.", subtopics: ["nervous system", "hormones", "kidneys"] },
      { slug: "bio-inheritance", title: "Inheritance, variation and evolution", summary: "DNA, genes, inheritance, evolution, and natural selection.", subtopics: ["DNA", "inheritance", "evolution"] },
      { slug: "bio-ecology", title: "Ecology", summary: "Ecosystems, food webs, biodiversity, and human impact.", subtopics: ["ecosystems", "food webs", "biodiversity"] },
      { slug: "bio-required-practicals", title: "Required practicals and data skills", summary: "Method, variables, graphs, and conclusion writing across Biology practicals.", subtopics: ["variables", "graph analysis", "evaluation"] },
    ],
  },
  {
    slug: "chemistry",
    title: "Chemistry",
    examBoard: "Edexcel",
    color: "#F97316",
    description: "Edexcel GCSE Chemistry with the major content areas broken into compact revision units.",
    topics: [
      { slug: "chem-atomic-structure", title: "Atomic structure", summary: "Atoms, elements, compounds, isotopes, and electronic structure.", subtopics: ["atoms", "isotopes", "electronic structure"] },
      { slug: "chem-bonding-structure", title: "Bonding and structure", summary: "Ionic, covalent, and metallic bonding with linked properties.", subtopics: ["ionic", "covalent", "metallic"] },
      { slug: "chem-calculations", title: "Calculations in chemistry", summary: "Moles, equations, masses, and concentration.", subtopics: ["moles", "equations", "concentration"] },
      { slug: "chem-chemical-changes", title: "Chemical changes", summary: "Reactivity, electrolysis, acids, alkalis, and salts.", subtopics: ["reactivity", "electrolysis", "acids and salts"] },
      { slug: "chem-energy-rates", title: "Energy changes and rates", summary: "Exothermic and endothermic reactions, bond energy, and rates.", subtopics: ["energy changes", "bond energy", "rates"] },
      { slug: "chem-organic", title: "Organic chemistry", summary: "Hydrocarbons, cracking, alkanes, alkenes, and polymers.", subtopics: ["hydrocarbons", "cracking", "polymers"] },
      { slug: "chem-atmosphere-resources", title: "Atmosphere and resources", summary: "Earth's atmosphere, climate change, water treatment, recycling, and sustainability.", subtopics: ["atmosphere", "climate change", "resources"] },
      { slug: "chem-practicals", title: "Required practicals and analysis", summary: "Methods, variables, processing results, and judging reliability.", subtopics: ["methods", "graphs", "evaluation"] },
    ],
  },
  {
    slug: "physics",
    title: "Physics",
    examBoard: "OCR",
    color: "#38BDF8",
    description: "OCR GCSE Physics with the core units laid out for quick, compact revision.",
    topics: [
      { slug: "phy-energy", title: "Energy", summary: "Energy stores, transfers, work done, power, and efficiency.", subtopics: ["stores", "transfers", "efficiency"] },
      { slug: "phy-electricity", title: "Electricity", summary: "Circuits, current, potential difference, resistance, and power.", subtopics: ["circuits", "resistance", "power"] },
      { slug: "phy-particle-model", title: "Particle model of matter", summary: "States of matter, density, pressure, and thermal behaviour.", subtopics: ["states of matter", "density", "pressure"] },
      { slug: "phy-atomic-structure", title: "Atomic structure", summary: "Radiation, nuclear decay, half-life, and risk.", subtopics: ["radiation", "half-life", "risk"] },
      { slug: "phy-forces", title: "Forces", summary: "Motion, Newton's laws, momentum, and moments.", subtopics: ["motion", "Newton's laws", "momentum"] },
      { slug: "phy-waves", title: "Waves", summary: "Wave properties, reflection, refraction, and the EM spectrum.", subtopics: ["wave speed", "reflection", "EM spectrum"] },
      { slug: "phy-magnetism-space", title: "Magnetism and space", summary: "Magnetic fields, electromagnetism, solar system, and stars.", subtopics: ["magnetism", "electromagnetism", "space"] },
      { slug: "phy-practicals", title: "Practical skills and calculations", summary: "Equations, graphs, method planning, and data interpretation.", subtopics: ["equations", "graphs", "evaluation"] },
    ],
  },
  {
    slug: "history",
    title: "History",
    examBoard: "AQA",
    color: "#6B7280",
    description: "AQA GCSE History with broad unit coverage for thematic, period, and depth studies.",
    topics: [
      { slug: "history-source-analysis", title: "Source analysis", summary: "Use provenance, content, and purpose to judge the value of sources.", subtopics: ["content", "provenance", "utility"] },
      { slug: "history-interpretations", title: "Interpretations", summary: "Compare historical interpretations and explain why views differ.", subtopics: ["comparison", "context", "evaluation"] },
      { slug: "history-thematic-study", title: "Thematic study", summary: "Trace change and continuity across a long historical period.", subtopics: ["change", "continuity", "significance"] },
      { slug: "history-period-study", title: "Period study", summary: "Understand events, causes, consequences, and turning points in a specific period.", subtopics: ["causes", "events", "consequences"] },
      { slug: "history-depth-study", title: "Modern depth study", summary: "Build secure knowledge of a focused modern historical topic.", subtopics: ["key events", "factors", "judgement"] },
      { slug: "history-historic-environment", title: "Historic environment", summary: "Use context, source material, and site-specific detail effectively.", subtopics: ["site knowledge", "sources", "context"] },
      { slug: "history-essay-writing", title: "Extended answer writing", summary: "Develop balanced, evidence-led paragraphs and supported judgement.", subtopics: ["paragraph structure", "evidence", "judgement"] },
      { slug: "history-chronology", title: "Chronology and revision method", summary: "Organise dates, sequences, and causal chains without getting overwhelmed.", subtopics: ["timelines", "causation", "revision planning"] },
    ],
  },
  {
    slug: "religious-studies",
    title: "Religious Studies",
    examBoard: "AQA",
    color: "#A855F7",
    description: "AQA GCSE Religious Studies with beliefs, practices, ethics, and philosophy organised into compact units.",
    topics: [
      { slug: "rs-beliefs", title: "Beliefs", summary: "Core beliefs, teachings, and authority within the religions studied.", subtopics: ["nature of God", "authority", "afterlife"] },
      { slug: "rs-practices", title: "Practices", summary: "Worship, prayer, festivals, and the role of the community.", subtopics: ["worship", "prayer", "festivals"] },
      { slug: "rs-ethics-marriage-family", title: "Ethics: Marriage and family", summary: "Family life, relationships, gender issues, and sexual ethics.", subtopics: ["family", "relationships", "gender"] },
      { slug: "rs-ethics-peace-conflict", title: "Ethics: Peace and conflict", summary: "War, justice, forgiveness, and reconciliation.", subtopics: ["war", "justice", "forgiveness"] },
      { slug: "rs-ethics-crime-punishment", title: "Ethics: Crime and punishment", summary: "Causes of crime, aims of punishment, and justice.", subtopics: ["crime", "punishment", "justice"] },
      { slug: "rs-ethics-life-issues", title: "Ethics: Life issues", summary: "Abortion, euthanasia, animal rights, and the value of life.", subtopics: ["abortion", "euthanasia", "animal rights"] },
      { slug: "rs-philosophy", title: "Philosophy and arguments", summary: "Arguments about existence, evil and suffering, and revelation.", subtopics: ["arguments for God", "evil and suffering", "revelation"] },
      { slug: "rs-evaluation", title: "Evaluation and essay writing", summary: "Build balanced arguments and supported judgements in 12-mark answers.", subtopics: ["agree and disagree", "evidence", "judgement"] },
    ],
  },
  {
    slug: "french",
    title: "French",
    examBoard: "AQA",
    color: "#2563EB",
    description: "AQA GCSE French with themes and language skills laid out for steady revision.",
    topics: [
      { slug: "fr-identity-culture", title: "Theme 1: Identity and culture", summary: "Family, relationships, free time, customs, and everyday life.", subtopics: ["family", "free time", "customs"] },
      { slug: "fr-local-area", title: "Theme 2: Local area, holiday and travel", summary: "Home town, holidays, directions, and travel experiences.", subtopics: ["local area", "holidays", "travel"] },
      { slug: "fr-global-issues", title: "Theme 3: Global issues", summary: "Environment, poverty, volunteering, and wider-world issues.", subtopics: ["environment", "charity", "global issues"] },
      { slug: "fr-school-future", title: "Theme 4: School and future plans", summary: "School life, rules, work, ambitions, and future study or careers.", subtopics: ["school", "work", "future plans"] },
      { slug: "fr-listening", title: "Listening skills", summary: "Pick out detail, gist, tense changes, and distractors in listening tasks.", subtopics: ["gist", "detail", "distractors"] },
      { slug: "fr-speaking", title: "Speaking skills", summary: "Build confident answers, extend ideas, and handle role-play and photo card tasks.", subtopics: ["role play", "photo card", "general conversation"] },
      { slug: "fr-reading", title: "Reading skills", summary: "Decode unfamiliar vocabulary using context and secure grammar knowledge.", subtopics: ["translation", "context clues", "grammar"] },
      { slug: "fr-writing", title: "Writing skills", summary: "Use multiple tenses, opinions, and justified detail in clear written answers.", subtopics: ["multiple tenses", "opinions", "accuracy"] },
    ],
  },
  {
    slug: "spanish",
    title: "Spanish",
    examBoard: "Edexcel",
    color: "#DC2626",
    description: "Edexcel GCSE Spanish with key themes and skills broken into compact revision units.",
    topics: [
      { slug: "sp-identity-culture", title: "Identity and culture", summary: "Family, friends, daily routines, and lifestyle vocabulary.", subtopics: ["family", "daily life", "lifestyle"] },
      { slug: "sp-local-area", title: "Local area and holidays", summary: "Places in town, directions, travel, and holiday experiences.", subtopics: ["town", "directions", "holidays"] },
      { slug: "sp-school", title: "School", summary: "Subjects, teachers, rules, and school experience.", subtopics: ["subjects", "opinions", "school routine"] },
      { slug: "sp-future-aspirations", title: "Future aspirations", summary: "Jobs, ambitions, work experience, and plans.", subtopics: ["jobs", "ambitions", "work experience"] },
      { slug: "sp-global-dimension", title: "International and global dimension", summary: "Environment, social issues, and global citizenship.", subtopics: ["environment", "social issues", "world issues"] },
      { slug: "sp-listening-reading", title: "Listening and reading", summary: "Use context, cognates, and grammar to improve comprehension.", subtopics: ["cognates", "detail", "grammar clues"] },
      { slug: "sp-speaking", title: "Speaking", summary: "Answer spontaneously, justify opinions, and maintain clear pronunciation.", subtopics: ["opinions", "fluency", "pronunciation"] },
      { slug: "sp-writing", title: "Writing and translation", summary: "Control tense, word order, and key structures in extended responses.", subtopics: ["tenses", "translation", "extended writing"] },
    ],
  },
  {
    slug: "german",
    title: "German",
    examBoard: "OCR",
    color: "#111827",
    description: "OCR GCSE German with accessible units covering the key themes and exam skills.",
    topics: [
      { slug: "de-personal-world", title: "Personal world", summary: "Family, identity, interests, and everyday routines.", subtopics: ["family", "interests", "routine"] },
      { slug: "de-local-world", title: "Local and wider world", summary: "Town, region, travel, and holidays.", subtopics: ["town", "travel", "holidays"] },
      { slug: "de-school-jobs", title: "School and jobs", summary: "School life, future study, jobs, and ambitions.", subtopics: ["school", "jobs", "ambitions"] },
      { slug: "de-global-issues", title: "Global issues", summary: "Environment, healthy living, and wider social issues.", subtopics: ["environment", "health", "society"] },
      { slug: "de-grammar-core", title: "Core grammar", summary: "Word order, cases, verbs, and tense control.", subtopics: ["word order", "cases", "tenses"] },
      { slug: "de-listening-reading", title: "Listening and reading", summary: "Track key details accurately and manage unfamiliar vocabulary.", subtopics: ["detail", "inference", "context"] },
      { slug: "de-speaking", title: "Speaking", summary: "Respond clearly with confident pronunciation and justified opinions.", subtopics: ["role play", "conversation", "opinions"] },
      { slug: "de-writing", title: "Writing", summary: "Build accurate, well-structured extended answers with range.", subtopics: ["accuracy", "structure", "range"] },
    ],
  },
  {
    slug: "art-design",
    title: "Art and Design",
    examBoard: "AQA",
    color: "#F43F5E",
    description: "AQA GCSE Art and Design with compact units for developing ideas, refining work, and responding critically.",
    topics: [
      { slug: "art-develop-ideas", title: "Developing ideas", summary: "Generate intentions, research artists, and explore possible directions.", subtopics: ["intentions", "research", "experimentation"] },
      { slug: "art-record-observations", title: "Recording observations", summary: "Draw, photograph, and annotate observations with purpose.", subtopics: ["drawing", "photography", "annotation"] },
      { slug: "art-experiment-media", title: "Experimenting with media", summary: "Try materials, techniques, and processes in a purposeful way.", subtopics: ["materials", "techniques", "processes"] },
      { slug: "art-refine-work", title: "Refining work", summary: "Improve pieces using reflection, comparison, and technical control.", subtopics: ["refinement", "control", "comparison"] },
      { slug: "art-personal-response", title: "Personal response", summary: "Create final outcomes that connect clearly to intentions and development.", subtopics: ["final piece", "connections", "quality"] },
      { slug: "art-critical-studies", title: "Critical studies", summary: "Write about artists and links between context, style, and personal work.", subtopics: ["artist analysis", "context", "links"] },
      { slug: "art-portfolio", title: "Portfolio building", summary: "Organise coursework so it feels coherent, selective, and well presented.", subtopics: ["selection", "presentation", "progression"] },
      { slug: "art-exam-project", title: "Externally set assignment", summary: "Manage the exam project from stimulus choice to timed final outcome.", subtopics: ["stimulus", "preparation", "timed outcome"] },
    ],
  },
  {
    slug: "music",
    title: "Music",
    examBoard: "Edexcel",
    color: "#0F766E",
    description: "Edexcel GCSE Music with listening, appraising, performing, and composing in manageable revision units.",
    topics: [
      { slug: "music-elements", title: "Elements of music", summary: "Pitch, duration, dynamics, tempo, texture, timbre, and structure.", subtopics: ["pitch", "rhythm", "texture"] },
      { slug: "music-instrumental", title: "Instrumental music", summary: "Recognise styles, features, and contexts within set works and wider listening.", subtopics: ["set works", "features", "context"] },
      { slug: "music-vocal", title: "Vocal music", summary: "Identify texture, form, and expressive devices in vocal music.", subtopics: ["texture", "form", "expression"] },
      { slug: "music-fusions", title: "Music for stage and screen", summary: "Understand how composers shape mood, character, and narrative.", subtopics: ["mood", "leitmotif", "structure"] },
      { slug: "music-popular", title: "Popular music and fusion", summary: "Revise common devices, harmony, rhythm, and production choices.", subtopics: ["harmony", "rhythm", "production"] },
      { slug: "music-composing", title: "Composing", summary: "Plan, develop, and refine compositions with clear musical intention.", subtopics: ["motifs", "development", "structure"] },
      { slug: "music-performing", title: "Performing", summary: "Improve technical control, expression, and confidence in performances.", subtopics: ["accuracy", "expression", "fluency"] },
      { slug: "music-appraising", title: "Appraising exam skills", summary: "Use musical vocabulary accurately when listening and writing.", subtopics: ["vocabulary", "listening", "written response"] },
    ],
  },
  {
    slug: "drama",
    title: "Drama",
    examBoard: "OCR",
    color: "#FB7185",
    description: "OCR GCSE Drama with practical and written elements organised into clear revision units.",
    topics: [
      { slug: "drama-roles-responsibilities", title: "Roles and responsibilities", summary: "Understand actors, directors, designers, and how productions are shaped.", subtopics: ["actor", "director", "designer"] },
      { slug: "drama-devising", title: "Devising drama", summary: "Create original drama from stimuli with strong intentions and evaluation.", subtopics: ["stimuli", "devising", "evaluation"] },
      { slug: "drama-rehearsal-techniques", title: "Rehearsal techniques", summary: "Use rehearsal methods to develop character, relationships, and staging.", subtopics: ["hot seating", "improvisation", "blocking"] },
      { slug: "drama-performance-skills", title: "Performance skills", summary: "Voice, movement, space, and interaction choices in performance.", subtopics: ["voice", "movement", "space"] },
      { slug: "drama-design", title: "Design concepts", summary: "Lighting, sound, costume, set, and how design supports meaning.", subtopics: ["lighting", "sound", "set and costume"] },
      { slug: "drama-set-text", title: "Set text study", summary: "Analyse characters, intentions, staging, and audience impact.", subtopics: ["characters", "staging", "audience impact"] },
      { slug: "drama-live-theatre", title: "Live theatre review", summary: "Write clear evaluations of performance and design choices.", subtopics: ["evaluation", "evidence", "judgement"] },
      { slug: "drama-exam-writing", title: "Written exam method", summary: "Turn practical understanding into focused written answers.", subtopics: ["terminology", "structure", "evidence"] },
    ],
  },
  {
    slug: "physical-education",
    title: "Physical Education",
    examBoard: "AQA",
    color: "#16A34A",
    description: "AQA GCSE PE with anatomy, physiology, psychology, socio-cultural issues, and performance support.",
    topics: [
      { slug: "pe-anatomy-physiology", title: "Applied anatomy and physiology", summary: "Bones, muscles, movement, cardio-respiratory system, and energy use.", subtopics: ["skeleton", "muscles", "cardio-respiratory system"] },
      { slug: "pe-physical-training", title: "Physical training", summary: "Fitness components, training methods, warm-up, cool-down, and injury prevention.", subtopics: ["fitness components", "training methods", "injury prevention"] },
      { slug: "pe-sports-psychology", title: "Sports psychology", summary: "Motivation, guidance, feedback, and mental preparation.", subtopics: ["motivation", "guidance", "feedback"] },
      { slug: "pe-socio-cultural", title: "Socio-cultural influences", summary: "Participation, media, sponsorship, ethics, and commercialisation.", subtopics: ["participation", "media", "ethics"] },
      { slug: "pe-health-fitness", title: "Health, fitness and wellbeing", summary: "Healthy lifestyles, diet, and the links between exercise and wellbeing.", subtopics: ["health", "diet", "wellbeing"] },
      { slug: "pe-analysis-evaluation", title: "Analysis and evaluation of performance", summary: "Use strengths, weaknesses, and action plans in applied questions.", subtopics: ["strengths", "weaknesses", "action plans"] },
      { slug: "pe-practical-performance", title: "Practical performance", summary: "Improve skill execution, tactics, and consistency in practical activities.", subtopics: ["skills", "tactics", "consistency"] },
      { slug: "pe-exam-skills", title: "Exam skills", summary: "Apply knowledge to sporting examples and extended written responses.", subtopics: ["application", "command words", "extended writing"] },
    ],
  },
  {
    slug: "design-technology",
    title: "Design and Technology",
    examBoard: "OCR",
    color: "#F59E0B",
    description: "OCR GCSE Design and Technology with technical principles, designing, and making broken into manageable units.",
    topics: [
      { slug: "dt-core-technical", title: "Core technical principles", summary: "Materials, systems, energy, and new technologies in design.", subtopics: ["materials", "systems", "new technologies"] },
      { slug: "dt-specialist-technical", title: "Specialist technical principles", summary: "Manufacturing processes, material properties, and specialist knowledge.", subtopics: ["manufacturing", "properties", "tools and equipment"] },
      { slug: "dt-designing", title: "Designing and communicating", summary: "Generate ideas, annotate clearly, and communicate design intent.", subtopics: ["idea generation", "annotation", "communication"] },
      { slug: "dt-development", title: "Developing ideas", summary: "Model, test, and refine designs using feedback and evidence.", subtopics: ["modelling", "testing", "refinement"] },
      { slug: "dt-making", title: "Making principles", summary: "Plan manufacture, use tools safely, and control quality.", subtopics: ["planning", "manufacture", "quality control"] },
      { slug: "dt-evaluation", title: "Evaluation", summary: "Judge products against user needs, specifications, and sustainability.", subtopics: ["user needs", "specifications", "sustainability"] },
      { slug: "dt-nea", title: "NEA project", summary: "Manage coursework from identifying a context through to final prototype.", subtopics: ["context", "prototype", "portfolio"] },
      { slug: "dt-exam-technique", title: "Exam technique", summary: "Answer design questions with precise technical language and applied reasoning.", subtopics: ["technical language", "application", "reasoning"] },
    ],
  },
  {
    slug: "economics",
    title: "Economics",
    examBoard: "Edexcel",
    color: "#84CC16",
    description: "Edexcel GCSE Economics with foundations, markets, government, and the global economy laid out clearly.",
    topics: [
      { slug: "econ-basic-concepts", title: "Basic economic ideas", summary: "Scarcity, choice, opportunity cost, and factors of production.", subtopics: ["scarcity", "choice", "opportunity cost"] },
      { slug: "econ-demand-supply", title: "Demand, supply and markets", summary: "Market forces, price changes, and shifts in demand or supply.", subtopics: ["demand", "supply", "market equilibrium"] },
      { slug: "econ-business-production", title: "Business, production and productivity", summary: "Costs, revenues, competition, and productivity.", subtopics: ["costs", "competition", "productivity"] },
      { slug: "econ-labour-market", title: "Labour market", summary: "Wages, skills, unemployment, and labour market change.", subtopics: ["wages", "unemployment", "skills"] },
      { slug: "econ-government-objectives", title: "Government objectives", summary: "Inflation, growth, unemployment, and the role of government.", subtopics: ["inflation", "growth", "government policy"] },
      { slug: "econ-tax-spending", title: "Taxation and government spending", summary: "How tax and public spending affect the economy.", subtopics: ["taxation", "public spending", "redistribution"] },
      { slug: "econ-global-economy", title: "International trade and the global economy", summary: "Imports, exports, exchange rates, and global interdependence.", subtopics: ["trade", "exchange rates", "global economy"] },
      { slug: "econ-data-interpretation", title: "Data interpretation and judgement", summary: "Read economic data and make balanced evaluative decisions.", subtopics: ["graphs", "data", "evaluation"] },
    ],
  },
  {
    slug: "construction",
    title: "Construction",
    examBoard: "Edexcel",
    color: "#D97706",
    description: "Construction and the built environment with technical knowledge, planning, safety, and practical understanding.",
    topics: [
      { slug: "construction-industry", title: "The construction industry", summary: "Roles, sectors, project teams, and the structure of the industry.", subtopics: ["sectors", "roles", "project teams"] },
      { slug: "construction-health-safety", title: "Health and safety", summary: "Safe working practice, PPE, hazards, and risk control on site.", subtopics: ["hazards", "PPE", "risk control"] },
      { slug: "construction-materials", title: "Construction materials", summary: "Properties, uses, and selection of common building materials.", subtopics: ["timber", "metals", "concrete"] },
      { slug: "construction-technology", title: "Construction technology", summary: "Substructures, superstructures, and common building methods.", subtopics: ["foundations", "walls", "roofs"] },
      { slug: "construction-services", title: "Building services", summary: "Water, drainage, heating, and electrical services in buildings.", subtopics: ["water", "drainage", "electrics"] },
      { slug: "construction-sustainability", title: "Sustainability in construction", summary: "Environmental impact, efficient design, and responsible use of resources.", subtopics: ["efficiency", "environment", "responsible sourcing"] },
      { slug: "construction-planning", title: "Planning and communication", summary: "Interpret drawings, plan work, and communicate clearly on projects.", subtopics: ["drawings", "planning", "communication"] },
      { slug: "construction-evaluation", title: "Inspection and evaluation", summary: "Check quality, identify problems, and suggest suitable improvements.", subtopics: ["inspection", "quality", "improvement"] },
    ],
  },
  {
    slug: "engineering",
    title: "Engineering",
    examBoard: "AQA",
    color: "#7C3AED",
    description: "Engineering with technical principles, systems, processes, and project-based problem solving.",
    topics: [
      { slug: "eng-design-process", title: "Engineering design process", summary: "Identify requirements, generate ideas, and refine engineering solutions.", subtopics: ["requirements", "ideas", "refinement"] },
      { slug: "eng-materials", title: "Materials and components", summary: "Choose appropriate materials and understand their properties.", subtopics: ["metals", "polymers", "properties"] },
      { slug: "eng-mechanical-systems", title: "Mechanical systems", summary: "Levers, gears, motion, forces, and mechanical advantage.", subtopics: ["levers", "gears", "motion"] },
      { slug: "eng-electrical-systems", title: "Electrical and electronic systems", summary: "Circuits, control, sensors, and system behaviour.", subtopics: ["circuits", "control", "sensors"] },
      { slug: "eng-manufacturing", title: "Manufacturing processes", summary: "Plan production, use tools, and understand batch or one-off manufacture.", subtopics: ["processes", "tools", "production types"] },
      { slug: "eng-quality-control", title: "Quality control", summary: "Tolerance, testing, inspection, and continuous improvement.", subtopics: ["tolerance", "testing", "inspection"] },
      { slug: "eng-sustainability", title: "Sustainability and ethics", summary: "Consider environmental impact and ethical engineering decisions.", subtopics: ["environment", "ethics", "resource use"] },
      { slug: "eng-project-work", title: "Project work and evaluation", summary: "Manage engineering projects and evaluate how well they solve the brief.", subtopics: ["planning", "iteration", "evaluation"] },
    ],
  },
  {
    slug: "health-social-care",
    title: "Health and Social Care",
    examBoard: "Edexcel",
    color: "#EC4899",
    description: "Health and Social Care with human development, care values, and service provision in student-friendly units.",
    topics: [
      { slug: "hsc-human-growth", title: "Human growth and development", summary: "Physical, intellectual, emotional, and social development across life stages.", subtopics: ["life stages", "development", "factors"] },
      { slug: "hsc-life-events", title: "Life events and change", summary: "Major life changes and the support people may need.", subtopics: ["life events", "support", "impact"] },
      { slug: "hsc-health-wellbeing", title: "Health and wellbeing", summary: "Physical, social, and emotional wellbeing and what shapes it.", subtopics: ["wellbeing", "lifestyle", "factors"] },
      { slug: "hsc-services", title: "Health and social care services", summary: "Different services, settings, and professionals involved in care.", subtopics: ["services", "settings", "professionals"] },
      { slug: "hsc-care-values", title: "Care values", summary: "Respect, dignity, confidentiality, and person-centred care.", subtopics: ["respect", "dignity", "confidentiality"] },
      { slug: "hsc-communication", title: "Communication in care", summary: "Barriers, methods, and how communication supports individuals.", subtopics: ["communication methods", "barriers", "support"] },
      { slug: "hsc-practical-application", title: "Applied scenarios", summary: "Use case studies to recommend suitable care and support.", subtopics: ["case studies", "recommendations", "justification"] },
      { slug: "hsc-coursework-exam", title: "Assessment skills", summary: "Prepare for both controlled assessment and exam-style questions.", subtopics: ["coursework", "exam technique", "evidence"] },
    ],
  },
  {
    slug: "media-studies",
    title: "Media Studies",
    examBoard: "WJEC",
    color: "#0EA5E9",
    description: "WJEC GCSE Media Studies with key media language, audiences, industries, and representation covered clearly.",
    topics: [
      { slug: "media-language", title: "Media language", summary: "Camera, layout, typography, sound, editing, and symbolic meaning.", subtopics: ["visual codes", "audio codes", "layout"] },
      { slug: "media-representation", title: "Representation", summary: "How groups, ideas, and identities are represented in media products.", subtopics: ["stereotypes", "identity", "messages"] },
      { slug: "media-audience", title: "Audience", summary: "Targeting, interpretation, appeal, and audience response.", subtopics: ["target audience", "appeal", "response"] },
      { slug: "media-industries", title: "Media industries", summary: "Ownership, regulation, funding, and distribution.", subtopics: ["ownership", "regulation", "distribution"] },
      { slug: "media-print-online", title: "Print and online products", summary: "Analyse magazines, newspapers, websites, and social platforms.", subtopics: ["magazines", "newspapers", "online media"] },
      { slug: "media-film-tv", title: "Film and television", summary: "Study conventions, narrative, and audience positioning in moving image texts.", subtopics: ["genre", "narrative", "audience positioning"] },
      { slug: "media-production", title: "Media production", summary: "Plan and create a product that fits an intended audience and brief.", subtopics: ["planning", "production", "audience fit"] },
      { slug: "media-evaluation", title: "Evaluation and exam writing", summary: "Compare products and justify interpretations with evidence.", subtopics: ["comparison", "evidence", "evaluation"] },
    ],
  },
  {
    slug: "classics",
    title: "Classics",
    examBoard: "AQA",
    color: "#92400E",
    description: "Classics with myth, literature, culture, and ancient-world context presented in compact units.",
    topics: [
      { slug: "classics-myth-religion", title: "Myth and religion", summary: "Key myths, gods, rituals, and beliefs in the ancient world.", subtopics: ["gods", "rituals", "myths"] },
      { slug: "classics-literature", title: "Classical literature", summary: "Read and analyse translated texts with confidence and context.", subtopics: ["plot", "character", "theme"] },
      { slug: "classics-society", title: "Ancient society", summary: "Daily life, social structure, and values in Greece and Rome.", subtopics: ["social structure", "daily life", "values"] },
      { slug: "classics-politics-war", title: "Politics and war", summary: "Power, leadership, conflict, and military life.", subtopics: ["leadership", "conflict", "power"] },
      { slug: "classics-art-architecture", title: "Art and architecture", summary: "Visual culture, temples, public buildings, and symbolism.", subtopics: ["art", "architecture", "symbolism"] },
      { slug: "classics-historical-context", title: "Historical context", summary: "Place texts and sources in the wider ancient-world setting.", subtopics: ["context", "sources", "interpretation"] },
      { slug: "classics-source-analysis", title: "Source analysis", summary: "Interpret ancient evidence carefully and explain what it shows.", subtopics: ["source utility", "inference", "limitations"] },
      { slug: "classics-essay-skills", title: "Essay and short-answer skills", summary: "Write concise, evidence-based responses and stronger longer answers.", subtopics: ["evidence", "structure", "judgement"] },
    ],
  },
  {
    slug: "environmental-science",
    title: "Environmental Science",
    examBoard: "Edexcel",
    color: "#65A30D",
    description: "Environmental Science with ecosystems, resources, pollution, and sustainability organised into practical revision units.",
    topics: [
      { slug: "env-ecosystems", title: "Ecosystems", summary: "Food chains, nutrient cycles, habitats, and ecosystem balance.", subtopics: ["food chains", "cycles", "habitats"] },
      { slug: "env-biodiversity", title: "Biodiversity and conservation", summary: "Threats to biodiversity and how conservation strategies help.", subtopics: ["threats", "conservation", "protection"] },
      { slug: "env-pollution", title: "Pollution", summary: "Air, water, and land pollution plus monitoring and control.", subtopics: ["air pollution", "water pollution", "control"] },
      { slug: "env-climate-change", title: "Climate change", summary: "Greenhouse gases, impacts, and mitigation strategies.", subtopics: ["greenhouse gases", "impacts", "mitigation"] },
      { slug: "env-energy-resources", title: "Energy and resources", summary: "Renewable and non-renewable resources and sustainable use.", subtopics: ["renewables", "non-renewables", "resource use"] },
      { slug: "env-water-food", title: "Water and food security", summary: "Agriculture, water supply, and pressures on essential resources.", subtopics: ["water supply", "agriculture", "security"] },
      { slug: "env-fieldwork", title: "Fieldwork and data collection", summary: "Sampling, measurement, reliability, and analysing environmental data.", subtopics: ["sampling", "measurement", "analysis"] },
      { slug: "env-decision-making", title: "Decision making and evaluation", summary: "Balance environmental, social, and economic viewpoints in longer answers.", subtopics: ["trade-offs", "evaluation", "justification"] },
    ],
  },
  {
    slug: "digital-media",
    title: "Digital Media",
    examBoard: "Edexcel",
    color: "#14B8A6",
    description: "Digital Media with planning, creation, audience, and evaluation presented in a compact course map.",
    topics: [
      { slug: "dm-media-products", title: "Media products and purpose", summary: "Understand what digital products are designed to do and who they serve.", subtopics: ["purpose", "platforms", "audience"] },
      { slug: "dm-design-principles", title: "Design principles", summary: "Layout, colour, typography, and composition choices in digital products.", subtopics: ["layout", "colour", "typography"] },
      { slug: "dm-planning", title: "Planning and pre-production", summary: "Plan content, storyboards, structures, and production workflow.", subtopics: ["storyboards", "planning", "workflow"] },
      { slug: "dm-production-tools", title: "Production tools", summary: "Use software tools effectively to create and edit content.", subtopics: ["editing", "software tools", "assets"] },
      { slug: "dm-audience-branding", title: "Audience and branding", summary: "Target users clearly and build a consistent brand identity.", subtopics: ["audience", "branding", "consistency"] },
      { slug: "dm-legal-ethical", title: "Legal and ethical issues", summary: "Copyright, privacy, representation, and safe digital practice.", subtopics: ["copyright", "privacy", "representation"] },
      { slug: "dm-testing-refining", title: "Testing and refining", summary: "Use feedback and testing to improve digital products.", subtopics: ["feedback", "testing", "improvement"] },
      { slug: "dm-evaluation", title: "Evaluation", summary: "Judge how effectively a final product meets the brief and audience needs.", subtopics: ["brief", "success criteria", "evaluation"] },
    ],
  },
];

function createLessonContent(subject: SubjectBlueprint, topic: TopicBlueprint) {
  return `# ${topic.title}

## Specification focus
${subject.examBoard} ${subject.title}

## What this unit is about
${topic.summary}

## What you need to remember
- Keep the explanation tied to ${subject.examBoard} exam wording and command words.
- Learn the core terms first, then move into examples, methods, or applied questions.
- Revise this unit in smaller chunks so it feels manageable.

## Core revision notes
- Start with the big idea behind ${topic.title} and explain it in one sentence.
- Build out the topic through these sub-areas: ${topic.subtopics.join(", ")}.
- Link each point back to how it could appear in a GCSE exam question.

## Exam advice
- Use precise terminology.
- Show method or reasoning, not just the final answer.
- When the question asks you to explain, build a clear chain rather than listing facts.

## Quick self-check
- What are the most important facts or steps here?
- What mistake do students often make?
- How would ${topic.title} appear in a real exam question?`;
}

function createQuestions(subject: SubjectBlueprint, topic: TopicBlueprint) {
  const expandedSubtopics = buildExpandedSubtopics(subject, topic);
  const primarySubtopic = expandedSubtopics[0] ?? topic.title.toLowerCase();
  const secondarySubtopic = expandedSubtopics[1] ?? "core terminology";
  const tertiarySubtopic = expandedSubtopics[2] ?? "application";

  return [
    {
      prompt: `Which revision focus best matches ${topic.title}?`,
      optionA: topic.summary,
      optionB: `A broad overview of ${subject.title} without specific reference to ${topic.title}.`,
      optionC: `A narrow focus on ${secondarySubtopic} only, without linking it back to the whole unit.`,
      optionD: `A summary that focuses mostly on exam timing rather than the content of ${topic.title}.`,
      correctAnswer: topic.summary,
      explanation: `A strong revision answer identifies the central purpose of ${topic.title}.`,
      questionText: `Which revision focus best matches ${topic.title}?`,
      marks: 2,
      sampleAnswer: topic.summary,
      markingCriteria: JSON.stringify({ identification: 1, subject_accuracy: 1 }),
    },
    {
      prompt: `What is the strongest first revision move for ${topic.title}?`,
      optionA: `Read the unit once, then move straight on without checking ${primarySubtopic}.`,
      optionB: `Break ${topic.title} into smaller parts, retrieve what you remember, then apply it to an exam-style question.`,
      optionC: `Memorise one definition from ${secondarySubtopic} and assume the rest will follow.`,
      optionD: `Revise only the easiest example from ${tertiarySubtopic} and leave the wider topic for later.`,
      correctAnswer: `Break ${topic.title} into smaller parts, retrieve what you remember, then apply it to an exam-style question.`,
      explanation: "The best revision combines recall with application rather than passive copying.",
      questionText: `What is the strongest first revision move for ${topic.title}?`,
      marks: 3,
      sampleAnswer: `Break ${topic.title} into smaller parts, retrieve what you remember, then apply it to an exam-style question.`,
      markingCriteria: JSON.stringify({ method: 1, application: 1, reasoning: 1 }),
    },
    {
      prompt: `Which subtopic is most closely linked to ${topic.title}?`,
      optionA: primarySubtopic,
      optionB: `${subject.title.toLowerCase()} as a whole`,
      optionC: `A different unit from ${subject.title}`,
      optionD: "General exam confidence only",
      correctAnswer: primarySubtopic,
      explanation: `${primarySubtopic} is one of the core building blocks inside ${topic.title}.`,
      questionText: `Which subtopic is most closely linked to ${topic.title}?`,
      marks: 2,
      sampleAnswer: primarySubtopic,
      markingCriteria: JSON.stringify({ retrieval: 1, topic_link: 1 }),
    },
    {
      prompt: `A student is revising ${topic.title}. Which approach is most effective?`,
      optionA: `Use ${primarySubtopic}, ${secondarySubtopic}, and exam questions together in short focused blocks.`,
      optionB: `Spend the whole session rewriting the title of ${topic.title} until it feels familiar.`,
      optionC: `Revise only one sentence from the summary and avoid examples.`,
      optionD: `Skip application until the final week before the exam.`,
      correctAnswer: `Use ${primarySubtopic}, ${secondarySubtopic}, and exam questions together in short focused blocks.`,
      explanation: "Combining content knowledge with retrieval and application produces stronger long-term revision.",
      questionText: `A student is revising ${topic.title}. Which approach is most effective?`,
      marks: 3,
      sampleAnswer: `Use ${primarySubtopic}, ${secondarySubtopic}, and exam questions together in short focused blocks.`,
      markingCriteria: JSON.stringify({ planning: 1, retrieval: 1, application: 1 }),
    },
    {
      prompt: `Why should ${topic.title} be revised through smaller linked chunks instead of one huge block?`,
      optionA: `Because linking ${primarySubtopic}, ${secondarySubtopic}, and ${tertiarySubtopic} helps understanding and recall stick.`,
      optionB: "Because it removes the need to answer exam questions later on.",
      optionC: "Because revision is only useful when it feels easy and repetitive.",
      optionD: "Because the exam board expects students to memorise isolated facts with no connections.",
      correctAnswer: `Because linking ${primarySubtopic}, ${secondarySubtopic}, and ${tertiarySubtopic} helps understanding and recall stick.`,
      explanation: "Students remember and apply topics better when they connect related ideas rather than treating them as isolated facts.",
      questionText: `Why should ${topic.title} be revised through smaller linked chunks instead of one huge block?`,
      marks: 4,
      sampleAnswer: `Because linking ${primarySubtopic}, ${secondarySubtopic}, and ${tertiarySubtopic} helps understanding and recall stick.`,
      markingCriteria: JSON.stringify({ understanding: 1, recall: 1, application: 1, reasoning: 1 }),
    },
  ];
}

function createFlashcards(subject: SubjectBlueprint, topic: TopicBlueprint) {
  const expandedSubtopics = buildExpandedSubtopics(subject, topic);
  return [
    {
      question: `What is the main focus of ${topic.title}?`,
      answer: topic.summary,
    },
    {
      question: `Which exam board is this unit aligned to?`,
      answer: `${subject.examBoard} ${subject.title}`,
    },
    {
      question: `Name one key subtopic inside ${topic.title}.`,
      answer: expandedSubtopics[0] ?? topic.subtopics[0] ?? topic.title,
    },
    {
      question: `Which subtopic would you revise after ${expandedSubtopics[0] ?? "the first key idea"}?`,
      answer: expandedSubtopics[1] ?? topic.subtopics[1] ?? expandedSubtopics[0] ?? topic.title,
    },
    {
      question: `What is another useful angle to revise in ${topic.title}?`,
      answer: expandedSubtopics[2] ?? topic.subtopics[2] ?? expandedSubtopics[1] ?? topic.title,
    },
    {
      question: `How should you split revision for ${topic.title} into smaller chunks?`,
      answer: `Work through ${expandedSubtopics.slice(0, 3).join(", ")}, then finish with an exam-style question.`,
    },
    {
      question: `What kind of exam thinking does ${topic.title} usually need?`,
      answer: `Use precise terminology, link ideas clearly, and apply ${topic.title} to exam-style questions rather than just copying notes.`,
    },
    {
      question: `What is one common mistake when revising ${topic.title}?`,
      answer: `Treating ${topic.title} as one big block instead of breaking it into linked subtopics and applying it in questions.`,
    },
    {
      question: `What should you do after revising the content in ${topic.title}?`,
      answer: `Test yourself with retrieval and exam questions so the knowledge becomes usable, not just familiar.`,
    },
    {
      question: `What does success look like in ${topic.title}?`,
      answer: `You can explain the main idea, connect the subtopics, and use them accurately in an exam answer.`,
    },
  ];
}

async function resetCurriculumData() {
  await prisma.quizAttemptAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.questionAnswer.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.userFocusArea.deleteMany();
  await prisma.userSubjectPrediction.deleteMany();
  await prisma.weaknessPrediction.deleteMany();
  await prisma.flashcard.deleteMany();
  await prisma.question.deleteMany();
  await prisma.subtopic.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.timedQuestion.deleteMany();
  await prisma.pastPaper.deleteMany();
  await prisma.userSubject.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.examBoard.deleteMany();
}

async function main() {
  console.log("🌱 Seeding GradeUp curriculum...");

  await resetCurriculumData();

  for (const boardName of ["AQA", "Edexcel", "OCR", "WJEC", "CCEA"]) {
    await prisma.examBoard.create({
      data: {
        name: boardName,
        slug: boardName.toLowerCase(),
      },
    });
  }

  for (const subjectBlueprint of subjectBlueprints) {
    const subject = await prisma.subject.create({
      data: {
        title: subjectBlueprint.title,
        name: subjectBlueprint.title,
        slug: subjectBlueprint.slug,
        examBoard: subjectBlueprint.examBoard,
        color: subjectBlueprint.color,
        description: subjectBlueprint.description,
      },
    });

    for (const [index, topicBlueprint] of subjectBlueprints
      .find((item) => item.slug === subjectBlueprint.slug)!
      .topics.entries()) {
      const topic = await prisma.topic.create({
        data: {
          subjectId: subject.id,
          title: topicBlueprint.title,
          slug: topicBlueprint.slug,
          summary: topicBlueprint.summary,
          orderIndex: index,
          examBoard: subjectBlueprint.examBoard,
          estimatedMins: 30,
          questionCount: 2,
        },
      });

      await prisma.lesson.create({
        data: {
          topicId: topic.id,
          title: `Lesson notes: ${topicBlueprint.title}`,
          content: createLessonContent(subjectBlueprint, topicBlueprint),
        },
      });

      for (const [subtopicIndex, subtopicTitle] of buildExpandedSubtopics(subjectBlueprint, topicBlueprint).entries()) {
        await prisma.subtopic.create({
          data: {
            topicId: topic.id,
            title: subtopicTitle,
            summary: `${subtopicTitle} within ${topicBlueprint.title} for ${subjectBlueprint.examBoard} ${subjectBlueprint.title}.`,
            orderIndex: subtopicIndex,
          },
        });
      }

      for (const flashcard of createFlashcards(subjectBlueprint, topicBlueprint)) {
        await prisma.flashcard.create({
          data: {
            topicId: topic.id,
            question: flashcard.question,
            answer: flashcard.answer,
          },
        });
      }

      for (const [questionIndex, question] of createQuestions(subjectBlueprint, topicBlueprint).entries()) {
        await prisma.question.create({
          data: {
            subjectId: subject.id,
            topicId: topic.id,
            prompt: question.prompt,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
            questionText: question.questionText,
            marks: question.marks,
            sampleAnswer: question.sampleAnswer,
            markingCriteria: question.markingCriteria,
            difficulty: questionIndex + 1,
            examBoard: subjectBlueprint.examBoard,
            year: 2024,
          },
        });
      }
    }

    console.log(`  ✓ ${subjectBlueprint.title} (${subjectBlueprint.examBoard})`);
  }

  console.log(`✨ Done. Seeded ${subjectBlueprints.length} subjects with real units and lessons.`);
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
