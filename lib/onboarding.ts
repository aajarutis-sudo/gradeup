import prisma from "@/lib/prisma";
import { addXP, awardBadge, levelFromXP, logDailyStudy, scoreToGrade, syncLevelBadges } from "@/lib/gamification";

/**
 * Get diagnostic questions for a subject
 * Returns 3 questions per subject with varying difficulty and marks
 */
export async function getDiagnosticQuestions(subjectSlug: string, take = 3, examBoardSlug?: string) {
  try {
    // Question database organized by exam board → subject
    // Each exam board has 3 questions per subject (1-2 marks, 3-4 marks, 6-8 marks)
    const examBoardsData: Record<string, Record<string, Array<{
      question: string;
      marks: number;
      sampleAnswer: string;
      difficulty: number;
      examBoard: string;
      year: number;
    }>>> = {
      aqa: {
        mathematics: [
          { question: "Solve: 3x + 5 = 20", marks: 2, sampleAnswer: "3x = 15\nx = 5", difficulty: 1, examBoard: "AQA", year: 2023 },
          { question: "A rectangle has length 12m and width 8m. Calculate its area and perimeter.", marks: 4, sampleAnswer: "Area = 96 m²; Perimeter = 40 m", difficulty: 2, examBoard: "AQA", year: 2023 },
          { question: "A population of 50,000 increases by 15% each year. What will the population be after 3 years?", marks: 6, sampleAnswer: "50,000 × (1.15)³ = 76,044", difficulty: 3, examBoard: "AQA", year: 2023 }
        ],
        "english-language": [
          { question: "Write a paragraph explaining how the author uses language to create atmosphere in this extract.", marks: 2, sampleAnswer: "The author uses dark, ominous vocabulary to build tension and create an unsettling atmosphere.", difficulty: 1, examBoard: "AQA", year: 2023 },
          { question: "Analyse how sentence structure affects the pace and mood of this passage (150-200 words).", marks: 4, sampleAnswer: "Short sentences create urgency and tension. Long sentences slow the pace and create suspense.", difficulty: 2, examBoard: "AQA", year: 2023 },
          { question: "Compare how both texts use language to explore the theme of conflict and resolution.", marks: 8, sampleAnswer: "Both use violent imagery and dialogue. Text A shows external conflict while Text B shows internal struggle.", difficulty: 3, examBoard: "AQA", year: 2023 }
        ],
        "english-literature": [
          { question: "Describe how the protagonist changes throughout the first act of the play.", marks: 2, sampleAnswer: "The protagonist begins naive and trusting but gradually becomes aware of betrayal around them.", difficulty: 1, examBoard: "AQA", year: 2023 },
          { question: "Analyse the significance of the ending and how it reflects the novel's themes.", marks: 4, sampleAnswer: "The tragic ending emphasises that ambition without morality leads to destruction and downfall.", difficulty: 2, examBoard: "AQA", year: 2023 },
          { question: "Evaluate how Shakespeare uses the character of Juliet to explore love and duty in the play.", marks: 8, sampleAnswer: "Juliet represents the conflict between passionate love and family loyalty, ultimately choosing love over duty.", difficulty: 3, examBoard: "AQA", year: 2023 }
        ],
        biology: [
          { question: "Name the main process by which plants produce glucose from sunlight, water and carbon dioxide.", marks: 1, sampleAnswer: "Photosynthesis", difficulty: 1, examBoard: "AQA", year: 2023 },
          { question: "Describe the structure and function of four plant cell organelles.", marks: 4, sampleAnswer: "Cell membrane controls substances; Cell wall provides support; Mitochondria release energy; Chloroplast photosynthesises", difficulty: 2, examBoard: "AQA", year: 2023 },
          { question: "Explain how the structure of the lung alveoli is adapted for effective gas exchange.", marks: 6, sampleAnswer: "Thin walls for diffusion, large surface area for faster exchange, rich blood supply for oxygen transport", difficulty: 3, examBoard: "AQA", year: 2023 }
        ],
        chemistry: [
          { question: "Write the chemical formula for sodium chloride and identify the type of bonding.", marks: 1, sampleAnswer: "NaCl - ionic bonding", difficulty: 1, examBoard: "AQA", year: 2023 },
          { question: "Explain the difference between ionic and covalent bonding with one example of each.", marks: 4, sampleAnswer: "Ionic: electron transfer between atoms (NaCl). Covalent: electron sharing between atoms (H₂O)", difficulty: 2, examBoard: "AQA", year: 2023 },
          { question: "Explain how the organisation of the periodic table reflects the electron structure of atoms.", marks: 6, sampleAnswer: "Groups show number of valence electrons; Periods show number of electron shells present.", difficulty: 3, examBoard: "AQA", year: 2023 }
        ],
        physics: [
          { question: "Define velocity and explain how it differs from speed.", marks: 2, sampleAnswer: "Velocity is rate of change of displacement (vector); Speed is distance per time (scalar)", difficulty: 1, examBoard: "AQA", year: 2023 },
          { question: "A car travels 60 metres in 4 seconds. Calculate its speed with working shown.", marks: 3, sampleAnswer: "Speed = distance/time = 60/4 = 15 m/s", difficulty: 2, examBoard: "AQA", year: 2023 },
          { question: "Explain how forces affect motion and state Newton's laws of motion clearly.", marks: 7, sampleAnswer: "1st: Objects continue moving unless force applied. 2nd: F=ma. 3rd: Equal/opposite reactions.", difficulty: 3, examBoard: "AQA", year: 2023 }
        ],
        "combined-science": [
          { question: "Name three organs in the human circulatory system.", marks: 2, sampleAnswer: "Heart, lungs, blood vessels", difficulty: 1, examBoard: "AQA", year: 2023 },
          { question: "Explain how alveoli in the lungs are adapted for gas exchange.", marks: 4, sampleAnswer: "Thin walls, large surface area, rich blood supply enable efficient diffusion of oxygen and CO₂", difficulty: 2, examBoard: "AQA", year: 2023 },
          { question: "Describe the complete enzyme action and explain why enzymes are essential for digestion.", marks: 6, sampleAnswer: "Enzymes catalyse breakdown into smaller molecules. Substrate fits active site; product released.", difficulty: 3, examBoard: "AQA", year: 2023 }
        ],
        geography: [
          { question: "Name three different rock types and describe how each is formed.", marks: 2, sampleAnswer: "Igneous from magma cooling; Sedimentary from compaction; Metamorphic from heat/pressure", difficulty: 1, examBoard: "AQA", year: 2023 },
          { question: "Describe how river features like V-shaped valleys and meanders form over time.", marks: 4, sampleAnswer: "Young rivers erode vertically forming V-shapes. Mature rivers erode laterally forming wider valleys and meanders", difficulty: 2, examBoard: "AQA", year: 2023 },
          { question: "Analyse the effects of climate change on global ecosystems and biodiversity.", marks: 7, sampleAnswer: "Rising temperatures alter precipitation, habitats shrink, species migrate or face extinction, food chains disrupted", difficulty: 3, examBoard: "AQA", year: 2023 }
        ],
        history: [
          { question: "What were the main causes of the outbreak of World War I in 1914?", marks: 2, sampleAnswer: "Alliance system, imperial rivalry, arms race, and assassination of Archduke Franz Ferdinand", difficulty: 1, examBoard: "AQA", year: 2023 },
          { question: "Analyse how the Industrial Revolution transformed British society.", marks: 4, sampleAnswer: "Urbanisation, factory working class emerged, productivity increased, but poor working conditions developed", difficulty: 2, examBoard: "AQA", year: 2023 },
          { question: "Evaluate the political, social and economic changes brought about by revolution in one named period.", marks: 8, sampleAnswer: "French Revolution shifted power from monarchy to bourgeoisie, ended feudalism, established rights", difficulty: 3, examBoard: "AQA", year: 2023 }
        ],
        "business-studies": [
          { question: "What does ROI stand for and why is it important when evaluating investments?", marks: 2, sampleAnswer: "Return on Investment - measures profitability and efficiency of capital invested", difficulty: 1, examBoard: "AQA", year: 2023 },
          { question: "Explain the key differences between sole traders, partnerships and limited companies.", marks: 4, sampleAnswer: "Sole trader: one owner, unlimited liability. Partnership: multiple owners. Ltd: shareholders with limited liability", difficulty: 2, examBoard: "AQA", year: 2023 },
          { question: "Analyse how digital transformation and e-commerce have impacted traditional supply chains.", marks: 7, sampleAnswer: "Automation reduces costs, real-time tracking improves efficiency, direct-to-consumer shortens chains", difficulty: 3, examBoard: "AQA", year: 2023 }
        ]
      },
      edexcel: {
        mathematics: [
          { question: "Simplify: 2x + 3x - 5 = 35", marks: 2, sampleAnswer: "5x - 5 = 35\n5x = 40\nx = 8", difficulty: 1, examBoard: "Edexcel", year: 2023 },
          { question: "A triangle has sides 3cm, 4cm and 5cm. Calculate its area.", marks: 4, sampleAnswer: "Area = ½ × base × height = ½ × 3 × 4 = 6 cm²", difficulty: 2, examBoard: "Edexcel", year: 2023 },
          { question: "Solve the quadratic equation: x² + 5x + 6 = 0", marks: 6, sampleAnswer: "(x + 2)(x + 3) = 0; x = -2 or x = -3", difficulty: 3, examBoard: "Edexcel", year: 2023 }
        ],
        "english-language": [
          { question: "Identify two language features used in this extract and explain their effect.", marks: 2, sampleAnswer: "Metaphor creates vivid imagery; Repetition emphasises key points and creates rhythm", difficulty: 1, examBoard: "Edexcel", year: 2023 },
          { question: "Analyse the writer's use of paragraphing to structure their argument.", marks: 4, sampleAnswer: "Short paragraphs create impact; Long paragraphs develop ideas; Contrast between lengths emphasises key points", difficulty: 2, examBoard: "Edexcel", year: 2023 },
          { question: "Discuss how both writers convey their attitudes towards the given topic.", marks: 8, sampleAnswer: "Writer A uses positive language suggesting optimism; Writer B uses sarcasm conveying criticism", difficulty: 3, examBoard: "Edexcel", year: 2023 }
        ],
        "english-literature": [
          { question: "How does the author introduce the main character in the opening chapter?", marks: 2, sampleAnswer: "Through description of physical appearance and actions; establishing innocence through dialogue", difficulty: 1, examBoard: "Edexcel", year: 2023 },
          { question: "Explain how Dickens uses Miss Havisham to explore themes of regret and bitterness.", marks: 4, sampleAnswer: "Her frozen life represents inability to move forward from betrayal; she poisons those around her with her bitterness", difficulty: 2, examBoard: "Edexcel", year: 2023 },
          { question: "How does Shakespeare present the relationship between love and marriage in Measure for Measure?", marks: 8, sampleAnswer: "Isabella rejects physical love for religious duty; Angelo conflates lust with marriage; shows complexity of both concepts", difficulty: 3, examBoard: "Edexcel", year: 2023 }
        ],
        biology: [
          { question: "What is the name of the protein that carries oxygen in the blood?", marks: 1, sampleAnswer: "Haemoglobin", difficulty: 1, examBoard: "Edexcel", year: 2023 },
          { question: "Describe the role of the liver in the human body.", marks: 4, sampleAnswer: "Detoxifies blood, stores glucose as glycogen, produces bile for digestion, breaks down proteins", difficulty: 2, examBoard: "Edexcel", year: 2023 },
          { question: "Explain how antibodies protect the body from pathogens.", marks: 6, sampleAnswer: "Antibodies recognise antigens on pathogens; bind to them marking for destruction by white blood cells", difficulty: 3, examBoard: "Edexcel", year: 2023 }
        ],
        chemistry: [
          { question: "What is the name of the compound H₂SO₄?", marks: 1, sampleAnswer: "Sulfuric acid", difficulty: 1, examBoard: "Edexcel", year: 2023 },
          { question: "Describe the structure of an atom and identify the relative charge on each subatomic particle.", marks: 4, sampleAnswer: "Nucleus contains protons (+ve) and neutrons (neutral); electrons (-ve) orbit in shells", difficulty: 2, examBoard: "Edexcel", year: 2023 },
          { question: "Explain what happens when calcium reacts with water and write the chemical equation.", marks: 6, sampleAnswer: "Vigorous reaction producing hydrogen gas and calcium hydroxide; Ca + 2H₂O → Ca(OH)₂ + H₂", difficulty: 3, examBoard: "Edexcel", year: 2023 }
        ],
        physics: [
          { question: "Define force and state its SI unit.", marks: 2, sampleAnswer: "Force is a push or pull that changes motion; measured in Newtons (N)", difficulty: 1, examBoard: "Edexcel", year: 2023 },
          { question: "A 5kg object accelerates at 3 m/s². Calculate the force using F=ma.", marks: 3, sampleAnswer: "F = ma = 5 × 3 = 15 N", difficulty: 2, examBoard: "Edexcel", year: 2023 },
          { question: "Explain how energy is transferred when a ball falls and bounces.", marks: 7, sampleAnswer: "Gravitational PE converts to KE falling; KE converts to elastic PE on impact; energy loss due to heat/sound", difficulty: 3, examBoard: "Edexcel", year: 2023 }
        ],
        "combined-science": [
          { question: "Identify two control variables that should be kept constant in a photosynthesis experiment.", marks: 2, sampleAnswer: "Light wavelength, temperature, CO₂ concentration, or plant species", difficulty: 1, examBoard: "Edexcel", year: 2023 },
          { question: "Describe the path of blood through the heart during one complete heartbeat.", marks: 4, sampleAnswer: "Deoxygenated blood enters right atrium; right ventricle pumps to lungs; oxygenated blood returns to left atrium", difficulty: 2, examBoard: "Edexcel", year: 2023 },
          { question: "Explain the process of natural selection and how it leads to evolution.", marks: 6, sampleAnswer: "Organisms with beneficial traits survive and reproduce; traits passed on; species gradually adapt to environment", difficulty: 3, examBoard: "Edexcel", year: 2023 }
        ],
        geography: [
          { question: "What is the definition of a tectonic plate and name three plates.", marks: 2, sampleAnswer: "Rigid section of Earth's crust; Pacific, North American, Eurasian plates", difficulty: 1, examBoard: "Edexcel", year: 2023 },
          { question: "Explain how earthquakes are caused and the difference between the epicentre and focus.", marks: 4, sampleAnswer: "Released tension at plate boundaries causes sudden movement; focus is origin point underground; epicentre on surface", difficulty: 2, examBoard: "Edexcel", year: 2023 },
          { question: "Analyse why some natural disasters occur more frequently in certain regions.", marks: 7, sampleAnswer: "Plate boundaries concentrate earthquakes; tropical regions experience hurricanes; geography determines hazard type", difficulty: 3, examBoard: "Edexcel", year: 2023 }
        ],
        history: [
          { question: "Who was Christopher Columbus and what was the significance of his voyage?", marks: 2, sampleAnswer: "Italian explorer who sailed for Spain; reached Americas in 1492 initiating European colonisation", difficulty: 1, examBoard: "Edexcel", year: 2023 },
          { question: "Analyse the causes of the English Civil War.", marks: 4, sampleAnswer: "Religious conflict, parliamentary rights vs royal authority, taxation disputes led to civil war", difficulty: 2, examBoard: "Edexcel", year: 2023 },
          { question: "Evaluate the impact of the British Empire on colonised nations.", marks: 8, sampleAnswer: "Infrastructure and trade networks developed; but exploitation of resources and people occurred; cultural suppression", difficulty: 3, examBoard: "Edexcel", year: 2023 }
        ],
        "business-studies": [
          { question: "What is market segmentation and why is it important?", marks: 2, sampleAnswer: "Dividing market into distinct groups; allows targeted marketing and better customer understanding", difficulty: 1, examBoard: "Edexcel", year: 2023 },
          { question: "Explain the stages of the product lifecycle and how marketing changes through each stage.", marks: 4, sampleAnswer: "Introduction: awareness building. Growth: increasing sales. Maturity: competition increases. Decline: phase out", difficulty: 2, examBoard: "Edexcel", year: 2023 },
          { question: "Analyse the relationship between cash flow and profit in a business.", marks: 7, sampleAnswer: "Profit is revenue minus costs; Cash flow is money in/out timing. Business can be profitable but lack cash", difficulty: 3, examBoard: "Edexcel", year: 2023 }
        ]
      },
      ocr: {
        mathematics: [
          { question: "Expand brackets: 3(x + 4) - 2(x - 1)", marks: 2, sampleAnswer: "3x + 12 - 2x + 2 = x + 14", difficulty: 1, examBoard: "OCR", year: 2023 },
          { question: "Find the value of y when x=3 in the equation: y = 2x² - 5x + 3", marks: 4, sampleAnswer: "y = 2(9) - 5(3) + 3 = 18 - 15 + 3 = 6", difficulty: 2, examBoard: "OCR", year: 2023 },
          { question: "Prove that the sum of any three consecutive odd numbers is always divisible by 3.", marks: 6, sampleAnswer: "(2n-1) + (2n+1) + (2n+3) = 6n + 3 = 3(2n+1), always divisible by 3", difficulty: 3, examBoard: "OCR", year: 2023 }
        ],
        "english-language": [
          { question: "What is the purpose of this advertisement and who is the target audience?", marks: 2, sampleAnswer: "Purpose: persuade consumers to buy product. Target: young adults aged 18-25", difficulty: 1, examBoard: "OCR", year: 2023 },
          { question: "Analyse three persuasive techniques used in this political campaign speech.", marks: 4, sampleAnswer: "Rhetorical questions engage audience; repetition emphasises key messages; emotive language appeals to feelings", difficulty: 2, examBoard: "OCR", year: 2023 },
          { question: "Evaluate the effectiveness of the writer's argument in this opinion piece.", marks: 8, sampleAnswer: "Arguments supported by evidence but some sweeping generalisations weaken case; conclusion summarises well", difficulty: 3, examBoard: "OCR", year: 2023 }
        ],
        "english-literature": [
          { question: "Describe the role of Puck in A Midsummer Night's Dream and his impact on the plot.", marks: 2, sampleAnswer: "Puck is the mischievous fairy servant who causes chaos through magic and misplaced love spells", difficulty: 1, examBoard: "OCR", year: 2023 },
          { question: "Analyse how Lord Capulet is presented as a controlling figure in Romeo and Juliet.", marks: 4, sampleAnswer: "His rage towards Romeo; demands Juliet marry Paris; attempts to control through fear and authority", difficulty: 2, examBoard: "OCR", year: 2023 },
          { question: "How does Wilfred Owen use poetry to criticise the nature of warfare?", marks: 8, sampleAnswer: "Graphic imagery of death; ironic titles contrast with horrors; addresses readers directly to provoke response", difficulty: 3, examBoard: "OCR", year: 2023 }
        ],
        biology: [
          { question: "What are the four main groups of organic molecules in living organisms?", marks: 1, sampleAnswer: "Carbohydrates, proteins, lipids, nucleic acids", difficulty: 1, examBoard: "OCR", year: 2023 },
          { question: "Describe the process of aerobic respiration and name the three main stages.", marks: 4, sampleAnswer: "Glycolysis in cytoplasm; Citric acid cycle in mitochondria; Electron transport chain produces ATP", difficulty: 2, examBoard: "OCR", year: 2023 },
          { question: "Explain how the structure of a red blood cell is adapted to its function of transporting oxygen.", marks: 6, sampleAnswer: "Large surface area for oxygen absorption; biconcave shape increases curvature; no nucleus provides space for haemoglobin", difficulty: 3, examBoard: "OCR", year: 2023 }
        ],
        chemistry: [
          { question: "What is a mole and why is it useful in chemistry?", marks: 1, sampleAnswer: "Unit measuring amount of substance; allows quantification of atoms/molecules in reactions", difficulty: 1, examBoard: "OCR", year: 2023 },
          { question: "Explain the relationship between electronegativity and bond polarity.", marks: 4, sampleAnswer: "Atoms with large electronegativity difference form polar covalent bonds; electrons drawn towards bonded atom", difficulty: 2, examBoard: "OCR", year: 2023 },
          { question: "Describe the industrial manufacture of ammonia by the Haber process including conditions.", marks: 6, sampleAnswer: "Combines N₂ and H₂ at high temperature/pressure over iron catalyst; reversible reaction producing ammonia", difficulty: 3, examBoard: "OCR", year: 2023 }
        ],
        physics: [
          { question: "What is the difference between distance and displacement?", marks: 2, sampleAnswer: "Distance is total path length (scalar); Displacement is straight-line distance with direction (vector)", difficulty: 1, examBoard: "OCR", year: 2023 },
          { question: "A ball thrown vertically upward reaches 20m height. Calculate initial velocity (g=10 m/s²).", marks: 3, sampleAnswer: "Using v²=u²+2as: 0=u²-2(10)(20); u²=400; u=20 m/s", difficulty: 2, examBoard: "OCR", year: 2023 },
          { question: "Explain momentum conservation in a collision and derive the principle mathematically.", marks: 7, sampleAnswer: "Before collision: m₁u₁ + m₂u₂ = After: m₁v₁ + m₂v₂; equal and opposite forces means momentum conserved", difficulty: 3, examBoard: "OCR", year: 2023 }
        ],
        "combined-science": [
          { question: "Name the process where plants absorb water through their roots.", marks: 2, sampleAnswer: "Osmosis", difficulty: 1, examBoard: "OCR", year: 2023 },
          { question: "Describe the structure of a virus and explain why it is not considered a living organism.", marks: 4, sampleAnswer: "Genetic material (DNA/RNA) surrounded by protein coat; cannot reproduce or metabolise without host cell", difficulty: 2, examBoard: "OCR", year: 2023 },
          { question: "Explain the process of transpiration and transport of minerals in plants.", marks: 6, sampleAnswer: "Water evaporates creating tension in xylem; minerals transported dissolved in water through xylem and phloem", difficulty: 3, examBoard: "OCR", year: 2023 }
        ],
        geography: [
          { question: "Define weathering and name the three main types.", marks: 2, sampleAnswer: "Breaking down rocks in place; mechanical (freezing), chemical (oxidation), biological (roots)", difficulty: 1, examBoard: "OCR", year: 2023 },
          { question: "Explain the formation of a beach and factors that affect sediment type.", marks: 4, sampleAnswer: "Formed by deposition; sediment size depends on wave energy, source rocks, and coastal currents", difficulty: 2, examBoard: "OCR", year: 2023 },
          { question: "Analyse human impacts on the carbon cycle and consequences of increased atmospheric CO₂.", marks: 7, sampleAnswer: "Fossil fuel burning increases CO₂; deforestation reduces uptake; leads to greenhouse effect and climate change", difficulty: 3, examBoard: "OCR", year: 2023 }
        ],
        history: [
          { question: "What were the main features of feudal society in medieval Europe?", marks: 2, sampleAnswer: "Hierarchy of king, nobles, knights, peasants; land-based power; religious authority of Church", difficulty: 1, examBoard: "OCR", year: 2023 },
          { question: "Analyse the key causes of the Black Death and its social impact.", marks: 4, sampleAnswer: "Spread by rats/trade routes; killed 1/3 of Europe; labour shortage increased peasant power; broke feudal ties", difficulty: 2, examBoard: "OCR", year: 2023 },
          { question: "Evaluate whether the Renaissance marked a clear break from medieval society.", marks: 8, sampleAnswer: "Intellectual rebirth emphasised humanism and art; challenged religious authority; though some continuity existed", difficulty: 3, examBoard: "OCR", year: 2023 }
        ],
        "business-studies": [
          { question: "What are the main differences between primary and secondary research?", marks: 2, sampleAnswer: "Primary: original data collected directly (surveys). Secondary: existing published data analysed", difficulty: 1, examBoard: "OCR", year: 2023 },
          { question: "Explain different pricing strategies a business might use (cost-plus, competitive, penetration).", marks: 4, sampleAnswer: "Cost-plus: adds profit margin. Competitive: matches market. Penetration: low price to gain market share", difficulty: 2, examBoard: "OCR", year: 2023 },
          { question: "Analyse ethical issues businesses face when expanding into developing countries.", marks: 7, sampleAnswer: "Labour exploitation, environmental damage, cultural impact; balancing profit vs responsibility and sustainability", difficulty: 3, examBoard: "OCR", year: 2023 }
        ]
      },
      wjec: {
        mathematics: [
          { question: "Calculate: (2/3 + 1/4) × 12", marks: 2, sampleAnswer: "(8/12 + 3/12) × 12 = 11/12 × 12 = 11", difficulty: 1, examBoard: "WJEC", year: 2023 },
          { question: "Given f(x) = 3x - 2, find f(5) and f⁻¹(x).", marks: 4, sampleAnswer: "f(5) = 13. f⁻¹(x) = (x+2)/3", difficulty: 2, examBoard: "WJEC", year: 2023 },
          { question: "Solve sin(x) = 0.5 for 0° ≤ x ≤ 360°", marks: 6, sampleAnswer: "x = 30° and x = 150°", difficulty: 3, examBoard: "WJEC", year: 2023 }
        ],
        "english-language": [
          { question: "Identify the type of text (genre) and explain how you can tell.", marks: 2, sampleAnswer: "Newspaper article: headline, byline, journalistic style, formal tone", difficulty: 1, examBoard: "WJEC", year: 2023 },
          { question: "Compare the tone and style of two texts on the same topic.", marks: 4, sampleAnswer: "Text A: formal and informative. Text B: casual and entertaining. Different word choices reflect target audiences", difficulty: 2, examBoard: "WJEC", year: 2023 },
          { question: "Write a persuasive letter arguing for/against a social issue.", marks: 8, sampleAnswer: "Clear position stated; evidence provided; addresses counter-arguments; rhetorical devices used effectively", difficulty: 3, examBoard: "WJEC", year: 2023 }
        ],
        "english-literature": [
          { question: "Who is the narrator in the text and what effect does this have on the reader?", marks: 2, sampleAnswer: "First-person narrator creates intimacy and reveals subjective perspective limited to their experience", difficulty: 1, examBoard: "WJEC", year: 2023 },
          { question: "Analyse how the writer builds suspense through plot structure and technique.", marks: 4, sampleAnswer: "Reveals information gradually; uses cliffhangers; foreshadowing hints at coming events", difficulty: 2, examBoard: "WJEC", year: 2023 },
          { question: "How does the author use Gothic elements to explore themes in this novel?", marks: 8, sampleAnswer: "Atmospheric settings create menace; supernatural elements represent psychological terror; darkness as metaphor", difficulty: 3, examBoard: "WJEC", year: 2023 }
        ],
        biology: [
          { question: "What is the approximate pH range for the human stomach?", marks: 1, sampleAnswer: "1-2 (highly acidic)", difficulty: 1, examBoard: "WJEC", year: 2023 },
          { question: "Describe the structure and function of the three types of blood vessels.", marks: 4, sampleAnswer: "Arteries: carry blood from heart, thick walls, narrow lumen. Veins: return to heart. Capillaries: exchange with tissues", difficulty: 2, examBoard: "WJEC", year: 2023 },
          { question: "Explain the mechanism of muscle contraction at the molecular level.", marks: 6, sampleAnswer: "Actin and myosin filaments slide; tropomyosin moves exposing binding sites; myosin heads pull actin", difficulty: 3, examBoard: "WJEC", year: 2023 }
        ],
        chemistry: [
          { question: "What is the name and formula of table salt?", marks: 1, sampleAnswer: "Sodium chloride (NaCl)", difficulty: 1, examBoard: "WJEC", year: 2023 },
          { question: "Explain the process of electrolysis and give one industrial example.", marks: 4, sampleAnswer: "Electric current splits compounds; cathode reduction, anode oxidation; used in copper refining", difficulty: 2, examBoard: "WJEC", year: 2023 },
          { question: "Describe the mechanism of an acid-base reaction at the molecular level.", marks: 6, sampleAnswer: "H⁺ from acid accepts electron pair from base; forms covalent bond; salt and water produced", difficulty: 3, examBoard: "WJEC", year: 2023 }
        ],
        physics: [
          { question: "What is the SI unit of energy and how is it defined?", marks: 2, sampleAnswer: "Joule (J); energy transferred when 1N force acts over 1m distance", difficulty: 1, examBoard: "WJEC", year: 2023 },
          { question: "Calculate the power of a machine that does 1500J of work in 6 seconds.", marks: 3, sampleAnswer: "Power = Work/Time = 1500/6 = 250 W", difficulty: 2, examBoard: "WJEC", year: 2023 },
          { question: "Explain how a transformer works and distinguish between step-up and step-down transformers.", marks: 7, sampleAnswer: "Changing magnetic field in primary coil induces current in secondary; step-up increases voltage, step-down decreases", difficulty: 3, examBoard: "WJEC", year: 2023 }
        ],
        "combined-science": [
          { question: "Name two non-renewable energy sources and give one advantage and one disadvantage of each.", marks: 2, sampleAnswer: "Coal: reliable but pollutes. Oil: energy dense but finite and pollutes", difficulty: 1, examBoard: "WJEC", year: 2023 },
          { question: "Describe the role of mitochondria and chloroplasts in cellular energy production.", marks: 4, sampleAnswer: "Mitochondria produce ATP through respiration in all cells; Chloroplasts use sunlight to make glucose in plants", difficulty: 2, examBoard: "WJEC", year: 2023 },
          { question: "Explain the role of microorganisms in recycling carbon and nitrogen in ecosystems.", marks: 6, sampleAnswer: "Bacteria decompose dead matter releasing CO₂; convert proteins to nitrates; essential for nutrient cycling", difficulty: 3, examBoard: "WJEC", year: 2023 }
        ],
        geography: [
          { question: "What is the difference between a sustainable and non-sustainable resource?", marks: 2, sampleAnswer: "Sustainable: renewable or managed. Non-sustainable: finite or overexploited faster than regeneration", difficulty: 1, examBoard: "WJEC", year: 2023 },
          { question: "Describe how urbanisation has impacted the environment in one named country.", marks: 4, sampleAnswer: "China: rapid urban expansion causes air pollution, water scarcity, habitat loss, resource depletion", difficulty: 2, examBoard: "WJEC", year: 2023 },
          { question: "Analyse strategies for managing drought in arid climate regions.", marks: 7, sampleAnswer: "Irrigation efficiency, water harvesting, desalination, afforestation; balance development with sustainability", difficulty: 3, examBoard: "WJEC", year: 2023 }
        ],
        history: [
          { question: "What was the significance of the signing of Magna Carta in 1215?", marks: 2, sampleAnswer: "Limited royal power, established rule of law, protected nobles' rights, foundation for democracy", difficulty: 1, examBoard: "WJEC", year: 2023 },
          { question: "Analyse the key causes of American independence from Britain.", marks: 4, sampleAnswer: "Taxation without representation, restrictive trade policies, Enlightenment ideas, colonial resentment", difficulty: 2, examBoard: "WJEC", year: 2023 },
          { question: "Evaluate the extent to which the League of Nations was successful in maintaining peace.", marks: 8, sampleAnswer: "Failed to stop Japanese invasion of Manchuria, Italian invasion of Abyssinia; weak enforcement mechanisms", difficulty: 3, examBoard: "WJEC", year: 2023 }
        ],
        "business-studies": [
          { question: "Define stakeholders and identify three examples relevant to a school.", marks: 2, sampleAnswer: "Anyone affected by business; students, teachers, parents, community", difficulty: 1, examBoard: "WJEC", year: 2023 },
          { question: "Explain the advantages and disadvantages of franchising as a business growth strategy.", marks: 4, sampleAnswer: "Advantages: rapid expansion, shared investment. Disadvantages: loss of control, quality inconsistency", difficulty: 2, examBoard: "WJEC", year: 2023 },
          { question: "Analyse how globalisation has affected employment in developed and developing countries.", marks: 7, sampleAnswer: "Job losses in manufacturing but service growth; outsourcing creates jobs in developing world; inequality increases", difficulty: 3, examBoard: "WJEC", year: 2023 }
        ]
      }
    };

    // Get the correct exam board key
    const examBoardKey = examBoardSlug?.toLowerCase() || "aqa";
    const subjectKey = subjectSlug.toLowerCase();

    // Get questions for this exam board and subject
    const boardQuestions = examBoardsData[examBoardKey];
    if (!boardQuestions) {
      console.error(`Exam board ${examBoardKey} not found`);
      return [];
    }

    const questions = boardQuestions[subjectKey] || boardQuestions["combined-science"] || [];

    return questions.slice(0, take).map((q, idx) => ({
      id: `${subjectSlug}-${examBoardKey}-q${idx}`,
      topicId: `${subjectSlug}-topic${idx}`,
      prompt: q.question,
      correctAnswer: q.sampleAnswer,
      topic: { title: `Question ${idx + 1}` },
      marks: q.marks,
      difficulty: q.difficulty,
      examBoard: q.examBoard,
      year: q.year,
    }));
  } catch (error) {
    console.error("Error fetching diagnostic questions:", error);
    return [];
  }
}

/**
 * Save diagnostic quiz results and create weakness prediction
 */
export async function saveDiagnosticResult({
  userId,
  subjectSlug,
  answers,
}: {
  userId: string;
  subjectSlug: string;
  answers: Array<{ questionId: string; selected: string }>;
}) {
  // Get the subject
  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
  });

  if (!subject) {
    throw new Error(`Subject ${subjectSlug} not found`);
  }

  // Get the user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error(`User ${userId} not found`);
  }

  // For now, calculate score based on answer count (simplified)
  // In the future, this would check against actual question answers
  const correctCount = Math.min(answers.length, 8); // Assume all answered for now
  const grade = scoreToGrade(correctCount, 8);

  // Find topics related to wrong answers
  const topics = await prisma.topic.findMany({
    where: { subjectId: subject.id },
    select: { id: true, title: true },
  });

  const predictedGrade =
    correctCount <= 2 ? 3 : correctCount <= 4 ? 5 : correctCount <= 6 ? 7 : 9;

  // Create/update weakness prediction for the subject
  for (const topic of topics.slice(0, 3)) {
    await prisma.weaknessPrediction.upsert({
      where: {
        userId_topicId: {
          userId,
          topicId: topic.id,
        },
      },
      update: {
        riskScore: Math.max(0, Math.ceil((8 - correctCount) * 12.5)), // 0-100 scale
        confidenceScore: Math.min(100, correctCount * 12.5),
      },
      create: {
        userId,
        topicId: topic.id,
        riskScore: Math.max(0, Math.ceil((8 - correctCount) * 12.5)),
        confidenceScore: Math.min(100, correctCount * 12.5),
        predictedMarkLoss: Math.max(0, 100 - grade.charCodeAt(0)),
        recommendedActions: `Focus on ${subject.title} fundamentals and practice similar questions`,
        targetBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      },
    });

    await prisma.userFocusArea.create({
      data: {
        userId,
        topicId: topic.id,
        subjectId: subject.id,
        reason: `Recommended after your ${subject.title} diagnostic.`,
      },
    });
  }

  await prisma.userSubjectPrediction.upsert({
    where: {
      userId_subjectId: {
        userId,
        subjectId: subject.id,
      },
    },
    update: {
      predictedGrade,
      confidence: Math.min(1, Math.max(0.35, correctCount / 8)),
    },
    create: {
      userId,
      subjectId: subject.id,
      predictedGrade,
      confidence: Math.min(1, Math.max(0.35, correctCount / 8)),
    },
  });

  // Mark user as onboarded
  await prisma.user.update({
    where: { id: userId },
    data: {
      onboardedAt: new Date(),
    },
  });

  // Award XP and handle level ups
  const xpEarned = answers.length * 10;
  const rpg = await addXP(userId, xpEarned);

  // Award badge for first quiz
  await awardBadge(userId, "CONSISTENCY_KING");
  await syncLevelBadges(userId, levelFromXP(rpg.totalXP));

  // Log the study session
  await logDailyStudy(userId, "diagnostic-quiz");

  return {
    score: correctCount,
    grade,
    xpEarned,
    recommendedTopicIds: topics.slice(0, 3).map((t) => t.id),
  };
}
