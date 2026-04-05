import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

const subjectBlueprints = [
  {
    slug: "english-literature",
    name: "English Literature",
    examBoard: "AQA",
    color: "#4F46E5",
    description: "AQA 8702 Paper 1 and Paper 2 with Romeo and Juliet, A Christmas Carol, and An Inspector Calls.",
    topics: [
      ["lit-paper-1-shakespeare", "Paper 1: Shakespeare response skills", "Build a full Romeo and Juliet response using quotations, methods, and clear argument."],
      ["romeo-juliet-characters", "Romeo and Juliet: character journeys", "Track Romeo, Juliet, Mercutio, Tybalt, Friar Laurence, and the Nurse across the play."],
      ["romeo-juliet-themes", "Romeo and Juliet: themes and ideas", "Revise conflict, love, fate, family pressure, youth, and violence."],
      ["romeo-juliet-context", "Romeo and Juliet: context and dramatic form", "Link patriarchal society, honour, and tragedy conventions to key scenes."],
      ["lit-paper-1-novel", "Paper 1: 19th-century novel response skills", "Write secure paragraphs on character, theme, setting, and structure."],
      ["christmas-carol-character-theme", "A Christmas Carol: character and theme", "Study Scrooge, the Cratchits, the ghosts, and ideas about change and generosity."],
      ["christmas-carol-context", "A Christmas Carol: context and methods", "Connect Victorian inequality, social duty, symbolism, and Dickens' message."],
      ["inspector-calls-characters", "An Inspector Calls: character study", "Revise how each member of the Birling family is presented and challenged."],
      ["inspector-calls-themes", "An Inspector Calls: responsibility and class", "Focus on social responsibility, class division, gender, and generational tension."],
      ["inspector-calls-structure", "An Inspector Calls: structure and dramatic method", "Use stagecraft, entrances, revelations, and final twist effectively."],
      ["lit-paper-2-modern-poetry", "Paper 2: modern text and poetry comparison", "Move clearly between ideas, evidence, and comparison points under timed conditions."],
      ["lit-paper-2-unseen", "Paper 2: unseen poetry", "Annotate quickly, track tone and structure, and compare poems without overcomplicating it."],
    ],
  },
  {
    slug: "english-language",
    name: "English Language",
    examBoard: "AQA",
    color: "#6366F1",
    description: "AQA 8700 Paper 1 and Paper 2 reading and writing skills.",
    topics: [
      ["lang-paper-1-q1", "Paper 1 Question 1", "Pick direct retrieval points accurately and avoid over-explaining."],
      ["lang-paper-1-q2", "Paper 1 Question 2", "Analyse language choices with precise terminology and effect."],
      ["lang-paper-1-q3", "Paper 1 Question 3", "Explain structure through shifts, focus, and narrative movement."],
      ["lang-paper-1-q4", "Paper 1 Question 4", "Evaluate critically using a clear view and carefully chosen evidence."],
      ["lang-paper-1-q5", "Paper 1 Question 5", "Craft descriptive or narrative writing with control, imagery, and structure."],
      ["lang-paper-2-q1-q2", "Paper 2 Questions 1 and 2", "Select statements accurately and summarise differences between viewpoints."],
      ["lang-paper-2-q3", "Paper 2 Question 3", "Compare writers' methods and attitudes across both sources."],
      ["lang-paper-2-q4", "Paper 2 Question 4", "Judge viewpoints confidently with comparison, inference, and evidence."],
      ["lang-paper-2-q5", "Paper 2 Question 5", "Write persuasive transactional pieces with clear tone and purpose."],
      ["lang-technical-accuracy", "Technical accuracy", "Improve spelling, punctuation, sentence control, and paragraphing."],
      ["lang-timed-planning", "Timed planning", "Use short planning windows to sharpen structure and keep answers focused."],
      ["lang-common-methods", "Core language methods", "Spot contrast, imagery, repetition, sentence variety, and rhetorical devices quickly."],
    ],
  },
  {
    slug: "business",
    name: "Business",
    examBoard: "Edexcel",
    color: "#06B6D4",
    description: "Edexcel 1BS0 Investigating Small Business.",
    topics: [
      ["business-enterprise", "Enterprise and entrepreneurship", "Understand entrepreneurship, risk, rewards, and enterprise skills."],
      ["business-role", "The role of business enterprise", "Revise customer needs, market gaps, and adding value."],
      ["business-aims", "Business aims and objectives", "Explain why businesses set aims and how objectives guide decisions."],
      ["business-market-research", "Market research", "Use primary and secondary research to reduce risk and understand customers."],
      ["business-segmentation", "Market segmentation", "Match products to customers using clear segmentation factors."],
      ["business-competitive-environment", "The competitive environment", "Study USP, competition, and changing market conditions."],
      ["business-marketing-mix", "The marketing mix", "Apply product, price, promotion, and place to small businesses."],
      ["business-finance", "Finance", "Cash flow, sources of finance, and break-even thinking for small firms."],
      ["business-operations", "Operations", "Choose production methods, manage stock, and improve quality."],
      ["business-human-resources", "Human resources", "Recruit staff, organise people, and motivate employees."],
      ["business-external-factors", "External influences", "Link legislation, the economy, and consumer trends to business decisions."],
      ["business-calculations", "Business calculations and interpretation", "Use percentages, averages, and simple formulas in context."],
      ["business-growth", "Theme 2: growth", "Understand business growth, expansion options, and the risks that come with scaling up."],
      ["business-globalisation", "Theme 2: globalisation", "Explain imports, exports, global supply chains, and wider market reach."],
      ["business-ethics", "Theme 2: ethics and the environment", "Judge ethical decisions, sustainability pressures, and business reputation."],
    ],
  },
  {
    slug: "biology",
    name: "Biology",
    examBoard: "AQA",
    color: "#22C55E",
    description: "GCSE Biology coverage built around the core specification areas for cell biology, organisation, infection, bioenergetics, homeostasis, inheritance, and ecology.",
    topics: [
      ["bio-cell-structure", "Cell Biology: cell structure", "Revise animal, plant, and bacterial cells, plus how specialised cells are adapted for their jobs."],
      ["bio-microscopy", "Cell Biology: microscopy", "Use light and electron microscopy ideas, magnification, and required practical method skills."],
      ["bio-cell-transport", "Cell Biology: cell transport", "Explain diffusion, osmosis, and active transport with accurate examples."],
      ["bio-digestive-system", "Organisation: digestive system", "Link organs, enzymes, bile, and absorption to digestion."],
      ["bio-enzymes", "Organisation: enzymes", "Understand enzyme action, factors affecting rate, and digestive enzyme roles."],
      ["bio-circulatory-system", "Organisation: circulatory system", "Revise the heart, blood vessels, blood components, and transport."],
      ["bio-plant-tissues", "Organisation: plant tissues", "Learn xylem, phloem, meristem tissue, and transport in plants."],
      ["bio-pathogens", "Infection and Response: pathogens", "Compare bacteria, viruses, fungi, and protists with examples of disease."],
      ["bio-immune-system", "Infection and Response: immune system", "Explain white blood cells, immune response, and vaccination."],
      ["bio-antibiotics", "Infection and Response: antibiotics", "Understand antibiotics, painkillers, resistance, and medicine testing."],
      ["bio-photosynthesis", "Bioenergetics: photosynthesis", "Revise the word equation, limiting factors, and plant adaptations."],
      ["bio-respiration", "Bioenergetics: respiration", "Compare aerobic and anaerobic respiration in plants and animals."],
      ["bio-nervous-system", "Homeostasis and Response: nervous system", "Link receptors, reflexes, the brain, and coordination."],
      ["bio-hormones", "Homeostasis and Response: hormonal coordination", "Explain endocrine glands, menstrual cycle control, and fertility treatments."],
      ["bio-kidney-function", "Homeostasis and Response: kidney function", "Revise water balance, kidney roles, and dialysis or transplant."],
      ["bio-dna-genes", "Inheritance: DNA and genes", "Understand DNA structure, genes, chromosomes, and protein synthesis basics."],
      ["bio-genetic-inheritance", "Inheritance: genetic inheritance", "Use genetic crosses, dominant-recessive ideas, and inherited disorders."],
      ["bio-evolution", "Inheritance: evolution and natural selection", "Explain variation, selection, and how species change over time."],
      ["bio-ecosystems", "Ecology: ecosystems", "Study biotic and abiotic factors, adaptations, and sampling."],
      ["bio-food-webs", "Ecology: food chains and food webs", "Track feeding relationships, trophic levels, and biomass ideas."],
      ["bio-biodiversity", "Ecology: biodiversity", "Understand why biodiversity matters and how it can be measured or protected."],
      ["bio-human-impact", "Ecology: human impact", "Evaluate pollution, deforestation, global warming, and conservation responses."],
    ],
  },
  {
    slug: "chemistry",
    name: "Chemistry",
    examBoard: "AQA",
    color: "#F97316",
    description: "GCSE Chemistry coverage across atomic structure, bonding, quantitative chemistry, chemical changes, energy, organic chemistry, atmosphere, and resources.",
    topics: [
      ["chem-atomic-basics", "Atomic Structure: atoms, elements, and compounds", "Secure the differences between atoms, elements, compounds, and mixtures."],
      ["chem-electron-configuration", "Atomic Structure: electron configuration", "Use shells and electronic structure to explain the periodic table."],
      ["chem-isotopes", "Atomic Structure: isotopes", "Understand isotopes, relative atomic mass, and why isotopes differ."],
      ["chem-ionic-bonding", "Bonding: ionic bonding", "Explain electron transfer, giant ionic lattices, and linked properties."],
      ["chem-covalent-bonding", "Bonding: covalent bonding", "Compare simple molecules, giant covalent structures, and shared electrons."],
      ["chem-metallic-bonding", "Bonding: metallic bonding", "Link metallic bonding to conductivity, malleability, and structure."],
      ["chem-moles", "Quantitative Chemistry: moles", "Use moles, formula mass, and reacting masses with confidence."],
      ["chem-equations", "Quantitative Chemistry: equations", "Balance symbol equations and extract quantitative information from them."],
      ["chem-concentration", "Quantitative Chemistry: concentration", "Calculate concentration and apply it in practical contexts."],
      ["chem-reactivity-series", "Chemical Changes: reactivity series", "Use the reactivity series to predict extraction and displacement."],
      ["chem-electrolysis", "Chemical Changes: electrolysis", "Explain electrolysis in molten and aqueous solutions."],
      ["chem-acids-bases", "Chemical Changes: acids and bases", "Revise neutralisation, salts, pH, and titration-style ideas."],
      ["chem-energy-changes", "Energy Changes: exothermic and endothermic", "Compare energy transfer in reactions and reaction profiles."],
      ["chem-bond-energy", "Energy Changes: bond energy", "Use bond energy ideas to explain why reactions release or absorb energy."],
      ["chem-hydrocarbons", "Organic Chemistry: hydrocarbons", "Understand crude oil, fractions, and hydrocarbon properties."],
      ["chem-cracking", "Organic Chemistry: cracking", "Explain cracking and why it is useful in industry."],
      ["chem-alkanes-alkenes", "Organic Chemistry: alkanes and alkenes", "Compare saturation, reactions, and polymer links."],
      ["chem-atmosphere", "Chemistry of the Atmosphere", "Track how Earth's atmosphere changed and what affects it today."],
      ["chem-climate-change", "Chemistry of the Atmosphere: climate change", "Link greenhouse gases, evidence, and consequences."],
      ["chem-water-treatment", "Using Resources: water treatment", "Understand potable water, waste water, and treatment steps."],
      ["chem-recycling", "Using Resources: recycling", "Evaluate recycling, corrosion prevention, and life cycle thinking."],
      ["chem-sustainability", "Using Resources: sustainability", "Judge how chemistry can support sustainable use of finite resources."],
    ],
  },
  {
    slug: "physics",
    name: "Physics",
    examBoard: "AQA",
    color: "#38BDF8",
    description: "GCSE Physics coverage across energy, electricity, waves, forces, space physics, particle model, and atomic structure.",
    topics: [
      ["phy-energy-stores", "Energy: stores and transfers", "Use the energy stores model and describe energy transfers clearly."],
      ["phy-efficiency", "Energy: efficiency", "Calculate efficiency and explain how energy waste can be reduced."],
      ["phy-circuits", "Electricity: circuits", "Understand current, potential difference, and basic circuit rules."],
      ["phy-resistance", "Electricity: resistance", "Explain resistance, IV characteristics, and factors affecting resistance."],
      ["phy-power", "Electricity: power", "Use power and energy equations in electrical contexts."],
      ["phy-wave-properties", "Waves: properties", "Revise wave speed, frequency, wavelength, and wave behaviours."],
      ["phy-em-spectrum", "Waves: electromagnetic spectrum", "Compare EM waves, uses, risks, and properties."],
      ["phy-motion", "Forces: motion", "Interpret motion graphs and use speed, velocity, and acceleration ideas."],
      ["phy-newtons-laws", "Forces: Newton's laws", "Apply Newton's laws to balanced and unbalanced forces."],
      ["phy-momentum", "Forces: momentum", "Use momentum and collisions to explain change in motion."],
      ["phy-solar-system", "Space Physics: solar system", "Revise orbital motion, seasons, and the structure of the solar system."],
      ["phy-life-cycle-stars", "Space Physics: life cycle of stars", "Track stellar evolution from nebula to final stages."],
      ["phy-states-of-matter", "Particle Model: states of matter", "Use particle theory to explain solids, liquids, gases, and changes of state."],
      ["phy-density", "Particle Model: density", "Calculate density and link it to particle arrangement."],
      ["phy-radiation", "Atomic Structure: radiation", "Compare alpha, beta, gamma, and nuclear decay."],
      ["phy-half-life", "Atomic Structure: half-life", "Use half-life ideas in calculations and decay interpretation."],
    ],
  },
  {
    slug: "combined-science",
    name: "Combined Science",
    examBoard: "OCR",
    color: "#F59E0B",
    description: "OCR Gateway / 21st Century Science J260H higher across biology, chemistry, physics, and combined papers.",
    topics: [
      ["bio-b1-cell-level-systems", "Biology B1: Cell-level systems", "Cell structure, microscopy, transport, and enzymes."],
      ["bio-b2-scaling-up", "Biology B2: Scaling up", "Organisation, exchange surfaces, transport systems, and plant tissues."],
      ["bio-b3-interactions", "Biology B3: Interactions and interdependence", "Ecosystems, food webs, competition, and biodiversity."],
      ["bio-b4-global-challenges", "Biology B4: Global challenges", "Disease, bioengineering, sustainability, and human impact."],
      ["chem-c1-particles", "Chemistry C1: Particles", "Atomic structure, periodic table, bonding, and structure."],
      ["chem-c2-analysis", "Chemistry C2: Analysis and synthesis", "Separations, reactions, formulae, and making useful substances."],
      ["chem-c3-materials", "Chemistry C3: Materials and mixtures", "Metals, polymers, earth resources, and fuel ideas."],
      ["chem-c4-global-challenges", "Chemistry C4: Global challenges", "Atmosphere, resources, sustainability, and industry."],
      ["phy-p1-matter", "Physics P1: Matter", "Particle model, density, pressure, and changes of state."],
      ["phy-p2-forces", "Physics P2: Forces", "Motion, forces, moments, and work done."],
      ["phy-p3-energy-light", "Physics P3: Energy, light, and waves", "Energy transfer, power, waves, and EM ideas."],
      ["phy-p4-electricity-space", "Physics P4: Electricity, magnetism, and space", "Circuits, magnetism, electromagnetism, and space."],
      ["combined-overview", "Combined higher overview", "Connect biology, chemistry, and physics ideas across mixed combined papers."],
    ],
  },
  {
    slug: "geography",
    name: "Geography",
    examBoard: "AQA",
    color: "#10B981",
    description: "AQA 8035 Paper 1, Paper 2, and Paper 3.",
    topics: [
      ["geo-paper-1-tectonic", "Paper 1: Tectonic hazards", "Causes, effects, responses, and management of earthquakes and volcanoes."],
      ["geo-paper-1-weather", "Paper 1: Weather hazards and climate change", "Global circulation, storms, heatwaves, and adapting to climate change."],
      ["geo-paper-1-ecosystems", "Paper 1: Ecosystems and tropical rainforests", "Interdependence, nutrient cycles, and rainforest management."],
      ["geo-paper-1-cold", "Paper 1: Cold environments", "Challenges, opportunities, and sustainable development in cold regions."],
      ["geo-paper-1-rivers", "Paper 1: Rivers", "Erosion, transport, deposition, landforms, hydrographs, and management."],
      ["geo-paper-1-coasts", "Paper 1: Coasts", "Wave action, coastal landforms, and hard or soft engineering."],
      ["geo-paper-2-urban", "Paper 2: Urban issues and challenges", "Urban growth, sustainability, regeneration, and city case studies."],
      ["geo-paper-2-changing-economy", "Paper 2: Changing economic world", "Development measures, inequality, and economic change."],
      ["geo-paper-2-resources", "Paper 2: Resource management", "Food, water, and energy supply and future pressures."],
      ["geo-paper-3-fieldwork", "Paper 3: Fieldwork", "Methods, data presentation, interpretation, and evaluation."],
      ["geo-paper-3-skills", "Paper 3: Geographical skills", "Maps, graphs, statistics, and decision-making booklet practice."],
      ["geo-case-studies", "Case studies and named examples", "Keep named examples sharp and flexible across all three papers."],
    ],
  },
  {
    slug: "computer-science",
    name: "Computer Science",
    examBoard: "OCR",
    color: "#3B82F6",
    description: "OCR J277 Computer Systems and Computational Thinking, Algorithms and Programming.",
    topics: [
      ["cs-paper-1-systems-architecture", "Paper 1: Systems architecture", "CPU components, fetch-decode-execute, and performance factors."],
      ["cs-paper-1-memory-storage", "Paper 1: Memory and storage", "Primary storage, secondary storage, data units, and file sizes."],
      ["cs-paper-1-networks", "Paper 1: Wired and wireless networks", "Topologies, hardware, protocols, and network performance."],
      ["cs-paper-1-security", "Paper 1: Network security", "Threats, vulnerabilities, malware, and preventative methods."],
      ["cs-paper-1-software", "Paper 1: Systems software", "Operating systems, utilities, and translation software."],
      ["cs-paper-1-ethics", "Paper 1: Ethical, legal, cultural, and environmental impacts", "Understand issues created by digital technology."],
      ["cs-paper-2-algorithms", "Paper 2: Algorithms", "Flowcharts, pseudocode, decomposition, abstraction, and logic."],
      ["cs-paper-2-programming-fundamentals", "Paper 2: Programming fundamentals", "Variables, sequence, selection, iteration, and arrays."],
      ["cs-paper-2-data-representation", "Paper 2: Data representation", "Binary, hexadecimal, characters, images, and sound data."],
      ["cs-paper-2-boolean", "Paper 2: Boolean logic", "Logic gates, truth tables, and simple logical systems."],
      ["cs-paper-2-testing", "Paper 2: Testing and debugging", "Trace code, predict output, and design strong test data."],
      ["cs-paper-2-programming-language", "Paper 2: Programming language techniques", "Use procedures, functions, validation, and file handling ideas."],
    ],
  },
  {
    slug: "mathematics",
    name: "Mathematics",
    examBoard: "Edexcel",
    color: "#EF4444",
    description: "Edexcel 1MA1H Higher Tier across Paper 1 non-calculator and Papers 2 and 3 calculator.",
    topics: [
      ["math-paper-1-number", "Paper 1: Number", "Fractions, percentages, indices, surds, standard form, and calculator-free fluency."],
      ["math-paper-1-algebra", "Paper 1: Algebra", "Expressions, equations, inequalities, sequences, and rearranging formulae."],
      ["math-paper-1-geometry", "Paper 1: Geometry and measures", "Angle rules, area, volume, similarity, and constructions."],
      ["math-paper-1-probability", "Paper 1: Statistics and probability", "Averages, spread, probability rules, and data interpretation."],
      ["math-paper-2-ratio", "Paper 2: Ratio and proportion", "Scale factors, compound measures, growth, and proportional reasoning."],
      ["math-paper-2-graphs", "Paper 2: Graphs and functions", "Linear, quadratic, reciprocal, and real-life graphs."],
      ["math-paper-2-trigonometry", "Paper 2: Trigonometry", "SOHCAHTOA, exact values, sine rule, cosine rule, and 3D problems."],
      ["math-paper-2-calculator", "Paper 2: Calculator strategy", "Choose efficient methods, estimate, and avoid accuracy slips."],
      ["math-paper-3-quadratics", "Paper 3: Quadratics and algebraic reasoning", "Factorising, completing the square, and solving with confidence."],
      ["math-paper-3-vectors-proofs", "Paper 3: Vectors and proof", "Reason clearly, justify steps, and use algebraic proof structure."],
      ["math-paper-3-statistics", "Paper 3: Advanced statistics and probability", "Tree diagrams, histograms, cumulative frequency, and box plots."],
      ["math-paper-3-problem-solving", "Paper 3: Higher problem solving", "Break multi-step questions down and check methods carefully."],
    ],
  },
  {
    slug: "history",
    name: "History",
    examBoard: "AQA",
    color: "#A16207",
    description: "GCSE History core coverage built around thematic study, period study, modern depth study, and historic environment skills.",
    topics: [
      ["history-thematic-study", "Thematic study", "Track continuity and change across a long period with clear chronology."],
      ["history-period-study", "Period study", "Understand key developments, causes, and consequences within a defined period."],
      ["history-modern-depth", "Modern depth study", "Revise detailed events, individuals, and interpretations from a modern depth unit."],
      ["history-historic-environment", "Historic environment", "Use the site or environment in context with careful source support."],
      ["history-source-analysis", "Source analysis", "Use provenance, content, and context to judge the usefulness of sources."],
      ["history-interpretations", "Interpretations", "Compare interpretations and explain why historians differ."],
      ["history-causation", "Causation", "Explain short-term and long-term causes without oversimplifying events."],
      ["history-consequence", "Consequence and significance", "Judge significance and consequence with balanced explanation."],
    ],
  },
  {
    slug: "religious-studies",
    name: "Religious Studies",
    examBoard: "AQA",
    color: "#7C3AED",
    description: "GCSE Religious Studies coverage across beliefs, practices, ethics, and philosophy.",
    topics: [
      ["rs-beliefs", "Beliefs", "Revise core beliefs, teachings, and their influence on believers."],
      ["rs-practices", "Practices", "Study worship, festivals, pilgrimage, and the role of prayer or community."],
      ["rs-ethics", "Ethics", "Evaluate ethical issues such as life, crime, punishment, peace, and justice."],
      ["rs-philosophy", "Philosophy", "Discuss arguments about existence, evil and suffering, and human purpose."],
      ["rs-evaluation", "Evaluation skills", "Build balanced agree-disagree paragraphs with religious evidence."],
    ],
  },
  {
    slug: "french",
    name: "French",
    examBoard: "AQA",
    color: "#2563EB",
    description: "GCSE French coverage across identity and culture, local area, global issues, and the four core language skills.",
    topics: [
      ["french-identity-culture", "Themes: identity and culture", "Revise family, relationships, free time, and cultural habits."],
      ["french-local-area", "Themes: local area", "Describe town, region, travel, and everyday local environment vocabulary."],
      ["french-global-issues", "Themes: global issues", "Talk about social problems, environment, and wider world concerns."],
      ["french-listening", "Skills: listening", "Use prediction, gist, and detail retrieval in listening practice."],
      ["french-speaking", "Skills: speaking", "Build confident answers for role play, photo card, and general conversation."],
      ["french-reading", "Skills: reading", "Translate, infer, and pull out meaning from short and longer French texts."],
      ["french-writing", "Skills: writing", "Write clearly with tenses, opinions, reasons, and accurate structures."],
      ["french-grammar", "Grammar and translation", "Practise core verbs, tense control, agreements, and translation routines."],
    ],
  },
];

const pastPaperBlueprints = {
  "english-literature": [
    {
      title: "Paper 1 practice set",
      paperCode: "AQA 8702/1",
      season: "June-style",
      year: 2024,
      durationMinutes: 105,
      questionFocus: "Romeo and Juliet plus A Christmas Carol extract and essay structure.",
      markSchemeNotes: "Reward a clear thesis, precise quotation use, analysis of methods, and contextual links that support the argument.",
    },
    {
      title: "Paper 2 practice set",
      paperCode: "AQA 8702/2",
      season: "June-style",
      year: 2023,
      durationMinutes: 135,
      questionFocus: "An Inspector Calls, poetry comparison, and unseen poetry practice.",
      markSchemeNotes: "Strong responses compare ideas clearly, analyse writer choices, and stay linked to the question throughout.",
    },
  ],
  "english-language": [
    {
      title: "Paper 1 practice set",
      paperCode: "AQA 8700/1",
      season: "June-style",
      year: 2024,
      durationMinutes: 105,
      questionFocus: "Reading section skills plus descriptive or narrative writing.",
      markSchemeNotes: "Marks come from precise reading, thoughtful method analysis, and controlled, purposeful writing.",
    },
    {
      title: "Paper 2 practice set",
      paperCode: "AQA 8700/2",
      season: "November-style",
      year: 2023,
      durationMinutes: 105,
      questionFocus: "Non-fiction comparison and persuasive writing.",
      markSchemeNotes: "Reward accurate comparison, secure evaluation, and a clear sense of audience and purpose in writing.",
    },
  ],
  business: [
    {
      title: "Investigating Small Business practice set",
      paperCode: "Edexcel 1BS0/01",
      season: "June-style",
      year: 2024,
      durationMinutes: 90,
      questionFocus: "Enterprise, marketing mix, finance, and operations in small business contexts.",
      markSchemeNotes: "Best answers apply business theory directly to the case, use chain reasoning, and justify final judgements.",
    },
    {
      title: "Small Business calculations set",
      paperCode: "Edexcel 1BS0 Calc",
      season: "Mock-style",
      year: 2023,
      durationMinutes: 45,
      questionFocus: "Break-even, cash flow, percentages, and interpreting business data.",
      markSchemeNotes: "Reward correct working, accurate interpretation, and links back to business consequences.",
    },
  ],
  "combined-science": [
    {
      title: "Biology and chemistry higher practice set",
      paperCode: "OCR J260H B/C",
      season: "June-style",
      year: 2024,
      durationMinutes: 90,
      questionFocus: "Cell biology, organisation, particles, bonding, and chemical changes.",
      markSchemeNotes: "Credit precise scientific vocabulary, correct process explanations, and methodical working for calculations.",
    },
    {
      title: "Physics and combined higher practice set",
      paperCode: "OCR J260H P/Combined",
      season: "June-style",
      year: 2023,
      durationMinutes: 90,
      questionFocus: "Forces, energy, electricity, and linked combined-science interpretation questions.",
      markSchemeNotes: "Reward clear use of equations, sensible units, and explanations that connect ideas rather than list facts.",
    },
  ],
  geography: [
    {
      title: "Paper 1 physical geography practice set",
      paperCode: "AQA 8035/1",
      season: "June-style",
      year: 2024,
      durationMinutes: 90,
      questionFocus: "Natural hazards, ecosystems, rivers, and coasts.",
      markSchemeNotes: "Top answers balance accurate process knowledge with well-placed case-study detail and clear structure.",
    },
    {
      title: "Paper 2 and 3 human/skills practice set",
      paperCode: "AQA 8035/2-3",
      season: "Mock-style",
      year: 2023,
      durationMinutes: 120,
      questionFocus: "Urban issues, changing economy, resource management, fieldwork, and geographical skills.",
      markSchemeNotes: "Reward data use, comparison, balanced judgement, and direct reference to sources or fieldwork evidence.",
    },
  ],
  "computer-science": [
    {
      title: "Paper 1 Computer Systems practice set",
      paperCode: "OCR J277/01",
      season: "June-style",
      year: 2024,
      durationMinutes: 90,
      questionFocus: "Architecture, memory, storage, networks, security, and systems software.",
      markSchemeNotes: "Best answers define key terms accurately, apply them clearly, and avoid vague everyday wording.",
    },
    {
      title: "Paper 2 Algorithms and Programming practice set",
      paperCode: "OCR J277/02",
      season: "June-style",
      year: 2023,
      durationMinutes: 90,
      questionFocus: "Algorithms, programming fundamentals, data representation, Boolean logic, and debugging.",
      markSchemeNotes: "Reward logical step-by-step reasoning, correct trace output, and secure use of pseudocode ideas.",
    },
  ],
  mathematics: [
    {
      title: "Paper 1 higher non-calculator practice set",
      paperCode: "Edexcel 1MA1/1H",
      season: "June-style",
      year: 2024,
      durationMinutes: 90,
      questionFocus: "Higher number, algebra, geometry, and non-calculator fluency.",
      markSchemeNotes: "Marks come from method as well as final answer, so clear working and accurate algebra are essential.",
    },
    {
      title: "Papers 2 and 3 higher calculator practice set",
      paperCode: "Edexcel 1MA1/2H-3H",
      season: "Mock-style",
      year: 2023,
      durationMinutes: 180,
      questionFocus: "Ratio, graphs, trigonometry, statistics, vectors, and multi-step problem solving.",
      markSchemeNotes: "Reward efficient calculator use, well-structured methods, and checking whether answers are sensible.",
    },
  ],
};

const pastPaperYears = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017];

function getPaperStructure(subjectBlueprint) {
  const tieredSubjects = new Set(["biology", "chemistry", "physics", "combined-science", "mathematics"]);
  const twoPaperSubjects = new Set(["english-literature", "english-language", "business", "computer-science", "history", "religious-studies", "french"]);
  const threePaperSubjects = new Set(["geography", "mathematics", "combined-science"]);

  const paperNumbers = threePaperSubjects.has(subjectBlueprint.slug)
    ? [1, 2, 3]
    : twoPaperSubjects.has(subjectBlueprint.slug)
      ? [1, 2]
      : [1, 2];

  const tierOptions = tieredSubjects.has(subjectBlueprint.slug) ? ["FOUNDATION", "HIGHER"] : ["NONE"];

  return { paperNumbers, tierOptions };
}

function getPaperSetFocus(subjectBlueprint, paperNumber) {
  const existingPapers = pastPaperBlueprints[subjectBlueprint.slug] ?? [];
  const matchingPaper = existingPapers[paperNumber - 1] ?? existingPapers[0];

  if (matchingPaper?.questionFocus) {
    return matchingPaper.questionFocus;
  }

  return `${subjectBlueprint.name} Paper ${paperNumber} core revision and exam practice.`;
}

function getPaperSetOverview(subjectBlueprint, paperNumber, tier) {
  const tierLabel = tier === "NONE" ? "" : `${tier.toLowerCase()} tier `;
  return `A ${tierLabel}${subjectBlueprint.examBoard} ${subjectBlueprint.name} Paper ${paperNumber} practice workspace with guided paper-viewing and mark-scheme review.`;
}

function getPaperSetTitle(subjectBlueprint, paperNumber, year, tier) {
  const tierSuffix = tier === "NONE" ? "" : ` ${tier.charAt(0)}${tier.slice(1).toLowerCase()}`;
  return `${subjectBlueprint.name} Paper ${paperNumber}${tierSuffix} ${year}`;
}

function createPaperViewerContent(subjectBlueprint, setTitle, paperNumber, year, tier, focus) {
  const tierText = tier === "NONE" ? "Standard paper" : `${tier.toLowerCase()} tier paper`;
  return `<article>
  <h1>${setTitle}</h1>
  <p><strong>${subjectBlueprint.examBoard}</strong> | ${tierText} | Year ${year}</p>
  <h2>Paper overview</h2>
  <p>${focus}</p>
  <h2>How to use this practice paper</h2>
  <ol>
    <li>Work through the paper in a calm exam setting.</li>
    <li>Use the timer if you want exam pressure or switch to untimed review.</li>
    <li>Hide the mark scheme until the end if you want a true practice run.</li>
  </ol>
  <h2>Suggested sections</h2>
  <p>Section A checks secure knowledge. Section B asks for application. Section C stretches explanation, analysis, or problem solving for Paper ${paperNumber}.</p>
  <h2>Student checklist</h2>
  <ul>
    <li>Read command words carefully.</li>
    <li>Show working or evidence clearly.</li>
    <li>Leave time at the end to review weak answers.</li>
  </ul>
</article>`;
}

function createMarkSchemeContent(subjectBlueprint, setTitle, focus) {
  return `<article>
  <h1>${setTitle} mark scheme</h1>
  <p><strong>Examiner focus:</strong> ${focus}</p>
  <h2>What strong answers do</h2>
  <ul>
    <li>Answer the exact command word, not a different version of the question.</li>
    <li>Use accurate subject knowledge and precise vocabulary.</li>
    <li>Show method, structure, or evidence clearly so marks can be awarded.</li>
    <li>Keep explanations linked tightly to the paper focus.</li>
  </ul>
  <h2>Self-marking prompts</h2>
  <ol>
    <li>Which marks were for knowledge?</li>
    <li>Which marks were for method, explanation, or evaluation?</li>
    <li>What would improve the answer in one sentence?</li>
  </ol>
  <p>This practice mark scheme is written for GradeUp students using ${subjectBlueprint.examBoard} exam-style expectations.</p>
</article>`;
}

function createPastPaperPractice(subjectSlug, paperCode, questionFocus) {
  const practiceMap = {
    "AQA 8702/1": {
      practicePrompt:
        "Section A: Write one Shakespeare essay on how conflict shapes a turning point in Romeo and Juliet, using one printed extract and the play as a whole. Section B: Write one essay on how Dickens presents change and responsibility in A Christmas Carol. Spend 12 minutes planning quotation choices before you write.",
      markSchemePoints:
        "Establish a clear argument from the opening line. Use short quotations that are analysed closely. Link dramatic or narrative methods to the writer's purpose. Keep context relevant rather than bolted on. End each paragraph by reconnecting to the question.",
    },
    "AQA 8702/2": {
      practicePrompt:
        "Section A: Write one essay on responsibility in An Inspector Calls. Section B: Compare one named anthology poem with another poem of your choice on power or conflict. Section C: Analyse one unseen poem, then compare it with a second unseen poem in a short comparison response.",
      markSchemePoints:
        "Track the central idea across the whole text, not just one quotation. Compare ideas directly rather than writing two separate mini-essays. Use terminology when it helps, but prioritise explanation. For unseen poetry, comment on tone, imagery, and structure with concise evidence.",
    },
    "AQA 8700/1": {
      practicePrompt:
        "Answer a full Paper 1 set with Question 1 retrieval, Question 2 language analysis, Question 3 structure, Question 4 evaluation, and Question 5 descriptive writing. Use strict exam timings and leave 45 minutes for Question 5.",
      markSchemePoints:
        "Keep Question 1 short and exact. In Questions 2 to 4, embed quotations and explain their effect. Track shifts in focus for structure. In Question 5, shape the piece deliberately with paragraph control, varied sentences, and accurate punctuation.",
    },
    "AQA 8700/2": {
      practicePrompt:
        "Complete a full Paper 2 using two viewpoints sources. Include summary, method comparison, evaluation, and a transactional writing task where you argue for change to a local issue affecting teenagers.",
      markSchemePoints:
        "Use both sources from Question 2 onwards. Compare methods with verbs like presents, suggests, or emphasises. Keep evaluation rooted in evidence. In Question 5, maintain one strong viewpoint with clear paragraphs and rhetorical control.",
    },
    "Edexcel 1BS0/01": {
      practicePrompt:
        "Work through a mini case study on a new local food business. Answer short calculations, explain one marketing decision, analyse one operational issue, and finish with a 12-mark judgement on whether expansion is the right next step.",
      markSchemePoints:
        "Use the case data in every extended answer. Build chains like decision -> business effect -> wider consequence. Show working for calculations. In the judgement question, weigh both sides before reaching a supported final view.",
    },
    "Edexcel 1BS0 Calc": {
      practicePrompt:
        "Complete a focused calculations paper covering revenue, costs, profit, break-even, average rate of return, and percentage change. After each answer, add one sentence that explains what the figure means for the business.",
      markSchemePoints:
        "Set calculations out line by line. Include units or currency clearly. If a value looks unrealistic, check the arithmetic. Interpretation matters, so state whether the figure suggests strength, weakness, or risk for the business.",
    },
    "OCR J260H B/C": {
      practicePrompt:
        "Answer a mixed higher-tier practice set with short recall, required practical interpretation, one six-mark biology explanation, one chemistry bonding question, and two calculation items using standard form and significant figures.",
      markSchemePoints:
        "Use exact scientific terms where needed. Show every calculation step. For extended responses, sequence the science logically and include key conditions, variables, or comparisons that the mark scheme expects.",
    },
    "OCR J260H P/Combined": {
      practicePrompt:
        "Complete a mixed paper on motion graphs, energy transfers, circuit calculations, and a six-mark physics explanation. Finish with one combined-science data question that asks you to connect findings across disciplines.",
      markSchemePoints:
        "Choose the right equation before substituting values. Include units in every stage. When explaining, link cause and effect instead of giving disconnected facts. Use graph trends and evidence directly when discussing data.",
    },
    "AQA 8035/1": {
      practicePrompt:
        "Complete a Paper 1 set with hazard process questions, one case-study extended response, one rivers management judgement, and one coasts data interpretation task. Use named examples from your own course.",
      markSchemePoints:
        "Define key terms precisely. Use named examples only where they add value. For 6- and 9-mark answers, organise points into clear paragraphs and evaluate management strategies rather than just describing them.",
    },
    "AQA 8035/2-3": {
      practicePrompt:
        "Answer a human-geography and skills pack with development data analysis, an urban regeneration essay, a resource-management comparison, and fieldwork methodology evaluation using a small data booklet.",
      markSchemePoints:
        "Quote figures selectively instead of copying whole data sets. Compare places or options directly. For fieldwork, comment on sampling, reliability, and improvements. Keep decisions balanced before reaching a final recommendation.",
    },
    "OCR J277/01": {
      practicePrompt:
        "Work through a Paper 1 practice set including CPU performance, memory comparisons, network design, cyber-security scenarios, and one extended response on system software in a school network.",
      markSchemePoints:
        "Use technical vocabulary accurately. Distinguish between description and explanation. In longer answers, link each point to the scenario rather than writing generic notes.",
    },
    "OCR J277/02": {
      practicePrompt:
        "Complete a programming-heavy paper with trace tables, pseudocode correction, logic-gate questions, data-representation conversions, and one design question where you improve an inefficient algorithm.",
      markSchemePoints:
        "Lay out trace tables neatly. State binary or hexadecimal conversions clearly. When debugging, identify the fault and the fix. For algorithms, comment on accuracy and efficiency, not just whether the code runs.",
    },
    "Edexcel 1MA1/1H": {
      practicePrompt:
        "Complete a non-calculator paper with surds, fractions, algebraic manipulation, geometric reasoning, and one multi-step problem-solving item. Show full working on every question and check exact-value answers carefully.",
      markSchemePoints:
        "Write each algebra step on a new line. Keep exact forms like surds or fractions unless asked to round. Use diagrams or labels for geometry. If you reach a final answer quickly, add the intermediate method so the working earns marks.",
    },
    "Edexcel 1MA1/2H-3H": {
      practicePrompt:
        "Work through a calculator practice pack covering compound measures, graph interpretation, trigonometry, cumulative frequency, vectors, and proof. After each calculator question, estimate first so you can sense-check the result.",
      markSchemePoints:
        "Use brackets and mode settings carefully on the calculator. Show substitutions before giving decimal answers. Include units, especially for compound measures. In proof or vectors, justify each step rather than jumping to the conclusion.",
    },
  };

  return (
    practiceMap[paperCode] ?? {
      practicePrompt: `Complete a timed practice paper on ${questionFocus.toLowerCase()} and finish by reviewing where marks are won.`,
      markSchemePoints:
        "Stay focused on the command words, support each point with accurate evidence or working, and check that every paragraph answers the question directly.",
    }
  );
}

function createLessonContent(subjectName, title, summary) {
  return `# ${title}

## What this lesson covers
- ${summary}
- This sits inside ${subjectName}, so keep linking the idea back to the exam paper and command words.

## What you need to know
- Define the core idea in one clear sentence.
- Break the topic into smaller parts before trying full exam questions.
- Use accurate terminology rather than vague everyday wording.

## How to revise it
- Start with retrieval: write down everything you remember in two minutes.
- Turn the topic into one worked example, explanation, comparison, or quotation plan.
- Check where students often confuse method with meaning, process with result, or evidence with judgement.

## Exam focus
- Use a short example, quotation, equation, or case-study detail to support each point.
- Keep answers structured: point, evidence, explanation, then link back to the question.
- Finish by checking whether every sentence actually answers the exam task.

## Quick self-check
- What are the three most important facts or steps?
- What mistake is most easy to make here?
- How would this topic appear in an exam question?`;
}

function createFlashcards(title, summary) {
  return [
    {
      question: `What is the main focus of ${title}?`,
      answer: summary,
    },
    {
      question: `What is a strong revision move for ${title}?`,
      answer: "Start with retrieval practice, then apply the idea to an exam-style question or worked example.",
    },
  ];
}

function createQuestions(subjectName, title, summary) {
  return [
    {
      prompt: `Which statement best matches ${title}?`,
      optionA: summary,
      optionB: `It is not a key part of ${subjectName}.`,
      optionC: "It only matters if you memorise isolated facts without understanding.",
      optionD: "It is mostly unrelated to exam success.",
      correctAnswer: summary,
      explanation: `A strong answer identifies the central purpose of ${title} clearly.`,
    },
    {
      prompt: `What is the best first revision move for ${title}?`,
      optionA: "Copy large sections of notes without checking what you already know.",
      optionB: "Use retrieval practice first, then apply the idea to a worked example.",
      optionC: "Avoid any exam questions until the night before the test.",
      optionD: "Only revise the easiest facts and skip application.",
      correctAnswer: "Use retrieval practice first, then apply the idea to a worked example.",
      explanation: "Effective revision starts with recall and then moves into application.",
    },
  ];
}

function createSubtopics(subjectSlug, topicSlug, title, summary) {
  const subjectSubtopicMap = {
    "english-literature": [
      ["Key moments and references", `Pin down the scenes, quotations, and references that matter most for ${title}.`],
      ["Methods and writer choices", `Analyse language, structure, and dramatic method linked to ${title}.`],
      ["Context and interpretation", `Use context where it sharpens your reading of ${title}, not as a bolt-on.`],
      ["Essay planning", `Practise turning ${title} into a focused thesis with whole-text support.`],
    ],
    "english-language": [
      ["Question demands", `Know exactly what the examiner wants from ${title}.`],
      ["Evidence selection", `Choose short, precise quotations and details for ${title}.`],
      ["Method and effect", `Explain how writers shape meaning, tone, or structure in ${title}.`],
      ["Timed execution", `Use a quick plan and tight timing so ${title} works under exam pressure.`],
    ],
    business: [
      ["Core business knowledge", `Secure the definitions, formulas, and concepts inside ${title}.`],
      ["Application to scenarios", `Apply ${title} to realistic small-business contexts instead of staying generic.`],
      ["Analysis chains", `Build chains of reasoning for ${title}: decision, effect, and wider consequence.`],
      ["Judgement and evaluation", `Practise balanced conclusions when ${title} appears in longer answers.`],
    ],
    "combined-science": [
      ["Scientific knowledge", `Master the core facts, processes, and terms that underpin ${title}.`],
      ["Required practical links", `Connect ${title} to methods, variables, and data handling.`],
      ["Calculations and data", `Use equations, units, graphs, and interpretation confidently in ${title}.`],
      ["Extended responses", `Explain ${title} in a clear scientific sequence rather than listing facts.`],
    ],
    geography: [
      ["Processes and concepts", `Secure the physical or human geography behind ${title}.`],
      ["Case-study evidence", `Pair ${title} with named examples and selective factual support.`],
      ["Data and skills", `Use graphs, maps, fieldwork, or decision-making skills where ${title} needs them.`],
      ["Extended answers", `Structure balanced 6- and 9-mark responses on ${title}.`],
    ],
    "computer-science": [
      ["Technical knowledge", `Learn the key terms, system ideas, and definitions for ${title}.`],
      ["Application to systems or code", `Apply ${title} to scenarios, code traces, or hardware/software contexts.`],
      ["Logic and precision", `Explain ${title} with exact vocabulary and step-by-step reasoning.`],
      ["Exam technique", `Practise short answers, traces, and extended responses linked to ${title}.`],
    ],
    mathematics: [
      ["Core methods", `Secure the standard methods and rules needed for ${title}.`],
      ["Accuracy and working", `Show every stage cleanly so ${title} earns method marks as well as answers.`],
      ["Problem-solving links", `Use ${title} inside multi-step higher-tier questions.`],
      ["Checking and interpretation", `Sense-check results and use exact or rounded forms correctly in ${title}.`],
    ],
  };

  const topicSpecificBoosts = {
    "romeo-juliet-characters": ["Character arcs", "Track Romeo, Juliet, Mercutio, Tybalt, Friar Laurence, and the Nurse across the play."],
    "christmas-carol-character-theme": ["Scrooge and redemption", "Trace Scrooge's transformation and Dickens' message about generosity and social duty."],
    "inspector-calls-themes": ["Responsibility and class", "Connect responsibility, class, gender, and generational conflict to key moments."],
    "lang-paper-1-q5": ["Narrative craft", "Shape description or narrative writing with deliberate openings, shifts, and endings."],
    "business-finance": ["Finance formulas", "Practise cash flow, profit, break-even, and what each figure means in context."],
    "combined-overview": ["Cross-topic retrieval", "Move between biology, chemistry, and physics ideas without losing precision."],
    "geo-paper-3-fieldwork": ["Fieldwork evaluation", "Judge sampling, reliability, presentation choices, and improvements confidently."],
    "cs-paper-2-testing": ["Debugging workflow", "Trace code, spot the fault, and explain the correction clearly."],
    "math-paper-3-problem-solving": ["Higher-tier strategy", "Break unfamiliar problems into manageable steps and justify the path you choose."],
  };

  const templates = [...(subjectSubtopicMap[subjectSlug] ?? [
    ["Core knowledge", `Secure the essential ideas first for ${title}. ${summary}`],
    ["Application", `Practise using ${title} in worked examples and exam-style tasks.`],
    ["Exam technique", `Use timed practice so ${title} holds up under pressure.`],
  ])];

  if (topicSpecificBoosts[topicSlug]) {
    templates.splice(1, 0, topicSpecificBoosts[topicSlug]);
  }

  return templates.map(([subtopicTitle, subtopicSummary]) => ({
    title: subtopicTitle,
    summary: subtopicSummary,
  }));
}

function getOrderedUniqueTopics(topics) {
  const seen = new Set();

  return topics.filter(([slug]) => {
    if (seen.has(slug)) {
      return false;
    }

    seen.add(slug);
    return true;
  });
}

async function resetData(seedUserId) {
  await prisma.userBadge.deleteMany();
  await prisma.revisionRPGProfile.deleteMany();
  // await prisma.pastPaperSession?.deleteMany();
  // await prisma.pastPaperResource?.deleteMany();
  await prisma.quizAttemptAnswer?.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.subtopic?.deleteMany();
  await prisma.lesson?.deleteMany();
  await prisma.flashcard.deleteMany({ where: { userId: seedUserId } });
  await prisma.userProgress.deleteMany({ where: { userId: seedUserId } });
  await prisma.weaknessPrediction.deleteMany({ where: { userId: seedUserId } });
  await prisma.subject.deleteMany();
}

async function main() {
  const seedUser = await prisma.user.upsert({
    where: { email: "seed@gradeup.local" },
    update: {
      name: "GradeUp Seed User",
    },
    create: {
      email: "seed@gradeup.local",
      name: "GradeUp Seed User",
    },
  });

  await resetData(seedUser.id);

  for (const subjectBlueprint of subjectBlueprints) {
    const subject = await prisma.subject.create({
      data: {
        title: subjectBlueprint.name,
        slug: subjectBlueprint.slug,
      },
    });

    const orderedTopics = getOrderedUniqueTopics(subjectBlueprint.topics);

    for (const [index, topicBlueprint] of orderedTopics.entries()) {
      const [slug, title, summary] = topicBlueprint;
      const questionTemplates = createQuestions(subjectBlueprint.name, title, summary);
      const flashcardTemplates = createFlashcards(title, summary);
      const subtopicTemplates = createSubtopics(subjectBlueprint.slug, slug, title, summary);

      const topic = await prisma.topic.create({
        data: {
          subjectId: subject.id,
          title,
        },
      });

      await prisma.lesson.create({
        data: {
          topicId: topic.id,
          title: `Starter lesson: ${title}`,
          content: createLessonContent(subjectBlueprint.name, title, summary),
        },
      });

      for (const flashcard of flashcardTemplates) {
        await prisma.flashcard.create({
          data: {
            userId: seedUser.id,
            subjectId: subject.id,
            topicId: topic.id,
            question: flashcard.question,
            answer: flashcard.answer,
          },
        });
      }

      for (const [subtopicIndex, subtopic] of subtopicTemplates.entries()) {
        await prisma.subtopic.create({
          data: {
            topicId: topic.id,
            title: subtopic.title,
            summary: subtopic.summary,
            orderIndex: subtopicIndex,
          },
        });
      }

      for (const question of questionTemplates) {
        await prisma.question.create({
          data: {
            topicId: topic.id,
            prompt: question.prompt,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            correctAnswer: question.correctAnswer,
            explanation: question.explanation,
          },
        });
      }
    }

    // Skip detailed pastPaperBlueprints to avoid schema mismatch for now
    // Seed basic PastPaper after schema matches

    const paperStructure = getPaperStructure(subjectBlueprint);

    for (const year of pastPaperYears) {
      for (const paperNumber of paperStructure.paperNumbers) {
        for (const tier of paperStructure.tierOptions) {
          const focus = getPaperSetFocus(subjectBlueprint, paperNumber);
          const available = year >= 2023;
          const title = getPaperSetTitle(subjectBlueprint, paperNumber, year, tier);

          const paperSet = await prisma.pastPaperSet.create({
            data: {
              subjectId: subject.id,
              examBoard: subjectBlueprint.examBoard,
              year,
              paperNumber,
              tier,
              title,
              overview: getPaperSetOverview(subjectBlueprint, paperNumber, tier),
              durationMinutes: subjectBlueprint.slug === "mathematics" ? 90 : subjectBlueprint.slug === "geography" ? 90 : 75,
              questionFocus: focus,
              isPublished: true,
            },
          });

          await prisma.pastPaperResource.createMany({
            data: [
              {
                pastPaperSetId: paperSet.id,
                type: "EXAM_PAPER",
                label: `${title} paper`,
                fileName: `${subjectBlueprint.slug}-${year}-paper-${paperNumber}.html`,
                pageCount: 4,
                htmlContent: available
                  ? createPaperViewerContent(subjectBlueprint, title, paperNumber, year, tier, focus)
                  : null,
                notes: available
                  ? "Embedded GradeUp practice paper"
                  : "This paper is not available yet. Please choose another year or exam board.",
                isAvailable: available,
              },
              {
                pastPaperSetId: paperSet.id,
                type: "MARK_SCHEME",
                label: `${title} mark scheme`,
                fileName: `${subjectBlueprint.slug}-${year}-paper-${paperNumber}-mark-scheme.html`,
                pageCount: 3,
                htmlContent: available
                  ? createMarkSchemeContent(subjectBlueprint, title, focus)
                  : null,
                notes: available
                  ? "Embedded GradeUp mark scheme"
                  : "This paper is not available yet. Please choose another year or exam board.",
                isAvailable: available,
              },
            ],
          });
        }
      }
    }
  }

  await prisma.revisionRPGProfile.upsert({
    where: { userId: seedUser.id },
    update: {},
    create: {
      userId: seedUser.id,
      level: 1,
      totalXP: 120,
      currentXP: 120,
      xpForNextLevel: 500,
      coins: 0,
      gems: 0,
      avatarClass: "Student",
      currentStreak: 0,
      longestStreak: 0,
    },
  });

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
