import prisma from "../lib/prisma";

const questionsData = {
    mathematics: [
        { questionText: "Solve: 3x + 5 = 20", marks: 3, sampleAnswer: "3x = 15\nx = 5", markingCriteria: JSON.stringify({ rearranging: 1, solving: 1, answer: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Calculate area and perimeter of 12m × 8m rectangle", marks: 6, sampleAnswer: "Area = 96 m²\nPerimeter = 40 m", markingCriteria: JSON.stringify({ areaFormula: 2, perimeterFormula: 2, calculation: 1, units: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Population increases 15% yearly from 50,000. What after 3 years?", marks: 9, sampleAnswer: "50,000 × (1.15)³ = 76,044", markingCriteria: JSON.stringify({ method: 3, calculation: 3, rounding: 2, working: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    "english-language": [
        { questionText: "Write a paragraph explaining a main theme from a text.", marks: 3, sampleAnswer: "The theme of resilience is shown through the character's struggle against adversity.", markingCriteria: JSON.stringify({ theme: 1, explanation: 1, evidence: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Analyse how language creates mood in this extract (150 words).", marks: 6, sampleAnswer: "Dark vocabulary creates suspense and unease throughout the passage.", markingCriteria: JSON.stringify({ identification: 2, analysis: 2, effect: 1, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Compare how two texts explore conflict (300 words).", marks: 9, sampleAnswer: "Both texts use violent imagery and dialogue to show conflict.", markingCriteria: JSON.stringify({ comparison: 3, textualEvidence: 3, analysis: 2, writing: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    "english-literature": [
        { questionText: "Describe how character development occurs in the novel.", marks: 3, sampleAnswer: "The protagonist grows from naive to wise through trials and reflection.", markingCriteria: JSON.stringify({ description: 1, evidence: 1, insight: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Analyse the significance of the ending (200 words).", marks: 6, sampleAnswer: "The tragic ending emphasises the consequences of unchecked ambition.", markingCriteria: JSON.stringify({ interpretation: 2, analysis: 2, evidence: 1, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Evaluate how the author uses symbolism throughout the text.", marks: 9, sampleAnswer: "Symbols of light and darkness represent good versus evil throughout.", markingCriteria: JSON.stringify({ identification: 2, significance: 2, effect: 2, evaluation: 2, writing: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    biology: [
        { questionText: "Name the process where plants make food using sunlight.", marks: 3, sampleAnswer: "Photosynthesis", markingCriteria: JSON.stringify({ processName: 1, spelling: 1, accuracy: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Describe structure and function of 4 plant cell organelles.", marks: 6, sampleAnswer: "Cell wall provides support, chloroplast for photosynthesis, vacuole stores nutrients, nucleus controls activities.", markingCriteria: JSON.stringify({ structures: 2, functions: 2, accuracy: 1, detail: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Explain how kidney structure enables ultrafiltration (with scientific terms).", marks: 9, sampleAnswer: "Glomerulus has permeable capillaries allowing small molecules through while retaining proteins and cells.", markingCriteria: JSON.stringify({ structure: 3, process: 3, terminology: 2, detail: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    chemistry: [
        { questionText: "Write the chemical formula for sodium chloride.", marks: 3, sampleAnswer: "NaCl", markingCriteria: JSON.stringify({ formula: 1, ions: 1, accuracy: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain difference between ionic and covalent bonding with examples.", marks: 6, sampleAnswer: "Ionic: electron transfer (NaCl). Covalent: electron sharing (H₂O).", markingCriteria: JSON.stringify({ ionicDef: 2, covalentDef: 2, examples: 1, accuracy: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Explain how periodic table groups show electron arrangement.", marks: 9, sampleAnswer: "Groups show valence electrons; Period shows electron shells present.", markingCriteria: JSON.stringify({ structure: 3, explanation: 3, connection: 2, detail: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    physics: [
        { questionText: "Define velocity and explain how it differs from speed.", marks: 3, sampleAnswer: "Velocity = rate of change of displacement (vector). Speed = distance per time (scalar).", markingCriteria: JSON.stringify({ velocityDef: 1, speedDef: 1, difference: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Car travels 60m in 4 seconds. Calculate speed with working.", marks: 6, sampleAnswer: "Speed = 60÷4 = 15 m/s", markingCriteria: JSON.stringify({ formula: 1, substitution: 1, calculation: 1, units: 1, explanation: 1, working: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Explain how forces affect motion using Newton's laws.", marks: 9, sampleAnswer: "Force = mass × acceleration. Objects accelerate in direction of net force.", markingCriteria: JSON.stringify({ law1: 2, law2: 3, application: 2, explanation: 1, working: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    "combined-science": [
        { questionText: "Name three organs in the human circulatory system.", marks: 3, sampleAnswer: "Heart, lungs, blood vessels", markingCriteria: JSON.stringify({ organ1: 1, organ2: 1, organ3: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain how lungs exchange oxygen and carbon dioxide.", marks: 6, sampleAnswer: "Alveoli have thin walls allowing diffusion of gases across the boundary.", markingCriteria: JSON.stringify({ identification: 1, process: 2, mechanism: 2, accuracy: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse the role of enzymes in digestion.", marks: 9, sampleAnswer: "Enzymes catalyse breakdown of food into absorbable molecules by lowering activation energy.", markingCriteria: JSON.stringify({ role: 2, mechanism: 2, examples: 2, detail: 2, explanation: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    geography: [
        { questionText: "Name three types of rocks and how they are formed.", marks: 3, sampleAnswer: "Igneous from magma, sedimentary from compaction, metamorphic from heat/pressure.", markingCriteria: JSON.stringify({ type1: 1, type2: 1, type3: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Describe how river erosion creates valley shapes over time.", marks: 6, sampleAnswer: "V-shaped in mountains (vertical), wider valleys downstream (lateral erosion).", markingCriteria: JSON.stringify({ mechanism: 2, formation: 2, location: 1, detail: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse climate change impacts on global ecosystems.", marks: 9, sampleAnswer: "Rising temperatures alter precipitation patterns, threatening biodiversity and food security.", markingCriteria: JSON.stringify({ identification: 2, impact: 3, explanation: 2, scale: 1, detail: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    history: [
        { questionText: "What was the main cause of World War I?", marks: 3, sampleAnswer: "Alliance system and assassination of Archduke Franz Ferdinand triggered tensions.", markingCriteria: JSON.stringify({ allianceSystem: 1, trigger: 1, explanation: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Analyse Industrial Revolution's impact on British society (200 words).", marks: 6, sampleAnswer: "Transformed rural to urban, created factory working class, increased productivity.", markingCriteria: JSON.stringify({ social: 2, economic: 2, accuracy: 1, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Evaluate social and political changes from revolution period.", marks: 9, sampleAnswer: "Shifted power from monarchy to parliament; middle class gained influence.", markingCriteria: JSON.stringify({ identification: 2, analysis: 2, evaluation: 2, evidence: 2, writing: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    "religious-studies": [
        { questionText: "Explain one religious belief about creation.", marks: 3, sampleAnswer: "Many faiths teach God created the world in orderly fashion.", markingCriteria: JSON.stringify({ beliefID: 1, explanation: 1, detail: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Compare two religions' approaches to morality.", marks: 6, sampleAnswer: "Christianity emphasizes love; Islam emphasizes submission to Allah's will.", markingCriteria: JSON.stringify({ religion1: 2, religion2: 2, comparison: 1, accuracy: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse how religious texts guide followers' ethical decisions.", marks: 9, sampleAnswer: "Texts provide rules, stories, and principles that shape moral frameworks.", markingCriteria: JSON.stringify({ textID: 2, guidance: 2, application: 2, analysis: 2, explanation: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    french: [
        { questionText: "Translate to French: 'I go to school every day.'", marks: 3, sampleAnswer: "Je vais à l'école tous les jours.", markingCriteria: JSON.stringify({ accuracy: 1, tense: 1, vocabulary: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Write about your daily routine in French (100+ words).", marks: 6, sampleAnswer: "Le matin je me réveille à sept heures. Je prends le petit déjeuner avec ma famille.", markingCriteria: JSON.stringify({ vocabulary: 2, grammar: 2, wordCount: 1, accuracy: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Discuss French culture and traditions (200+ words).", marks: 9, sampleAnswer: "La culture française valorise l'art, la gastronomie et la mode mondialement.", markingCriteria: JSON.stringify({ vocabulary: 2, complexity: 2, accuracy: 2, cultural: 2, wordCount: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    spanish: [
        { questionText: "Translate: 'Please, where is the station?'", marks: 3, sampleAnswer: "Por favor, ¿dónde está la estación?", markingCriteria: JSON.stringify({ politeness: 1, accuracy: 1, vocabulary: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Describe a typical day in Spanish (100+ words).", marks: 6, sampleAnswer: "Me despierto a las siete. Desayuno con mi familia en la cocina.", markingCriteria: JSON.stringify({ description: 2, grammar: 2, wordCount: 1, vocabulary: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Discuss Spanish-speaking countries and cultures (200+ words).", marks: 9, sampleAnswer: "España, México y Argentina tienen culturas diferentes pero lengua compartida.", markingCriteria: JSON.stringify({ countries: 2, culture: 2, grammar: 2, vocabulary: 2, detail: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    german: [
        { questionText: "Translate: 'I like to play football on weekends.'", marks: 3, sampleAnswer: "Ich spiele gerne Fußball am Wochenende.", markingCriteria: JSON.stringify({ verb: 1, accuracy: 1, vocabulary: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Write about your hobbies in German (100+ words).", marks: 6, sampleAnswer: "Ich spiele Tennis und sehe gerne Filme mit Freunden.", markingCriteria: JSON.stringify({ vocabulary: 2, tense: 2, wordCount: 1, accuracy: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Describe German traditions and customs (200+ words).", marks: 9, sampleAnswer: "Deutschland hat festive traditions wie Oktoberfest und Christmas markets.", markingCriteria: JSON.stringify({ traditions: 2, description: 2, accuracy: 2, vocabulary: 2, detail: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    "computer-science": [
        { questionText: "What is the primary purpose of an operating system?", marks: 3, sampleAnswer: "Manages hardware resources and provides user interface between hardware and applications.", markingCriteria: JSON.stringify({ management: 1, interface: 1, examples: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain RAM vs ROM. Why are both needed?", marks: 6, sampleAnswer: "RAM is volatile temp memory; ROM is permanent boot memory. Both needed for efficiency.", markingCriteria: JSON.stringify({ ramDef: 1, romDef: 1, difference: 2, necessity: 1, accuracy: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse cybersecurity threats and protection methods.", marks: 9, sampleAnswer: "Threats include viruses, phishing, hacking. Protection via firewalls, encryption, authentication.", markingCriteria: JSON.stringify({ threats: 2, methods: 3, analysis: 2, examples: 1, detail: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    "digital-media": [
        { questionText: "Define digital media and give three examples.", marks: 3, sampleAnswer: "Content delivered electronically: websites, videos, apps, social media.", markingCriteria: JSON.stringify({ definition: 1, example1: 1, example2: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain media convergence and its impact on production.", marks: 6, sampleAnswer: "Convergence = combining platforms. Enables multimedia storytelling and wider distribution.", markingCriteria: JSON.stringify({ definition: 2, impact: 2, production: 1, detail: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse audience engagement in digital media campaigns.", marks: 9, sampleAnswer: "Interactive content, social media integration, personalization drive engagement metrics.", markingCriteria: JSON.stringify({ strategies: 2, engagement: 2, analysis: 2, examples: 2, detail: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    "art-design": [
        { questionText: "Describe the art elements: line, shape, colour, texture.", marks: 3, sampleAnswer: "Line defines boundaries, shape is 2D form, colour creates mood, texture provides surface quality.", markingCriteria: JSON.stringify({ elements: 3 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Analyse colour theory and its use in design (150 words).", marks: 6, sampleAnswer: "Primary colours are base; complementary colours create contrast; warm/cool affect mood.", markingCriteria: JSON.stringify({ theory: 2, application: 2, analysis: 1, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Evaluate Renaissance art principles and modern design application.", marks: 9, sampleAnswer: "Perspective, proportion, balance from Renaissance influence contemporary graphics and web design.", markingCriteria: JSON.stringify({ principles: 2, history: 2, application: 2, evaluation: 2, detail: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    music: [
        { questionText: "Name four instrument families and give examples.", marks: 3, sampleAnswer: "Strings (violin), woodwind (clarinet), brass (trumpet), percussion (drums).", markingCriteria: JSON.stringify({ family1: 1, family2: 1, examples: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain rhythm, tempo, and dynamics in music (150 words).", marks: 6, sampleAnswer: "Rhythm organizes beats; tempo sets speed; dynamics control volume for expression.", markingCriteria: JSON.stringify({ rhythm: 1, tempo: 1, dynamics: 1, explanation: 2, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse compositional techniques in classical vs contemporary music.", marks: 9, sampleAnswer: "Classical uses sonata form and counterpoint; contemporary uses loops and digital manipulation.", markingCriteria: JSON.stringify({ classical: 2, contemporary: 2, techniques: 2, contrast: 2, detail: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    drama: [
        { questionText: "Define characterization and its importance in theatre.", marks: 3, sampleAnswer: "Creating believable character through motivation, actions, speech creating audience connection.", markingCriteria: JSON.stringify({ definition: 1, importance: 1, method: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain staging techniques and their dramatic effects (150 words).", marks: 6, sampleAnswer: "Lighting highlights emotions; positioning creates focus; set design establishes context and mood.", markingCriteria: JSON.stringify({ technique1: 1, technique2: 1, technique3: 1, effect: 2, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse how playwrights use symbolism and metaphor for meaning.", marks: 9, sampleAnswer: "Objects/actions represent ideas; metaphors deepen themes through indirect comparison and audience interpretation.", markingCriteria: JSON.stringify({ symbolism: 2, metaphor: 2, examples: 2, analysis: 2, detail: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    "physical-education": [
        { questionText: "Name three components of fitness and define each.", marks: 3, sampleAnswer: "Strength (force production), endurance (sustained effort), flexibility (range of motion).", markingCriteria: JSON.stringify({ component1: 1, component2: 1, definition: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain healthy lifestyle factors: exercise, diet, sleep (150 words).", marks: 6, sampleAnswer: "Regular exercise strengthens systems, balanced diet provides energy, sleep enables recovery and focus.", markingCriteria: JSON.stringify({ exercise: 1, diet: 1, sleep: 1, connection: 2, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse sports psychology and mental training techniques.", marks: 9, sampleAnswer: "Visualization, goal-setting, and mindfulness improve performance through mental preparation and concentration.", markingCriteria: JSON.stringify({ psychology: 2, techniques: 3, application: 2, analysis: 1, detail: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    "health-social-care": [
        { questionText: "Define health and wellbeing in modern contexts.", marks: 3, sampleAnswer: "Health is physical, mental, social functioning; wellbeing is holistic life satisfaction.", markingCriteria: JSON.stringify({ definition: 1, components: 1, understanding: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain healthcare services and social care support systems (150 words).", marks: 6, sampleAnswer: "NHS provides medical care; social services support vulnerable populations; integration improves outcomes.", markingCriteria: JSON.stringify({ healthcare: 2, socialCare: 2, integration: 1, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse inequality in healthcare access and solutions.", marks: 9, sampleAnswer: "Geographic, economic, social barriers limit access; solutions include funding, education, community programs.", markingCriteria: JSON.stringify({ barriers: 2, analysis: 2, solutions: 2, evidence: 2, detail: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    "business-studies": [
        { questionText: "Define business, entrepreneur, and profit.", marks: 3, sampleAnswer: "Business is commercial enterprise; entrepreneur creates/runs it; profit is revenue minus costs.", markingCriteria: JSON.stringify({ business: 1, entrepreneur: 1, profit: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain market research and its role in business planning (150 words).", marks: 6, sampleAnswer: "Market research identifies customer needs, competitor strategies, market trends guiding product development.", markingCriteria: JSON.stringify({ definition: 1, role: 2, application: 2, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse supply chain management and ethical sourcing.", marks: 9, sampleAnswer: "Supply chains control costs and quality; ethical sourcing ensures fair labor, environmental responsibility.", markingCriteria: JSON.stringify({ supply: 2, management: 2, ethics: 2, impact: 2, detail: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    economics: [
        { questionText: "Define scarcity, opportunity cost, and economic choice.", marks: 3, sampleAnswer: "Scarcity means limited resources; opportunity cost is forgone alternative; choice allocates resources.", markingCriteria: JSON.stringify({ scarcity: 1, cost: 1, choice: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain supply and demand and market equilibrium (150 words).", marks: 6, sampleAnswer: "Demand increases with lower prices; supply increases with higher prices; equilibrium balances both.", markingCriteria: JSON.stringify({ demand: 1, supply: 1, equilibrium: 2, graph: 1, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse economic growth models and sustainability challenges.", marks: 9, sampleAnswer: "GDP growth models measure development but ignore environmental costs; circular economy offers alternatives.", markingCriteria: JSON.stringify({ models: 2, growth: 2, challenges: 2, alternatives: 2, analysis: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    "design-technology": [
        { questionText: "Explain design process: research, develop, test, evaluate.", marks: 3, sampleAnswer: "Research identifies needs, develop explores solutions, test validates function, evaluate improves design.", markingCriteria: JSON.stringify({ process: 3 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Discuss sustainable materials and smart manufacturing (150 words).", marks: 6, sampleAnswer: "Sustainable materials reduce waste; smart manufacturing uses automation and AI for efficiency.", markingCriteria: JSON.stringify({ sustainability: 2, materials: 1, manufacturing: 2, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse ergonomics and user-centered design principles.", marks: 9, sampleAnswer: "Ergonomics ensures safety and comfort; user-centered design prioritizes end-user needs and usability.", markingCriteria: JSON.stringify({ ergonomics: 2, userCentered: 2, principles: 2, application: 2, detail: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    construction: [
        { questionText: "Name three construction materials and their properties.", marks: 3, sampleAnswer: "Concrete is strong and durable, steel is flexible and lightweight, wood is renewable and natural.", markingCriteria: JSON.stringify({ material1: 1, material2: 1, material3: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain structural design and load-bearing principles (150 words).", marks: 6, sampleAnswer: "Foundations distribute loads; beams support weight; materials chosen for strength and economy.", markingCriteria: JSON.stringify({ structural: 2, loadBearing: 2, materials: 1, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse sustainable building practices and energy efficiency.", marks: 9, sampleAnswer: "Green building reduces environmental impact through insulation, renewable energy, waste management.", markingCriteria: JSON.stringify({ sustainability: 2, practices: 2, efficiency: 2, impact: 2, detail: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    engineering: [
        { questionText: "Define engineering and list three engineering disciplines.", marks: 3, sampleAnswer: "Engineering applies science to practical problems. Civil, mechanical, electrical are major disciplines.", markingCriteria: JSON.stringify({ definition: 1, discipline1: 1, discipline2: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain mechanical principles: force, motion, energy (150 words).", marks: 6, sampleAnswer: "Force causes motion; energy enables work; principles combine to design efficient machines and systems.", markingCriteria: JSON.stringify({ force: 1, motion: 1, energy: 1, application: 2, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse automation and robotics in industry and society.", marks: 9, sampleAnswer: "Robotic automation improves precision and productivity but raises employment and ethical concerns.", markingCriteria: JSON.stringify({ automation: 2, robotics: 2, benefits: 2, challenges: 2, analysis: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    "media-studies": [
        { questionText: "Define media literacy and its importance in society.", marks: 3, sampleAnswer: "Ability to critically analyze media messages; important for informed citizenship and decision-making.", markingCriteria: JSON.stringify({ definition: 1, importance: 1, application: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain representation and bias in media (150 words).", marks: 6, sampleAnswer: "Media representation shapes perception; bias occurs through selection, framing, omission of alternative views.", markingCriteria: JSON.stringify({ representation: 2, bias: 2, examples: 1, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse media ownership, regulation, and democratic implications.", marks: 9, sampleAnswer: "Concentrated ownership limits diverse viewpoints; regulation balances freedom and responsibility for democracy.", markingCriteria: JSON.stringify({ ownership: 2, regulation: 2, democracy: 2, analysis: 2, detail: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ],
    classics: [
        { questionText: "Name three ancient civilizations and their contributions.", marks: 3, sampleAnswer: "Greece gave democracy and philosophy, Rome gave law and engineering, Egypt gave writing and art.", markingCriteria: JSON.stringify({ civilization1: 1, civilization2: 1, contribution: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain classical mythology and its cultural significance (150 words).", marks: 6, sampleAnswer: "Myths explained natural phenomena and taught moral lessons; influenced literature, art, and modern culture.", markingCriteria: JSON.stringify({ mythology: 2, significance: 2, influence: 1, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse classical philosophy and its modern philosophical impact.", marks: 9, sampleAnswer: "Socratic method, Plato's idealism, Aristotle's logic remain foundational in modern philosophical thinking.", markingCriteria: JSON.stringify({ philosophy1: 2, philosophy2: 2, philosophy3: 2, impact: 2, analysis: 1 }), difficulty: 3, examBoard: "WJEC", year: 2022 }
    ],
    "environmental-science": [
        { questionText: "Define ecosystem and name its main components.", marks: 3, sampleAnswer: "Organisms interdependent in habitat with biotic (living) and abiotic (non-living) components.", markingCriteria: JSON.stringify({ definition: 1, biotic: 1, abiotic: 1 }), difficulty: 1, examBoard: "AQA", year: 2023 },
        { questionText: "Explain carbon cycle and climate change impacts (150 words).", marks: 6, sampleAnswer: "Carbon moves through atmosphere, organisms, soil; excess CO₂ traps heat causing warming, ecological disruption.", markingCriteria: JSON.stringify({ cycle: 2, climate: 2, impact: 1, wordCount: 1 }), difficulty: 2, examBoard: "Edexcel", year: 2023 },
        { questionText: "Analyse conservation strategies and biodiversity protection.", marks: 9, sampleAnswer: "Protected areas, reintroduction, habitat restoration, legal frameworks prevent species extinction and maintain ecosystems.", markingCriteria: JSON.stringify({ strategies: 3, conservation: 2, biodiversity: 2, effectiveness: 1, detail: 1 }), difficulty: 3, examBoard: "OCR", year: 2022 }
    ]
};

async function seedQuestions() {
    try {
        console.log("🌱 Starting comprehensive question seeding for ALL 28 GCSE subjects...\n");

        const subjectMap: { [key: string]: string } = {
            mathematics: "Mathematics",
            "english-language": "English Language",
            "english-literature": "English Literature",
            biology: "Biology",
            chemistry: "Chemistry",
            physics: "Physics",
            "combined-science": "Combined Science",
            geography: "Geography",
            history: "History",
            "religious-studies": "Religious Studies",
            french: "French",
            spanish: "Spanish",
            german: "German",
            "computer-science": "Computer Science",
            "digital-media": "Digital Media",
            "art-design": "Art and Design",
            music: "Music",
            drama: "Drama",
            "physical-education": "Physical Education",
            "health-social-care": "Health and Social Care",
            "business-studies": "Business Studies",
            economics: "Economics",
            "design-technology": "Design and Technology",
            construction: "Construction",
            engineering: "Engineering",
            "media-studies": "Media Studies",
            classics: "Classics",
            "environmental-science": "Environmental Science"
        };

        let totalAdded = 0;

        for (const [slug, questions] of Object.entries(questionsData)) {
            const subjectTitle = subjectMap[slug];

            const subject = await (prisma.subject as any).findUnique({
                where: { slug }
            });

            if (!subject) {
                console.log(`  ✗ Subject ${subjectTitle} not found`);
                continue;
            }

            for (const q of questions) {
                await (prisma.question as any).create({
                    data: {
                        subjectId: subject.id,
                        questionText: q.questionText,
                        marks: q.marks,
                        sampleAnswer: q.sampleAnswer,
                        markingCriteria: q.markingCriteria,
                        difficulty: q.difficulty,
                        examBoard: q.examBoard,
                        year: q.year
                    }
                });
            }

            console.log(`  ✓ ${subjectTitle} - ${questions.length} questions added`);
            totalAdded += questions.length;
        }

        console.log(`\n✨ Comprehensive seeding complete!`);
        console.log(`   • 28 GCSE subjects covered`);
        console.log(`   • ${totalAdded} total questions added`);
        console.log(`   • 3 difficulty levels per subject`);

    } catch (error) {
        console.error("Error seeding questions:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedQuestions();
