import prisma from "../lib/prisma";

const questionsData = {
  mathematics: [
    {
      questionText: "Solve the equation 3x + 5 = 20",
      marks: 3,
      sampleAnswer: "3x + 5 = 20\n3x = 15\nx = 5",
      markingCriteria: JSON.stringify({
        rearranging: 1,
        simplification: 1,
        finalAnswer: 1
      }),
      difficulty: 1,
      examBoard: "AQA",
      year: 2023
    },
    {
      questionText: "A rectangular garden has length 12m and width 8m. Calculate the area and perimeter.",
      marks: 6,
      sampleAnswer: "Area = length × width = 12 × 8 = 96 m²\nPerimeter = 2(length + width) = 2(12 + 8) = 2(20) = 40m",
      markingCriteria: JSON.stringify({
        areaFormula: 1,
        areaCalculation: 1,
        perimeterFormula: 2,
        perimeterCalculation: 1,
        units: 1
      }),
      difficulty: 2,
      examBoard: "Edexcel"
    },
    {
      questionText: "The population of a town increases by 15% each year. If the initial population is 50,000, what will it be after 3 years? Show your working.",
      marks: 9,
      sampleAnswer: "Year 1: 50,000 × 1.15 = 57,500\nYear 2: 57,500 × 1.15 = 66,125\nYear 3: 66,125 × 1.15 = 76,043.75\nOr: 50,000 × (1.15)³ = 50,000 × 1.520875 = 76,043.75\nPopulation after 3 years ≈ 76,044 (rounded to nearest whole number)",
      markingCriteria: JSON.stringify({
        multiplierIdentification: 2,
        yearOneCalculation: 1,
        yearTwoCalculation: 1,
        yearThreeCalculation: 1,
        alternativeMethod: 2,
        rounding: 1,
        units: 1
      }),
      difficulty: 3,
      examBoard: "OCR"
    }
  ],
  english: [
    {
      questionText: "Write a short paragraph (3-4 sentences) explaining the main theme of a text you have studied.",
      marks: 3,
      sampleAnswer: "The main theme of the text is the struggle between good and evil. The author uses various literary techniques to convey this idea throughout the narrative.",
      markingCriteria: JSON.stringify({
        themeIdentification: 1,
        explanation: 1,
        clarity: 1
      }),
      difficulty: 1,
      examBoard: "AQA"
    },
    {
      questionText: "Analyse how the writer uses language in the following extract. Write about 150 words.",
      marks: 6,
      sampleAnswer: "The writer employs vivid descriptive language and metaphor to create atmosphere. Words such as 'dark', 'foreboding', and 'silent' establish a sense of unease. The metaphor 'the night swallowed the village' personifies darkness and emphasizes the inevitability of the approaching danger.",
      markingCriteria: JSON.stringify({
        vocabularyIdentification: 1,
        literaryTechniques: 2,
        explanation: 2,
        wordCount: 1
      }),
      difficulty: 2,
      examBoard: "Edexcel"
    },
    {
      questionText: "Compare how two texts explore the theme of loss. Consider language, structure, and ideas. Write about 300 words.",
      marks: 9,
      sampleAnswer: "Both texts explore loss but through different perspectives. Text A uses imagery of decay, while Text B employs cyclical structure to show repeated loss. Both employ emotional language to connect with readers.",
      markingCriteria: JSON.stringify({
        themeComparison: 2,
        languageAnalysis: 2,
        structureAnalysis: 2,
        textualEvidence: 2,
        writingQuality: 1
      }),
      difficulty: 4,
      examBoard: "WJEC"
    }
  ],
  biology: [
    {
      questionText: "Name the process by which plants make their own food using sunlight.",
      marks: 3,
      sampleAnswer: "Photosynthesis",
      markingCriteria: JSON.stringify({
        processName: 1,
        spelling: 1,
        accuracy: 1
      }),
      difficulty: 1,
      examBoard: "AQA"
    },
    {
      questionText: "Describe the structure of a plant cell and name four specialized structures and their functions.",
      marks: 6,
      sampleAnswer: "Cell wall - provides support and protection\nChlorophast - site of photosynthesis\nVacuole - stores water and nutrients\nNucleus - controls cell activities",
      markingCriteria: JSON.stringify({
        structureOne: 1,
        structureTwo: 1,
        structureThree: 1,
        structureFour: 1,
        functionOne: 0.5,
        functionTwo: 0.5
      }),
      difficulty: 2,
      examBoard: "Edexcel"
    },
    {
      questionText: "Explain how the structure of the small intestine is adapted for absorption of digested food. Reference appropriate scientific terms in your answer.",
      marks: 9,
      sampleAnswer: "The small intestine has several adaptations for absorption. Villi increase surface area for absorption. Microvilli on epithelial cells further increase surface area. Rich blood supply transports absorbed nutrients away rapidly. Thin epithelium allows diffusion of nutrients.",
      markingCriteria: JSON.stringify({
        villiFunction: 2,
        microvilliFunction: 2,
        bloodSupply: 2,
        epitheliumThickness: 2,
        scientificTerminology: 1
      }),
      difficulty: 4,
      examBoard: "OCR"
    }
  ],
  chemistry: [
    {
      questionText: "What is the chemical formula for sodium chloride?",
      marks: 3,
      sampleAnswer: "NaCl",
      markingCriteria: JSON.stringify({
        formula: 1,
        ions: 1,
        accuracy: 1
      }),
      difficulty: 1,
      examBoard: "AQA"
    },
    {
      questionText: "Describe the difference between ionic and covalent bonding. Give one example of each.",
      marks: 6,
      sampleAnswer: "Ionic bonding occurs between metals and non-metals through electron transfer, forming charged ions. Example: NaCl\nCovalent bonding occurs between non-metals through electron sharing. Example: H₂O",
      markingCriteria: JSON.stringify({
        ionicDefinition: 2,
        covalentDefinition: 2,
        ionicExample: 1,
        covalentExample: 1
      }),
      difficulty: 2,
      examBoard: "Edexcel"
    }
  ],
  physics: [
    {
      questionText: "Define velocity and explain how it differs from speed.",
      marks: 3,
      sampleAnswer: "Velocity is the rate of change of displacement in a specified direction (vector). Speed is the rate of change of distance (scalar) and does not include direction.",
      markingCriteria: JSON.stringify({
        velocityDefinition: 1,
        speedDefinition: 1,
        difference: 1
      }),
      difficulty: 1,
      examBoard: "AQA"
    },
    {
      questionText: "A car travels 60 metres in 4 seconds at constant speed. Calculate its speed and explain your working.",
      marks: 6,
      sampleAnswer: "Speed = distance ÷ time = 60 ÷ 4 = 15 m/s\nThis is calculated using the formula speed = distance/time. The car travels 15 metres every second.",
      markingCriteria: JSON.stringify({
        formulaIdentification: 1,
        substitution: 1,
        calculation: 1,
        units: 1,
        explanation: 1,
        clarification: 1
      }),
      difficulty: 2,
      examBoard: "Edexcel"
    }
  ],
  geography: [
    {
      questionText: "Name three types of rocks and how they are formed.",
      marks: 3,
      sampleAnswer: "Igneous - formed from cooling magma\nSedimentary - formed from compacted sediment\nMetamorphic - formed from existing rocks under heat and pressure",
      markingCriteria: JSON.stringify({
        rockTypeOne: 0.5,
        rockTypeTwo: 0.5,
        rockTypeThree: 0.5,
        formationOne: 0.5,
        formationTwo: 0.5,
        formationThree: 0.5
      }),
      difficulty: 2,
      examBoard: "AQA"
    },
    {
      questionText: "Describe how erosion by a river affects its valley over time.",
      marks: 6,
      sampleAnswer: "Rivers use hydraulic action and abrasion to erode their banks and beds. Initially forming V-shaped valleys in mountainous areas, the river widens and deepens the valley through vertical erosion. As gradient decreases, lateral erosion dominates, creating wider, flatter valleys with meanders.",
      markingCriteria: JSON.stringify({
        erosionMechanisms: 2,
        vShapedValley: 1,
        valleyCharacteristics: 1,
        timescale: 1,
        explanation: 1
      }),
      difficulty: 3,
      examBoard: "Edexcel"
    }
  ],
  history: [
    {
      questionText: "What was the main cause of World War I? Explain in 2-3 sentences.",
      marks: 3,
      sampleAnswer: "The alliance system created tension in Europe. The assassination of Archduke Franz Ferdinand triggered these tensions. European powers were drawn into conflict through their treaty obligations.",
      markingCriteria: JSON.stringify({
        allianceSystem: 1,
        trigger: 1,
        explanation: 1
      }),
      difficulty: 1,
      examBoard: "AQA"
    },
    {
      questionText: "Analyse the impact of the Industrial Revolution on British society. Write about 200 words.",
      marks: 6,
      sampleAnswer: "The Industrial Revolution transformed British society economically and socially. The rise of factories created new industrial cities with dense populations. Working conditions were often harsh, but economic growth increased prosperity. Traditional agricultural society shifted to urban industrial society.",
      markingCriteria: JSON.stringify({
        economicImpact: 2,
        socialImpact: 2,
        historicalAccuracy: 1,
        writingQuality: 1
      }),
      difficulty: 3,
      examBoard: "Edexcel"
    }
  ],
  computerScience: [
    {
      questionText: "What is the primary purpose of an operating system?",
      marks: 3,
      sampleAnswer: "The operating system manages hardware resources and provides an interface between the user and computer hardware. It allocates memory, controls input/output devices, and manages file systems.",
      markingCriteria: JSON.stringify({
        resourceManagement: 1,
        interface: 1,
        examples: 1
      }),
      difficulty: 1,
      examBoard: "AQA"
    },
    {
      questionText: "Explain the difference between RAM and ROM. Why does a computer need both?",
      marks: 6,
      sampleAnswer: "RAM (Random Access Memory) is volatile memory used for temporary storage during program execution. ROM (Read Only Memory) is permanent memory that stores the BIOS and boot instructions. Both are needed: ROM provides startup instructions while RAM allows programs to run efficiently.",
      markingCriteria: JSON.stringify({
        ramDefinition: 1,
        romDefinition: 1,
        ramFunction: 1,
        romFunction: 1,
        comparison: 1,
        necessity: 1
      }),
      difficulty: 2,
      examBoard: "Edexcel"
    }
  ]
};

async function seedQuestions() {
  try {
    console.log("🌱 Starting question seeding...\n");

    const subjectMap: { [key: string]: string } = {
      mathematics: "Mathematics",
      english: "English Language",
      biology: "Biology",
      chemistry: "Chemistry",
      physics: "Physics",
      geography: "Geography",
      history: "History",
      computerScience: "Computer Science"
    };

    for (const [key, questions] of Object.entries(questionsData)) {
      const subjectTitle = subjectMap[key];
      let slug = key;
      if (key === "computerScience") slug = "computer-science";
      if (key === "english") slug = "english-language";

      const subject = await prisma.subject.findUnique({
        where: { slug }
      });

      if (!subject) {
        console.log(`  ✗ Subject ${subjectTitle} not found`);
        continue;
      }

      for (const q of questions) {
        await prisma.question.create({
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
    }

    const totalQuestions = await prisma.question.count();
    console.log(`\n✨ Question seeding complete!`);
    console.log(`   • ${totalQuestions} total questions`);

  } catch (error) {
    console.error("Error seeding questions:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedQuestions();
