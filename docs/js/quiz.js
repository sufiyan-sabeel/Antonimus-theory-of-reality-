/* ================================================================ */
/* ANTONIMUS BOOK — QUIZ ENGINE                                    */
/* Interactive learning system: 6 question types, 3 difficulties,  */
/* hints, solutions, explanations, scoring, and progress            */
/* ================================================================ */

const QuizEngine = (() => {
  'use strict';

  /* ---- Question Banks ---- */
  const difficulty = { BEGINNER: 'beginner', INTERMEDIATE: 'intermediate', ADVANCED: 'advanced' };
  const qType = { MCQ: 'mcq', TRUE_FALSE: 'tf', FILL_BLANK: 'fill', NUMERICAL: 'numerical', EQUATION: 'equation', REASONING: 'reasoning' };

  // Questions organized by chapter, difficulty, and type
  const questionBank = {};

  /* ---- Generate a question for a given chapter ---- */
  function generateQuestion(chapterId, diff = null) {
    // Build question bank for this chapter if not cached
    if (!questionBank[chapterId]) {
      questionBank[chapterId] = buildChapterQuestions(chapterId);
    }

    const bank = questionBank[chapterId];
    if (!bank || bank.length === 0) return null;

    // Filter by difficulty if specified
    const filtered = diff ? bank.filter(q => q.difficulty === diff) : bank;
    if (filtered.length === 0) return null;

    // Pick a random question
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  /* ---- Generate N random questions for mixed quizzes ---- */
  function generateQuizSet(chapterId, count = 5, diff = null) {
    const set = [];
    const used = new Set();
    const bank = questionBank[chapterId] || buildChapterQuestions(chapterId);

    if (!bank || bank.length === 0) return set;

    const pool = diff ? bank.filter(q => q.difficulty === diff) : bank;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    for (const q of shuffled) {
      if (set.length >= count) break;
      if (!used.has(q.question)) {
        set.push(q);
        used.add(q.question);
      }
    }
    return set;
  }

  /* ---- Check an answer ---- */
  function checkAnswer(question, userAnswer) {
    const result = { correct: false, explanation: '', expectedAnswer: '' };

    if (!question) return result;

    switch (question.type) {
      case qType.MCQ:
      case qType.TRUE_FALSE:
        result.correct = String(userAnswer).toLowerCase().trim() === String(question.answer).toLowerCase().trim();
        result.expectedAnswer = question.answer;
        break;

      case qType.FILL_BLANK:
      case qType.NUMERICAL:
        result.correct = normalizeAnswer(userAnswer) === normalizeAnswer(question.answer);
        result.expectedAnswer = question.answer;
        break;

      case qType.EQUATION:
        result.correct = normalizeEquation(userAnswer, question);
        result.expectedAnswer = question.answer;
        break;

      case qType.REASONING:
        // For reasoning, check key concepts
        const keywords = question.keywords || [];
        const matched = keywords.filter(k =>
          userAnswer.toLowerCase().includes(k.toLowerCase())
        );
        result.correct = matched.length >= (question.minKeywords || keywords.length);
        result.matchedKeywords = matched.length;
        result.totalKeywords = keywords.length;
        result.expectedAnswer = question.answer;
        break;
    }

    result.explanation = question.explanation || '';
    return result;
  }

  /* ---- Normalize answers for comparison ---- */
  function normalizeAnswer(str) {
    if (str == null) return '';
    return String(str)
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[,\s]+$/, '')
      .replace(/^[,\s]+/, '')
      .trim();
  }

  /* ---- Equation answer checking (flexible) ---- */
  function normalizeEquation(userEq, question) {
    const acceptable = question.acceptableAnswers || [question.answer];
    const cleaned = userEq.replace(/\s+/g, '').toLowerCase();
    return acceptable.some(a => String(a).replace(/\s+/g, '').toLowerCase() === cleaned);
  }

  /* ---- Build chapter-specific questions ---- */
  function buildChapterQuestions(chapterId) {
    const questions = [];

    switch (chapterId) {
      /* ============ SECTION 1: INTRODUCTION ============ */
      case 's1':
        questions.push(
          // MCQ
          { type: qType.MCQ, difficulty: difficulty.BEGINNER,
            question: 'What is the central thesis of the Antonimus Theory of Reality?',
            options: ['Every human creation first existed as imagination',
                      'Reality is a simulation',
                      'Knowledge is more important than observation',
                      'Only physical laws govern creation'],
            answer: 'Every human creation first existed as imagination',
            explanation: 'The core Antonimus thesis states that every human creation — from art to technology — first existed as imagination before being realized through knowledge and action.',
            hint: 'Think about the relationship between ideas and their physical manifestations.' },

          { type: qType.TRUE_FALSE, difficulty: difficulty.BEGINNER,
            question: 'According to Antonimus, observation alone is sufficient to create innovation.',
            answer: 'False',
            explanation: 'Observation alone cannot create innovation. It must be combined with imagination, knowledge, and action to produce a realized outcome.',
            hint: 'What other components does the Universal Antonimus Law include?' },

          { type: qType.MCQ, difficulty: difficulty.INTERMEDIATE,
            question: 'Which philosopher is most closely associated with the concept of tabula rasa (blank slate), relevant to understanding how knowledge builds from observation?',
            options: ['John Locke', 'Immanuel Kant', 'Friedrich Nietzsche', 'Aristotle'],
            answer: 'John Locke',
            explanation: 'Locke\'s tabula rasa concept suggests the mind begins as a blank slate shaped by experience — complementary to the Antonimus emphasis on observation as a foundation for knowledge.',
            hint: 'This Enlightenment philosopher argued that all knowledge comes from experience.' },

          { type: qType.FILL_BLANK, difficulty: difficulty.BEGINNER,
            question: 'The Antonimus cycle begins with _____ and ends with _____.',
            answer: 'observation, innovation',
            acceptableAnswers: ['observation, innovation', 'reality, reality', 'observation, creation'],
            explanation: 'The cycle starts by observing reality and ends with creating innovation that changes reality.',
            hint: 'What comes first — seeing or doing?' },

          { type: qType.REASONING, difficulty: difficulty.ADVANCED,
            question: 'Explain how the Antonimus cycle differs from the scientific method in terms of the role of imagination.',
            answer: 'While the scientific method emphasizes hypothesis testing and reproducibility, the Antonimus cycle gives imagination a central generative role — imagination is the source of all human creations, not just a step in a process.',
            keywords: ['imagination', 'scientific method', 'generative', 'creation'],
            minKeywords: 2,
            explanation: 'The scientific method focuses on testing hypotheses through observation and experiment. Antonimus places imagination as the primary generative force, with observation and knowledge serving to guide and validate what imagination produces.',
            hint: 'Compare where imagination appears in each framework.' }
        );
        break;

      /* ============ SECTION 2: UNIVERSAL LAW ============ */
      case 's2':
        questions.push(
          { type: qType.MCQ, difficulty: difficulty.BEGINNER,
            question: 'How many components does the Universal Antonimus Law identify?',
            options: ['4', '5', '6', '7'],
            answer: '6',
            explanation: 'The Universal Antonimus Law has six components: Reality, Imagination, Knowledge, Observation, Action, and Time.',
            hint: 'Count the elements in the six-part statement.' },

          { type: qType.MCQ, difficulty: difficulty.INTERMEDIATE,
            question: '"Action transforms imagination into reality." This statement corresponds to which component of the Universal Law?',
            options: ['Action', 'Reality', 'Imagination', 'Time'],
            answer: 'Action',
            explanation: 'Action is the process that converts imaginative possibilities into realized outcomes in the physical world.',
            hint: 'What is the active ingredient that makes ideas tangible?' },

          { type: qType.TRUE_FALSE, difficulty: difficulty.BEGINNER,
            question: 'According to the Universal Law, Time reveals whether creations endure.',
            answer: 'True',
            explanation: 'Time is the component that tests the durability and value of creations. Some creations fade quickly; others endure for centuries.',
            hint: 'Think about how we judge the lasting impact of innovations.' },

          { type: qType.NUMERICAL, difficulty: difficulty.ADVANCED,
            question: 'If a creation has lasted 2500 years (since ancient Greek philosophy) and is still studied today, and another creation lasted only 2 years before becoming obsolete, what is the ratio of their temporal endurance?',
            answer: '1250',
            acceptableAnswers: ['1250', '1250:1', '1250 to 1'],
            explanation: '2500 / 2 = 1250. The first creation has 1250 times the temporal endurance of the second — a dramatic illustration of how Time reveals the difference between enduring and transient creations.',
            hint: 'Divide the longer duration by the shorter one.' },

          { type: qType.FILL_BLANK, difficulty: difficulty.INTERMEDIATE,
            question: 'The Universal Antonimus Law states: "Reality is limited by what exists. ________ explores what could exist."',
            answer: 'Imagination',
            explanation: 'Imagination is the faculty that transcends current reality to explore possibilities that do not yet exist.',
            hint: 'What human faculty allows us to think beyond the present?' }
        );
        break;

      /* ============ SECTION 3: UNIVERSAL EQUATION ============ */
      case 's3':
        questions.push(
          { type: qType.MCQ, difficulty: difficulty.BEGINNER,
            question: 'The Universal Equation R = f(I, K, O, A, T) expresses that Reality is a function of how many variables?',
            options: ['3', '4', '5', '6'],
            answer: '5',
            explanation: 'The five variables are Imagination (I), Knowledge (K), Observation (O), Action (A), and Time (T).',
            hint: 'Count the symbols inside the parentheses.' },

          { type: qType.EQUATION, difficulty: difficulty.INTERMEDIATE,
            question: 'Write the symbolic representation of the Universal Equation.',
            answer: 'R = f(I, K, O, A, T)',
            acceptableAnswers: ['R = f(I, K, O, A, T)', 'R=f(I,K,O,A,T)', 'f(I, K, O, A, T)'],
            explanation: 'The Universal Equation is R = f(I, K, O, A, T), where R is Reality and the variables are Imagination, Knowledge, Observation, Action, and Time.',
            hint: 'Remember: the dependent variable is on the left.' },

          { type: qType.MCQ, difficulty: difficulty.ADVANCED,
            question: 'Why is the function f intentionally left unspecified in the Universal Equation?',
            options: ['Because the interactions between variables are complex and context-dependent',
                      'Because the author forgot to define it',
                      'Because it represents a mathematical constant',
                      'Because it is only applicable to physics'],
            answer: 'Because the interactions between variables are complex and context-dependent',
            explanation: 'The function f is unspecified because the way these five factors interact varies significantly across different domains and contexts. In some cases, all factors must be present (multiplicative); in others, certain factors dominate.',
            hint: 'Think about whether creativity works the same way in art, science, and engineering.' },

          { type: qType.TRUE_FALSE, difficulty: difficulty.BEGINNER,
            question: 'Both observation and time are explicit variables in the Universal Equation.',
            answer: 'True',
            explanation: 'Unlike simpler models, the Universal Equation explicitly includes both Observation (O) for empirical feedback and Time (T) for the temporal dimension.',
            hint: 'Look at the equation: R = f(I, K, O, A, T).' },

          { type: qType.FILL_BLANK, difficulty: difficulty.INTERMEDIATE,
            question: 'In the three worked examples of the Universal Equation, the Wright brothers\' innovation is identified as the ____.',
            options: ['airplane', 'flight', 'aircraft', 'powered flight'],
            answer: 'airplane',
            acceptableAnswers: ['airplane', 'aircraft', 'powered flight', 'aeroplane'],
            explanation: 'The Wright brothers\' airplane is one of three examples illustrating the Universal Equation, alongside the World Wide Web and penicillin.',
            hint: 'What did the Wright brothers invent?' }
        );
        break;

      /* ============ SECTION 4: EXPANDED EQUATION ============ */
      case 's4':
        questions.push(
          { type: qType.MCQ, difficulty: difficulty.BEGINNER,
            question: 'The Expanded Equation adds which new variable not present in the basic Reality Formation equation?',
            options: ['Uncertainty (U)', 'Energy (E)', 'Mass (M)', 'Consciousness (C)'],
            answer: 'Uncertainty (U)',
            explanation: 'The Expanded Equation R = ((I x K x A) x O) / U introduces Uncertainty as a divisor — greater uncertainty reduces the probability of successful outcomes.',
            hint: 'What factor reduces the chances of a successful outcome?' },

          { type: qType.NUMERICAL, difficulty: difficulty.INTERMEDIATE,
            question: 'Using the Expanded Equation R = ((I x K x A) x O) / U, calculate R when I=8, K=7, A=6, O=9, and U=3.',
            answer: '1008',
            acceptableAnswers: ['1008'],
            explanation: 'R = ((8 x 7 x 6) x 9) / 3 = (336 x 9) / 3 = 3024 / 3 = 1008',
            hint: 'First multiply I x K x A, then multiply by O, then divide by U.' },

          { type: qType.MCQ, difficulty: difficulty.ADVANCED,
            question: 'What is the conceptual range of the Uncertainty variable (U)?',
            options: ['1 to large values (no upper bound)',
                      '0 to 1',
                      '-1 to 1',
                      '0 to 100'],
            answer: '1 to large values (no upper bound)',
            explanation: 'Uncertainty ranges from 1 (no uncertainty, ideal case) upward. Higher values represent greater uncertainty. The minimum is 1 because dividing by a fraction (U < 1) would inflate the outcome unrealistically.',
            hint: 'What happens to the equation if U = 0? Why would that be problematic?' },

          { type: qType.TRUE_FALSE, difficulty: difficulty.BEGINNER,
            question: 'Observation (O) multiplies the product (I x K x A) in the Expanded Equation.',
            answer: 'True',
            explanation: 'Observation provides validating feedback at each stage, so it is treated as a multiplier on the core product.',
            hint: 'Look at how O is positioned in the equation.' },

          { type: qType.REASONING, difficulty: difficulty.ADVANCED,
            question: 'Describe how increasing Knowledge (K) might reduce Uncertainty (U) in the Expanded Equation, and why this relationship matters for the Antonimus framework.',
            answer: 'Greater knowledge reduces epistemic uncertainty by providing better models, more accurate predictions, and a deeper understanding of the problem space.',
            keywords: ['knowledge', 'uncertainty', 'epistemic', 'reduce'],
            minKeywords: 2,
            explanation: 'Knowledge and Uncertainty are inversely related: as knowledge grows, uncertainty shrinks. This relationship is central to the Antonimus framework — it explains why research, education, and expertise are essential for successful creation.',
            hint: 'Does knowing more about a problem make the outcome more or less predictable?' }
        );
        break;

      /* ============ SECTION 5: PREDICTION EQUATION ============ */
      case 's5':
        questions.push(
          { type: qType.MCQ, difficulty: difficulty.BEGINNER,
            question: 'Which of these is NOT a variable in the Prediction Equation P = I + E + K?',
            options: ['Observation (O)', 'Imagination (I)', 'Experience (E)', 'Knowledge (K)'],
            answer: 'Observation (O)',
            explanation: 'The Prediction Equation uses only three variables: Imagination (I), Experience (E), and Knowledge (K). Observation is part of the Universal Equation, not the Prediction Equation.',
            hint: 'The equation is P = I + E + K — which letter is missing?' },

          { type: qType.NUMERICAL, difficulty: difficulty.INTERMEDIATE,
            question: 'Using P = I + E + K, calculate the prediction capability P when I=9, E=7, K=8.',
            answer: '24',
            acceptableAnswers: ['24'],
            explanation: 'P = 9 + 7 + 8 = 24',
            hint: 'Add the three values together.' },

          { type: qType.MCQ, difficulty: difficulty.ADVANCED,
            question: 'Why is the Prediction Equation additive (P = I + E + K) rather than multiplicative like the Reality Formation equation?',
            options: ['Because experience and knowledge can partially substitute for each other',
                      'Because addition is mathematically simpler',
                      'Because prediction does not require all factors',
                      'Because multiplication would produce values that are too large'],
            answer: 'Because experience and knowledge can partially substitute for each other',
            explanation: 'The additive form indicates that rich experience can compensate for limited knowledge, and vice versa. This aligns with cognitive science research showing that both episodic memory (experience) and semantic memory (knowledge) contribute to prediction.',
            hint: 'Can someone with lots of practical experience predict well even without theoretical knowledge?' },

          { type: qType.TRUE_FALSE, difficulty: difficulty.BEGINNER,
            question: 'The Prediction Equation was inspired by Kahneman and Tversky\'s work on heuristics and biases.',
            answer: 'False',
            explanation: 'The Prediction Equation was inspired by cognitive science research on mental simulation and prediction, including work by Hawkins and others on how the brain generates predictions from past patterns.',
            hint: 'Which cognitive scientists are mentioned in Section 5 as influences?' }
        );
        break;

      /* ============ SECTION 6: SMALL CAUSE LAW ============ */
      case 's6':
        questions.push(
          { type: qType.MCQ, difficulty: difficulty.BEGINNER,
            question: 'The Small Cause Law is expressed by which equation?',
            options: ['G = s x C', 'R = f(I, K, O, A, T)', 'P = I + E + K', 'R = I x K x A'],
            answer: 'G = s x C',
            explanation: 'G = s x C, where G is the Great Outcome, s is the Small Cause, and C is the Chain of Consequences.',
            hint: 'G stands for Great Outcome, s for small cause, C for chain.' },

          { type: qType.MCQ, difficulty: difficulty.INTERMEDIATE,
            question: 'Which mechanism explains how one transistor (1947) led to modern computing?',
            options: ['Iterative amplification', 'Network effects', 'Threshold effects', 'Combinatorial explosion'],
            answer: 'Iterative amplification',
            explanation: 'The transistor\'s ability to amplify signals and be replicated in integrated circuits represents iterative amplification — a small advantage replicated many times becomes a large difference.',
            hint: 'Think about how a single component gets replicated millions of times.' },

          { type: qType.TRUE_FALSE, difficulty: difficulty.BEGINNER,
            question: 'The Small Cause Law claims that every small idea produces great outcomes.',
            answer: 'False',
            explanation: 'The Small Cause Law observes that when great outcomes occur, they often trace back to surprisingly small beginnings. It does not claim that every small idea produces great outcomes.',
            hint: 'Read the Antonimus insight in Section 6.3 carefully.' },

          { type: qType.NUMERICAL, difficulty: difficulty.ADVANCED,
            question: 'Using G = s x C, if a small cause s=3 produces a chain C=15, what is the great outcome G?',
            answer: '45',
            acceptableAnswers: ['45'],
            explanation: 'G = 3 x 15 = 45',
            hint: 'Multiply the two numbers together.' }
        );
        break;

      /* ============ SECTION 7: HUMAN CREATION EQUATION ============ */
      case 's7':
        questions.push(
          { type: qType.MCQ, difficulty: difficulty.BEGINNER,
            question: 'The Human Creation Equation models the creation process as:',
            options: ['I \u2192 K \u2192 E \u2192 A \u2192 R',
                      'R = I x K x A',
                      'P = I + E + K',
                      'O \u2192 K \u2192 I \u2192 A \u2192 R'],
            answer: 'I \u2192 K \u2192 E \u2192 A \u2192 R',
            explanation: 'The Human Creation Equation traces the temporal sequence: Imagination, Knowledge, Experiment, Action, Reality.',
            hint: 'The sequence starts with I and ends with R.' },

          { type: qType.MCQ, difficulty: difficulty.INTERMEDIATE,
            question: 'The Human Creation Equation represents the creation process as strictly sequential. Why is this a simplification?',
            options: ['Actual creation involves feedback loops and iteration, making it non-linear',
                      'Because the equation is meant to be solved mathematically',
                      'Because creativity only happens in one direction',
                      'Because the model was never intended to be accurate'],
            answer: 'Actual creation involves feedback loops and iteration, making it non-linear',
            explanation: 'Real-world creation is iterative and non-linear, with feedback loops from later stages informing earlier ones. The linear form is a simplification that captures the typical general progression.',
            hint: 'Do real innovations always follow a straight line from idea to product?' },

          { type: qType.REASONING, difficulty: difficulty.ADVANCED,
            question: 'Compare the Human Creation Equation (HCE) with the Universal Equation (UE). What does each model emphasize differently about the creative process?',
            answer: 'The HCE emphasizes temporal sequence — the order in which stages typically occur. The UE emphasizes interdependence — how multiple factors simultaneously interact to produce an outcome.',
            keywords: ['temporal sequence', 'interdependence', 'HCE', 'UE', 'order', 'factors'],
            minKeywords: 2,
            explanation: 'The HCE is process-oriented (how creation unfolds over time), while the UE is factor-oriented (what elements must work together). Both are valuable for different analytical purposes.',
            hint: 'Think about "when" versus "what" — which equation addresses which question?' }
        );
        break;

      /* ============ SECTION 8: PRACTICAL EXAMPLES ============ */
      case 's8':
        questions.push(
          { type: qType.MCQ, difficulty: difficulty.BEGINNER,
            question: 'According to the Antonimus examples, what observation led to the invention of the airplane?',
            options: ['Bird in flight', 'Flowing water', 'Falling apple', 'Rising sun'],
            answer: 'Bird in flight',
            explanation: 'Observing bird flight inspired humans to imagine the possibility of human flight, eventually leading to the airplane.',
            hint: 'Think about what creatures naturally do that humans wanted to replicate.' },

          { type: qType.TRUE_FALSE, difficulty: difficulty.INTERMEDIATE,
            question: 'Ada Lovelace\'s contribution to computing was primarily as a hardware engineer.',
            answer: 'False',
            explanation: 'Ada Lovelace was a mathematician who wrote the first algorithm intended for machine processing, making her the first computer programmer — a software, not hardware, pioneer.',
            hint: 'What did Ada Lovelace actually create?' },

          { type: qType.MCQ, difficulty: difficulty.ADVANCED,
            question: 'The example of Ibn al-Haytham is included to demonstrate which aspect of the Antonimus cycle?',
            options: ['The connection between observation and experimentation',
                      'The importance of imagination in poetry',
                      'The role of religious faith in science',
                      'The superiority of ancient Greek philosophy'],
            answer: 'The connection between observation and experimentation',
            explanation: 'Ibn al-Haytham\'s work in optics established that systematic observation and experimentation are essential for acquiring reliable knowledge — a foundational step in the Antonimus cycle.',
            hint: 'What was Ibn al-Haytham\'s scientific methodology known for?' }
        );
        break;

      /* ============ SECTION 11: AI vs HUMAN ============ */
      case 's11':
        questions.push(
          { type: qType.MCQ, difficulty: difficulty.BEGINNER,
            question: 'In the Antonimus comparison, which dimension shows the clearest advantage for human intelligence over AI?',
            options: ['Creativity', 'Speed', 'Memory capacity', 'Data processing'],
            answer: 'Creativity',
            explanation: 'The comparison identifies creativity — the ability to generate genuinely novel concepts not present in training data — as an area where humans significantly outperform current AI.',
            hint: 'Which uniquely human quality is hardest for AI to replicate?' },

          { type: qType.MCQ, difficulty: difficulty.INTERMEDIATE,
            question: 'According to the section, what is a key limitation of AI imagination compared to human imagination?',
            options: ['AI cannot imagine counterfactual or impossible scenarios with genuine causal understanding',
                      'AI cannot generate any new outputs',
                      'AI does not have enough training data',
                      'AI is too slow to imagine'],
            answer: 'AI cannot imagine counterfactual or impossible scenarios with genuine causal understanding',
            explanation: 'While AI can generate hypothetical outputs, it lacks causal understanding of those scenarios. Humans can imagine impossible or counterfactual situations with genuine causal reasoning.',
            hint: 'Does AI truly understand the scenarios it generates, or is it just pattern matching?' },

          { type: qType.REASONING, difficulty: difficulty.ADVANCED,
            question: 'Explain why the presence or absence of qualia (subjective experience) creates a fundamental difference between human and AI intelligence within the Antonimus framework.',
            answer: 'Qualia — the subjective quality of experience (the redness of red, the pain of a burn) — are central to human observation, learning, and creativity. AI processes information without subjective experience, which affects the depth of its understanding and the richness of its imaginative possibilities.',
            keywords: ['qualia', 'subjective', 'experience', 'consciousness'],
            minKeywords: 2,
            explanation: 'Qualia are fundamental to human intelligence because they provide the rich, embodied context that shapes how we observe, learn, imagine, and create. AI operates on abstract symbols without subjective experience, limiting certain dimensions of intelligence.',
            hint: 'Think about whether a machine can truly feel or understand in the way humans do.' }
        );
        break;

      /* ============ SECTION 13: ISLAM ============ */
      case 's13':
        questions.push(
          { type: qType.MCQ, difficulty: difficulty.BEGINNER,
            question: 'The Islamic concept of khilafa relates to the Antonimus framework through the idea of:',
            options: ['Responsible creation and stewardship', 'Blind faith', 'Rejection of knowledge', 'Isolation from the world'],
            answer: 'Responsible creation and stewardship',
            explanation: 'Khilafa (vicegerency) describes humanity\'s role as stewards of creation, which aligns with the Antonimus emphasis on responsible, ethical creation.',
            hint: 'What does the word "khilafa" mean in Islamic theology?' },

          { type: qType.TRUE_FALSE, difficulty: difficulty.INTERMEDIATE,
            question: 'According to Section 13, classical Islamic philosophers unanimously agreed with the Antonimus framework.',
            answer: 'False',
            explanation: 'Classical Islamic philosophers like Ibn Sina, Al-Ghazali, Ibn Rushd, and Mulla Sadra held diverse views on imagination, knowledge, and creation. The section highlights their different perspectives, not a consensus.',
            hint: 'Did all Islamic philosophers agree on the nature of imagination?' }
        );
        break;

      /* ============ SECTION 14: CRITICISM ============ */
      case 's14':
        questions.push(
          { type: qType.MCQ, difficulty: difficulty.INTERMEDIATE,
            question: 'Which of the following is a criticism of the Antonimus framework discussed in Section 14?',
            options: ['The equations cannot be empirically tested',
                      'The framework is too mathematical',
                      'The theory ignores imagination',
                      'The book is too long'],
            answer: 'The equations cannot be empirically tested',
            explanation: 'A key criticism is that the Antonimus equations are conceptual rather than empirical — they cannot be tested or falsified in the scientific sense.',
            hint: 'What is a fundamental requirement for any scientific theory?' },

          { type: qType.REASONING, difficulty: difficulty.ADVANCED,
            question: 'How might a proponent of Antonimus respond to the criticism that the framework is not empirically testable?',
            answer: 'A proponent might argue that Antonimus is a philosophical framework, not a scientific theory — it organizes observations and provides a conceptual vocabulary rather than making testable predictions. Its value lies in heuristic and educational utility, not empirical falsifiability.',
            keywords: ['philosophical', 'framework', 'heuristic', 'conceptual', 'testable'],
            minKeywords: 2,
            explanation: 'The distinction between scientific theories and philosophical frameworks is important. Antonimus positions itself as the latter — providing a way of thinking about creativity and reality rather than making empirically testable claims.',
            hint: 'Is every useful idea about reality required to be scientifically testable?' }
        );
        break;

      /* ============ DEFAULT (General Knowledge) ============ */
      default:
        questions.push(
          { type: qType.MCQ, difficulty: difficulty.BEGINNER,
            question: 'Who is the author of the Antonimus Theory of Reality?',
            options: ['Umaiz Sufiyan', 'Antonimus', 'Aristotle', 'Albert Einstein'],
            answer: 'Umaiz Sufiyan',
            explanation: 'The author is Umaiz Sufiyan. "Antonimus" is the name of the philosophical framework, not the author.',

            hint: 'The name of the framework and the author are different.' },

          { type: qType.MCQ, difficulty: difficulty.INTERMEDIATE,
            question: 'Under what license is the Antonimus Theory of Reality published?',
            options: ['CC BY 4.0', 'MIT', 'GPL v3', 'All Rights Reserved'],
            answer: 'CC BY 4.0',
            explanation: 'The book is published under Creative Commons Attribution 4.0 International (CC BY 4.0), allowing sharing and adaptation with proper attribution.',
            hint: 'Look in the book frontmatter for license information.' }
        );
    }

    // Tag each question with its chapter
    return questions.map(q => ({ ...q, chapterId }));
  }

  return { generateQuestion, generateQuizSet, checkAnswer, difficulty, qType };
})();

/* ================================================================ */
/* QUIZ UI RENDERER                                                */
/* ================================================================ */

const QuizUI = (() => {
  function renderQuiz(containerId, chapterId, title = 'Practice Quiz') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="quiz-section" data-chapter="${chapterId}">
        <div class="quiz-header">
          <h3 class="quiz-title">${title}</h3>
          <div class="quiz-controls">
            <button class="quiz-btn quiz-btn-sm" onclick="QuizUI.showSettings('${containerId}', '${chapterId}')">Settings</button>
            <button class="quiz-btn quiz-btn-sm quiz-btn-primary" onclick="QuizUI.startQuiz('${containerId}', '${chapterId}')">Start Quiz</button>
          </div>
        </div>
        <div class="quiz-body" id="${containerId}-body">
          <div class="quiz-welcome">
            <p>Test your understanding of this chapter with interactive questions.</p>
            <ul class="quiz-features">
              <li><strong>Multiple choice</strong>, true/false, fill-in-the-blank, and numerical questions</li>
              <li>3 <strong>difficulty levels</strong>: Beginner, Intermediate, Advanced</li>
              <li><strong>Hints</strong> available before revealing answers</li>
              <li><strong>Step-by-step solutions</strong> for every question</li>
              <li><strong>Instant feedback</strong> with explanations</li>
              <li><strong>Challenge Mode</strong> for timed practice</li>
            </ul>
            <button class="quiz-btn quiz-btn-large quiz-btn-primary" onclick="QuizUI.startQuiz('${containerId}', '${chapterId}')">Start Quiz</button>
          </div>
        </div>
        <div class="quiz-footer">
          <span class="quiz-score-display">Score: <strong id="${containerId}-score">--</strong></span>
          <span class="quiz-progress-display">Questions: <strong id="${containerId}-count">0</strong></span>
        </div>
      </div>
    `;
  }

  let currentQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let answered = 0;

  function startQuiz(containerId, chapterId) {
    const settings = getSettings(chapterId);
    currentQuestions = QuizEngine.generateQuizSet(chapterId, settings.questionCount, settings.difficulty);
    currentIndex = 0;
    score = 0;
    answered = 0;

    if (currentQuestions.length === 0) {
      showMessage(containerId, 'No questions available for this section yet. More coming soon!');
      return;
    }

    showQuestion(containerId);
    ProgressAPI.startAttempt(chapterId);
  }

  function showQuestion(containerId) {
    const body = document.getElementById(containerId + '-body');
    if (!body || !currentQuestions[currentIndex]) return;

    const q = currentQuestions[currentIndex];
    const progress = `${currentIndex + 1} of ${currentQuestions.length}`;

    let html = `<div class="quiz-question" data-index="${currentIndex}">`;
    html += `<div class="quiz-q-header">
      <span class="quiz-q-num">Question ${currentIndex + 1}</span>
      <span class="quiz-q-meta">
        <span class="quiz-difficulty quiz-diff-${q.difficulty}">${q.difficulty}</span>
        <span class="quiz-progress">${progress}</span>
      </span>
    </div>`;
    html += `<div class="quiz-q-text">${q.question}</div>`;

    // Hint button
    html += `<button class="quiz-btn quiz-btn-sm quiz-btn-hint" onclick="QuizUI.showHint('${containerId}', ${currentIndex})">Hint</button>
      <div class="quiz-hint" id="${containerId}-hint-${currentIndex}" style="display:none;">${q.hint || 'Think carefully about what you have learned in this chapter.'}</div>`;

    // Answer area based on type
    html += `<div class="quiz-answer-area" id="${containerId}-answer-${currentIndex}">`;

    switch (q.type) {
      case 'mcq':
        html += `<div class="quiz-options">`;
        (q.options || []).forEach((opt, i) => {
          html += `<label class="quiz-option" data-value="${opt}">
            <input type="radio" name="${containerId}-q${currentIndex}" value="${opt}">
            <span class="quiz-option-text">${opt}</span>
          </label>`;
        });
        html += `</div>`;
        break;

      case 'tf':
        html += `<div class="quiz-options quiz-tf">`;
        ['True', 'False'].forEach(val => {
          html += `<label class="quiz-option" data-value="${val}">
            <input type="radio" name="${containerId}-q${currentIndex}" value="${val}">
            <span class="quiz-option-text">${val}</span>
          </label>`;
        });
        html += `</div>`;
        break;

      case 'fill':
        html += `<input type="text" class="quiz-input" id="${containerId}-input-${currentIndex}"
          placeholder="Type your answer..." autocomplete="off">`;
        break;

      case 'numerical':
        html += `<input type="number" class="quiz-input quiz-input-num" id="${containerId}-input-${currentIndex}"
          placeholder="Enter a number..." step="any">`;
        break;

      case 'equation':
        html += `<input type="text" class="quiz-input quiz-input-eq" id="${containerId}-input-${currentIndex}"
          placeholder="Enter equation (e.g., R = I x K x A)" autocomplete="off">`;
        break;

      case 'reasoning':
        html += `<textarea class="quiz-textarea" id="${containerId}-input-${currentIndex}"
          rows="4" placeholder="Write your explanation..."></textarea>`;
        break;
    }

    // Submit and generate buttons
    html += `<div class="quiz-actions">
      <button class="quiz-btn quiz-btn-primary" onclick="QuizUI.submitAnswer('${containerId}', ${currentIndex})">Submit Answer</button>
      <button class="quiz-btn quiz-btn-sm" onclick="QuizUI.generateNew('${containerId}', ${currentIndex})">Generate New Question</button>
    </div>`;

    // Result area (hidden initially)
    html += `<div class="quiz-result" id="${containerId}-result-${currentIndex}"></div>`;

    // Explanation area (hidden initially)
    html += `<div class="quiz-explanation" id="${containerId}-explanation-${currentIndex}" style="display:none;"></div>`;

    html += `</div></div>`;

    // Navigation
    html += `<div class="quiz-nav">
      <button class="quiz-btn" onclick="QuizUI.prevQuestion('${containerId}')" ${currentIndex === 0 ? 'disabled' : ''}>Previous</button>
      <button class="quiz-btn quiz-btn-primary" onclick="QuizUI.nextQuestion('${containerId}')" ${currentIndex >= currentQuestions.length - 1 ? 'disabled' : ''}>Next</button>
    </div>`;

    body.innerHTML = html;
    updateStats(containerId);
  }

  function submitAnswer(containerId, index) {
    const q = currentQuestions[index];
    if (!q) return;

    let userAnswer = '';

    switch (q.type) {
      case 'mcq':
      case 'tf': {
        const selected = document.querySelector(`input[name="${containerId}-q${index}"]:checked`);
        userAnswer = selected ? selected.value : '';
        break;
      }
      case 'fill':
      case 'numerical':
      case 'equation': {
        const input = document.getElementById(`${containerId}-input-${index}`);
        userAnswer = input ? input.value.trim() : '';
        break;
      }
      case 'reasoning': {
        const textarea = document.getElementById(`${containerId}-input-${index}`);
        userAnswer = textarea ? textarea.value.trim() : '';
        break;
      }
    }

    if (!userAnswer) {
      alert('Please provide an answer before submitting.');
      return;
    }

    const result = QuizEngine.checkAnswer(q, userAnswer);
    const resultDiv = document.getElementById(`${containerId}-result-${index}`);
    const explainDiv = document.getElementById(`${containerId}-explanation-${index}`);

    if (result.correct) {
      score++;
      resultDiv.innerHTML = `<div class="quiz-correct"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:4px;"><polyline points="20 6 9 17 4 12"/></svg> Correct! Well done.</div>`;
      resultDiv.className = 'quiz-result quiz-result-correct';
      ProgressAPI.recordCorrect(q.chapterId, q.difficulty);
    } else {
      resultDiv.innerHTML = `<div class="quiz-incorrect"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:4px;"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Not quite. ${result.expectedAnswer ? 'Expected: ' + result.expectedAnswer : ''}</div>`;
      resultDiv.className = 'quiz-result quiz-result-incorrect';

      // Show explanation automatically for incorrect answers
      explainDiv.style.display = 'block';
      explainDiv.innerHTML = `<div class="quiz-explain-box">
        <strong>Explanation:</strong> ${result.explanation || q.explanation || 'Study the chapter material for more detail.'}
        <br><button class="quiz-btn quiz-btn-sm quiz-btn-mistake" onclick="QuizUI.explainMistake('${containerId}', ${index})">Explain My Mistake</button>
      </div>`;
      ProgressAPI.recordIncorrect(q.chapterId, q.difficulty);
    }

    answered++;
    updateStats(containerId);

    // Disable submit button
    const submitBtn = resultDiv.closest('.quiz-answer-area')?.querySelector('.quiz-btn-primary');
    if (submitBtn) submitBtn.disabled = true;

    // Auto-advance to next question after a delay
    if (currentIndex < currentQuestions.length - 1) {
      setTimeout(() => nextQuestion(containerId), 1500);
    } else {
      // Show completion
      setTimeout(() => showCompletion(containerId), 1500);
    }
  }

  function showCompletion(containerId) {
    const body = document.getElementById(containerId + '-body');
    const pct = Math.round((score / currentQuestions.length) * 100);
    const perfect = score === currentQuestions.length;

    let badges = '';
    if (perfect) badges += '<span class="badge badge-gold"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:2px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Perfect Score</span>';
    if (pct >= 80) badges += '<span class="badge badge-silver"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:2px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Mastery</span>';
    if (pct >= 60) badges += '<span class="badge badge-bronze"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:2px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Passed</span>';

    ProgressAPI.completeAttempt(currentQuestions[0]?.chapterId, score, currentQuestions.length);
    checkAchievements();

    body.innerHTML = `<div class="quiz-completion">
      <div class="quiz-completion-icon">${perfect ? '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>'}</div>
      <h3>Quiz Complete!</h3>
      <div class="quiz-score-final">${score} / ${currentQuestions.length} (${pct}%)</div>
      <div class="quiz-badges">${badges}</div>
      <div class="quiz-completion-actions">
        <button class="quiz-btn quiz-btn-primary" onclick="QuizUI.startQuiz('${containerId}', '${currentQuestions[0]?.chapterId}')">Try Again</button>
        <button class="quiz-btn" onclick="QuizUI.generateNew('${containerId}', 0)">New Questions</button>
        <button class="quiz-btn quiz-btn-sm" onclick="QuizUI.showChallenge('${containerId}', '${currentQuestions[0]?.chapterId}')">Challenge Mode</button>
      </div>
    </div>`;
  }

  function showHint(containerId, index) {
    const hint = document.getElementById(`${containerId}-hint-${index}`);
    if (hint) hint.style.display = 'block';
  }

  function explainMistake(containerId, index) {
    const q = currentQuestions[index];
    if (!q) return;
    const explainDiv = document.getElementById(`${containerId}-explanation-${index}`);
    explainDiv.innerHTML += `<div class="quiz-mistake-analysis">
      <strong>Common Mistake Analysis:</strong>
      <p>${getMistakeAnalysis(q)}</p>
    </div>`;
  }

  function getMistakeAnalysis(q) {
    const analyses = {
      'mcq': 'Multiple-choice questions can be tricky because some options may seem plausible but miss a key detail. Review the chapter material and pay attention to qualifying words like "always," "never," "primarily," or "only."',
      'tf': 'True/false questions require absolute accuracy. If a statement contains any part that is incorrect, the whole statement is false. Watch for absolute qualifiers.',
      'fill': 'Fill-in-the-blank questions test recall, not just recognition. Try to remember the exact term or phrase used in the chapter. Synonyms may sometimes be accepted.',
      'numerical': 'Check your calculation steps. Common errors include: incorrect order of operations, unit conversion mistakes, or misreading the question. Try working backwards from the answer.',
      'equation': 'Equation questions check your understanding of symbolic relationships. Verify that you have the correct variables on each side and that the relationship (multiplication, addition, etc.) is right.',
      'reasoning': 'Reasoning questions are evaluated on key concept coverage. Make sure your answer addresses the core ideas even if the exact wording differs.'
    };
    return analyses[q.type] || 'Review the relevant chapter section and try to identify which concept you may have misunderstood.';
  }

  function generateNew(containerId, index) {
    const chapterId = currentQuestions[index]?.chapterId;
    if (!chapterId) return;
    const settings = getSettings(chapterId);
    const newQ = QuizEngine.generateQuestion(chapterId, settings.difficulty);
    if (newQ) {
      currentQuestions[index] = newQ;
      showQuestion(containerId);
    }
  }

  function nextQuestion(containerId) {
    if (currentIndex < currentQuestions.length - 1) {
      currentIndex++;
      showQuestion(containerId);
    }
  }

  function prevQuestion(containerId) {
    if (currentIndex > 0) {
      currentIndex--;
      showQuestion(containerId);
    }
  }

  function showMessage(containerId, msg) {
    const body = document.getElementById(containerId + '-body');
    if (body) body.innerHTML = `<div class="quiz-message">${msg}</div>`;
  }

  function updateStats(containerId) {
    document.getElementById(`${containerId}-score`).textContent = `${score}/${currentQuestions.length}`;
    document.getElementById(`${containerId}-count`).textContent = currentQuestions.length;
  }

  /* ---- Settings ---- */
  function getSettings(chapterId) {
    const key = `antonimus-quiz-settings-${chapterId}`;
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved) return saved;
    } catch(e) {}
    return { difficulty: 'beginner', questionCount: 5 };
  }

  function saveSettings(chapterId, settings) {
    localStorage.setItem(`antonimus-quiz-settings-${chapterId}`, JSON.stringify(settings));
  }

  function showSettings(containerId, chapterId) {
    const settings = getSettings(chapterId);
    const body = document.getElementById(containerId + '-body');
    body.innerHTML = `<div class="quiz-settings">
      <h4>Quiz Settings</h4>
      <label>Difficulty:
        <select id="${containerId}-diff" class="quiz-select">
          <option value="beginner" ${settings.difficulty === 'beginner' ? 'selected' : ''}>Beginner</option>
          <option value="intermediate" ${settings.difficulty === 'intermediate' ? 'selected' : ''}>Intermediate</option>
          <option value="advanced" ${settings.difficulty === 'advanced' ? 'selected' : ''}>Advanced</option>
        </select>
      </label>
      <label>Questions:
        <select id="${containerId}-count" class="quiz-select">
          ${[3, 5, 10, 15].map(n => `<option value="${n}" ${settings.questionCount === n ? 'selected' : ''}>${n}</option>`).join('')}
        </select>
      </label>
      <button class="quiz-btn quiz-btn-primary" onclick="QuizUI.saveAndStart('${containerId}', '${chapterId}')">Save & Start</button>
    </div>`;
  }

  function saveAndStart(containerId, chapterId) {
    const diff = document.getElementById(`${containerId}-diff`).value;
    const count = parseInt(document.getElementById(`${containerId}-count`).value);
    saveSettings(chapterId, { difficulty: diff, questionCount: count });
    startQuiz(containerId, chapterId);
  }

  /* ---- Challenge Mode ---- */
  function showChallenge(containerId, chapterId) {
    const body = document.getElementById(containerId + '-body');
    body.innerHTML = `<div class="quiz-challenge-setup">
      <h4><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:6px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Challenge Mode</h4>
      <p>Answer as many questions as possible within the time limit!</p>
      <label>Time Limit:
        <select id="${containerId}-challenge-time" class="quiz-select">
          <option value="60">1 minute</option>
          <option value="180" selected>3 minutes</option>
          <option value="300">5 minutes</option>
          <option value="600">10 minutes</option>
        </select>
      </label>
      <label>Difficulty:
        <select id="${containerId}-challenge-diff" class="quiz-select">
          <option value="beginner">Beginner</option>
          <option value="intermediate" selected>Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="">Mixed</option>
        </select>
      </label>
      <button class="quiz-btn quiz-btn-primary" onclick="QuizUI.startChallenge('${containerId}', '${chapterId}')">Start Challenge!</button>
    </div>`;
  }

  let challengeTimer = null;
  let challengeScore = 0;
  let challengeTotal = 0;
  let challengeQuestions = [];

  function startChallenge(containerId, chapterId) {
    const timeLimit = parseInt(document.getElementById(`${containerId}-challenge-time`).value);
    const diff = document.getElementById(`${containerId}-challenge-diff`).value || null;

    challengeQuestions = QuizEngine.generateQuizSet(chapterId, 20, diff);
    challengeScore = 0;
    challengeTotal = 0;
    currentIndex = 0;
    currentQuestions = challengeQuestions;

    const body = document.getElementById(containerId + '-body');
    let timeLeft = timeLimit;

    body.innerHTML = `<div class="quiz-challenge-active">
      <div class="challenge-header">
        <span class="challenge-timer" id="${containerId}-timer">${formatTime(timeLeft)}</span>
        <span class="challenge-score">Score: <strong id="${containerId}-challenge-score">0</strong></span>
      </div>
      <div class="challenge-questions" id="${containerId}-challenge-questions"></div>
    </div>`;

    // Start timer
    challengeTimer = setInterval(() => {
      timeLeft--;
      document.getElementById(`${containerId}-timer`).textContent = formatTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(challengeTimer);
        endChallenge(containerId, chapterId);
      }
    }, 1000);

    // Show first question
    currentIndex = 0;
    showChallengeQuestion(containerId);
  }

  function showChallengeQuestion(containerId) {
    const container = document.getElementById(`${containerId}-challenge-questions`);
    if (!container || !challengeQuestions[currentIndex]) return;

    const q = challengeQuestions[currentIndex];
    container.innerHTML = `<div class="quiz-question challenge-q">
      <div class="quiz-q-text">${q.question}</div>
      ${buildChallengeInput(containerId, q)}
      <div class="quiz-actions">
        <button class="quiz-btn quiz-btn-primary" onclick="QuizUI.submitChallenge('${containerId}')">Submit</button>
        <button class="quiz-btn quiz-btn-sm" onclick="QuizUI.skipChallenge('${containerId}')">Skip</button>
      </div>
    </div>`;
  }

  function buildChallengeInput(containerId, q) {
    switch (q.type) {
      case 'mcq':
      case 'tf':
        let html = '<div class="quiz-options">';
        (q.options || ['True', 'False']).forEach(opt => {
          html += `<label class="quiz-option"><input type="radio" name="ch-${currentIndex}" value="${opt}"> <span>${opt}</span></label>`;
        });
        return html + '</div>';
      default:
        return `<input type="text" class="quiz-input" id="ch-input-${currentIndex}" placeholder="Your answer...">`;
    }
  }

  function submitChallenge(containerId) {
    const q = challengeQuestions[currentIndex];
    if (!q) return;

    let userAnswer = '';
    if (['mcq', 'tf'].includes(q.type)) {
      const selected = document.querySelector(`input[name="ch-${currentIndex}"]:checked`);
      userAnswer = selected ? selected.value : '';
    } else {
      const input = document.getElementById(`ch-input-${currentIndex}`);
      userAnswer = input ? input.value.trim() : '';
    }

    if (!userAnswer) { alert('Provide an answer!'); return; }

    const result = QuizEngine.checkAnswer(q, userAnswer);
    challengeTotal++;
    if (result.correct) challengeScore++;

    document.getElementById(`${containerId}-challenge-score`).textContent = challengeScore;

    if (currentIndex < challengeQuestions.length - 1) {
      currentIndex++;
      showChallengeQuestion(containerId);
    } else {
      clearInterval(challengeTimer);
      endChallenge(containerId, q.chapterId);
    }
  }

  function skipChallenge(containerId) {
    challengeTotal++;
    if (currentIndex < challengeQuestions.length - 1) {
      currentIndex++;
      showChallengeQuestion(containerId);
    } else {
      clearInterval(challengeTimer);
      endChallenge(containerId, challengeQuestions[0]?.chapterId);
    }
  }

  function endChallenge(containerId, chapterId) {
    const accuracy = challengeTotal > 0 ? Math.round((challengeScore / challengeTotal) * 100) : 0;
    ProgressAPI.recordChallenge(chapterId, challengeScore, challengeTotal, accuracy);

    const body = document.getElementById(containerId + '-body');
    body.innerHTML = `<div class="quiz-completion">
      <div class="quiz-completion-icon"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
      <h3>Challenge Complete!</h3>
      <div class="quiz-score-final">${challengeScore} / ${challengeTotal} (${accuracy}%)</div>
      <div class="quiz-completion-actions">
        <button class="quiz-btn quiz-btn-primary" onclick="QuizUI.startChallenge('${containerId}', '${chapterId}')">Try Again</button>
        <button class="quiz-btn" onclick="QuizUI.startQuiz('${containerId}', '${chapterId}')">Practice Mode</button>
      </div>
    </div>`;
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  /* ---- Achievements ---- */
  function checkAchievements() {
    const progress = ProgressAPI.getAllProgress();
    const totalCorrect = progress.totalCorrect || 0;
    const challenges = progress.challenges || [];
    const chaptersDone = progress.chaptersAttempted || 0;

    const earned = [];

    if (totalCorrect >= 5) earned.push({ id: 'first_steps', name: 'First Steps', desc: 'Answer 5 questions correctly' });
    if (totalCorrect >= 25) earned.push({ id: 'knowledge_seeker', name: 'Knowledge Seeker', desc: 'Answer 25 questions correctly' });
    if (totalCorrect >= 100) earned.push({ id: 'scholar', name: 'Scholar', desc: 'Answer 100 questions correctly' });
    if (chaptersDone >= 5) earned.push({ id: 'explorer', name: 'Explorer', desc: 'Study 5 chapters' });
    if (chaptersDone >= 10) earned.push({ id: 'dedicated', name: 'Dedicated', desc: 'Study 10 chapters' });
    if (chaptersDone >= 15) earned.push({ id: 'completionist', name: 'Completionist', desc: 'Study all 15 chapters' });
    if (challenges.length >= 1) earned.push({ id: 'challenger', name: 'Challenger', desc: 'Complete your first challenge' });
    if (challenges.length >= 5) earned.push({ id: 'champion', name: 'Champion', desc: 'Complete 5 challenges' });

    const saved = JSON.parse(localStorage.getItem('antonimus-achievements') || '[]');
    const newOnes = earned.filter(e => !saved.find(s => s.id === e.id));
    if (newOnes.length > 0) {
      localStorage.setItem('antonimus-achievements', JSON.stringify([...saved, ...newOnes]));
      showAchievementNotification(newOnes);
    }
  }

  function showAchievementNotification(achievements) {
    achievements.forEach(a => {
      const notif = document.createElement('div');
      notif.className = 'achievement-popup';
      notif.innerHTML = `<div class="achievement-icon"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></div>
        <div class="achievement-info">
          <div class="achievement-name">${a.name}</div>
          <div class="achievement-desc">${a.desc}</div>
        </div>`;
      document.body.appendChild(notif);
      setTimeout(() => { notif.classList.add('show'); }, 100);
      setTimeout(() => { notif.classList.remove('show'); setTimeout(() => notif.remove(), 300); }, 4000);
    });
  }

  function renderAchievements(containerId) {
    const saved = JSON.parse(localStorage.getItem('antonimus-achievements') || '[]');
    const all = [
      { id: 'first_steps', name: 'First Steps', desc: 'Answer 5 questions correctly', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
      { id: 'knowledge_seeker', name: 'Knowledge Seeker', desc: 'Answer 25 questions correctly', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
      { id: 'scholar', name: 'Scholar', desc: 'Answer 100 questions correctly', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
      { id: 'explorer', name: 'Explorer', desc: 'Study 5 chapters', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
      { id: 'dedicated', name: 'Dedicated', desc: 'Study 10 chapters', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>' },
      { id: 'completionist', name: 'Completionist', desc: 'Study all chapters', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>' },
      { id: 'challenger', name: 'Challenger', desc: 'Complete first challenge', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/><polyline points="14.5 6.5 17 4 21 4 21 8 18.5 10.5"/><line x1="5" y1="11" x2="11" y2="5"/></svg>' },
      { id: 'champion', name: 'Champion', desc: 'Complete 5 challenges', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>' }
    ];

    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `<div class="achievements-grid">
      ${all.map(a => {
        const unlocked = saved.find(s => s.id === a.id);
        return `<div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
          <div class="achievement-icon">${a.icon}</div>
          <div class="achievement-name">${a.name}</div>
          <div class="achievement-desc">${a.desc}</div>
          <div class="achievement-status">${unlocked ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:3px;"><polyline points="20 6 9 17 4 12"/></svg> Unlocked' : '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:3px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> Locked'}</div>
        </div>`;
      }).join('')}
    </div>`;
  }

  return {
    renderQuiz, startQuiz, showQuestion, submitAnswer, showHint,
    explainMistake, generateNew, nextQuestion, prevQuestion,
    showSettings, saveAndStart, showChallenge, startChallenge,
    submitChallenge, skipChallenge, renderAchievements
  };
})();

/* ================================================================ */
/* PROGRESS TRACKING API                                           */
/* ================================================================ */

const ProgressAPI = (() => {
  const STORAGE_KEY = 'antonimus-progress';

  function getProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch(e) { return {}; }
  }

  function saveProgress(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getAllProgress() {
    const p = getProgress();
    return {
      totalCorrect: p.totalCorrect || 0,
      totalIncorrect: p.totalIncorrect || 0,
      chaptersAttempted: Object.keys(p.chapters || {}).length,
      challenges: p.challenges || [],
      xp: p.xp || 0,
      streak: p.streak || 0
    };
  }

  function recordCorrect(chapterId, difficulty) {
    const p = getProgress();
    p.totalCorrect = (p.totalCorrect || 0) + 1;
    p.xp = (p.xp || 0) + (difficulty === 'advanced' ? 3 : difficulty === 'intermediate' ? 2 : 1);
    if (!p.chapters) p.chapters = {};
    if (!p.chapters[chapterId]) p.chapters[chapterId] = { correct: 0, incorrect: 0, attempts: 0 };
    p.chapters[chapterId].correct++;
    updateStreak(p);
    saveProgress(p);
  }

  function recordIncorrect(chapterId, difficulty) {
    const p = getProgress();
    p.totalIncorrect = (p.totalIncorrect || 0) + 1;
    p.xp = Math.max(0, (p.xp || 0) - 1); // Small penalty
    if (!p.chapters) p.chapters = {};
    if (!p.chapters[chapterId]) p.chapters[chapterId] = { correct: 0, incorrect: 0, attempts: 0 };
    p.chapters[chapterId].incorrect++;
    saveProgress(p);
  }

  function startAttempt(chapterId) {
    const p = getProgress();
    if (!p.chapters) p.chapters = {};
    if (!p.chapters[chapterId]) p.chapters[chapterId] = { correct: 0, incorrect: 0, attempts: 0 };
    p.chapters[chapterId].attempts = (p.chapters[chapterId].attempts || 0) + 1;
    saveProgress(p);
  }

  function completeAttempt(chapterId, score, total) {
    const p = getProgress();
    if (!p.completions) p.completions = {};
    p.completions[chapterId] = Math.max(p.completions[chapterId] || 0, Math.round((score / total) * 100));
    saveProgress(p);
  }

  function recordChallenge(chapterId, score, total, accuracy) {
    const p = getProgress();
    if (!p.challenges) p.challenges = [];
    p.challenges.push({ chapterId, score, total, accuracy, date: Date.now() });
    p.xp = (p.xp || 0) + 10;
    saveProgress(p);
  }

  function updateStreak(p) {
    const today = new Date().toDateString();
    if (p.lastActive === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (p.lastActive === yesterday) {
      p.streak = (p.streak || 0) + 1;
    } else if (p.lastActive !== today) {
      p.streak = 1;
    }
    p.lastActive = today;
  }

  function getStreak() { return getProgress().streak || 0; }
  function getXP() { return getProgress().xp || 0; }
  function getChapterProgress(chapterId) {
    const p = getProgress();
    return p.chapters?.[chapterId] || { correct: 0, incorrect: 0, attempts: 0 };
  }
  function getHighestScore(chapterId) {
    const p = getProgress();
    return p.completions?.[chapterId] || 0;
  }

  function renderDashboard(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const p = getAllProgress();
    const streak = getStreak();
    const xp = getXP();
    const accuracy = (p.totalCorrect + p.totalIncorrect) > 0
      ? Math.round((p.totalCorrect / (p.totalCorrect + p.totalIncorrect)) * 100) : 0;

    container.innerHTML = `
      <div class="progress-dashboard">
        <div class="progress-card"><div class="progress-stat">${xp}</div><div class="progress-label">XP</div></div>
        <div class="progress-card"><div class="progress-stat">${streak}</div><div class="progress-label">Day Streak</div></div>
        <div class="progress-card"><div class="progress-stat">${p.totalCorrect}</div><div class="progress-label">Correct</div></div>
        <div class="progress-card"><div class="progress-stat">${accuracy}%</div><div class="progress-label">Accuracy</div></div>
        <div class="progress-card"><div class="progress-stat">${p.chaptersAttempted}/15</div><div class="progress-label">Chapters</div></div>
        <div class="progress-card"><div class="progress-stat">${p.challenges.length}</div><div class="progress-label">Challenges</div></div>
      </div>
    `;
  }

  return {
    getAllProgress, recordCorrect, recordIncorrect, startAttempt,
    completeAttempt, recordChallenge, getStreak, getXP,
    getChapterProgress, getHighestScore, renderDashboard
  };
})();

/* ================================================================ */
/* CALCULATOR MODULE                                               */
/* Interactive calculators for Antonimus conceptual equations       */
/* ================================================================ */

const AntonimusCalculator = (() => {
  function renderRealityFormation(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const id = containerId.replace(/[^a-z0-9-]/g, '');
    const uid = 'rf-' + id;
    container.innerHTML = `
      <div class="calc-section" data-calc-type="reality-formation" data-calc-uid="${uid}">
        <h4>Reality Formation Calculator</h4>
        <p class="calc-desc">R = I x K x A — Calculate the conceptual outcome based on Imagination, Knowledge, and Action.</p>
        <div class="calc-form">
          <label>Imagination (I) <input type="range" class="calc-slider" data-calc-var="i" data-calc-uid="${uid}" min="0" max="10" step="0.5" value="5">
            <span class="calc-val" data-calc-val="i" data-calc-uid="${uid}">5.0</span></label>
          <label>Knowledge (K) <input type="range" class="calc-slider" data-calc-var="k" data-calc-uid="${uid}" min="0" max="10" step="0.5" value="5">
            <span class="calc-val" data-calc-val="k" data-calc-uid="${uid}">5.0</span></label>
          <label>Action (A) <input type="range" class="calc-slider" data-calc-var="a" data-calc-uid="${uid}" min="0" max="10" step="0.5" value="5">
            <span class="calc-val" data-calc-val="a" data-calc-uid="${uid}">5.0</span></label>
        </div>
        <div class="calc-result" data-calc-result="${uid}">R = 5.0 x 5.0 x 5.0 = 125.0</div>
        <div class="calc-visual">
          <div class="calc-bar" style="width:12.5%" data-calc-bar="${uid}"></div>
          <span class="calc-bar-label" data-calc-barlabel="${uid}">125.0 / 1000</span>
        </div>
      </div>`;
  }

  function renderExpanded(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const id = containerId.replace(/[^a-z0-9-]/g, '');
    const uid = 'ee-' + id;
    container.innerHTML = `
      <div class="calc-section" data-calc-type="expanded" data-calc-uid="${uid}">
        <h4>Expanded Equation Calculator</h4>
        <p class="calc-desc">R = ((I x K x A) x O) / U — Includes Observation and Uncertainty.</p>
        <div class="calc-form">
          <label>Imagination (I) <input type="range" class="calc-slider" data-calc-var="i" data-calc-uid="${uid}" min="0" max="10" step="0.5" value="5"><span class="calc-val" data-calc-val="i" data-calc-uid="${uid}">5.0</span></label>
          <label>Knowledge (K) <input type="range" class="calc-slider" data-calc-var="k" data-calc-uid="${uid}" min="0" max="10" step="0.5" value="5"><span class="calc-val" data-calc-val="k" data-calc-uid="${uid}">5.0</span></label>
          <label>Action (A) <input type="range" class="calc-slider" data-calc-var="a" data-calc-uid="${uid}" min="0" max="10" step="0.5" value="5"><span class="calc-val" data-calc-val="a" data-calc-uid="${uid}">5.0</span></label>
          <label>Observation (O) <input type="range" class="calc-slider" data-calc-var="o" data-calc-uid="${uid}" min="0" max="10" step="0.5" value="5"><span class="calc-val" data-calc-val="o" data-calc-uid="${uid}">5.0</span></label>
          <label>Uncertainty (U) <input type="range" class="calc-slider" data-calc-var="u" data-calc-uid="${uid}" min="1" max="20" step="0.5" value="2"><span class="calc-val" data-calc-val="u" data-calc-uid="${uid}">2.0</span></label>
        </div>
        <div class="calc-result" data-calc-result="${uid}">R = 312.5</div>
      </div>`;
  }

  function renderPrediction(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const id = containerId.replace(/[^a-z0-9-]/g, '');
    const uid = 'pc-' + id;
    container.innerHTML = `
      <div class="calc-section" data-calc-type="prediction" data-calc-uid="${uid}">
        <h4>Prediction Calculator</h4>
        <p class="calc-desc">P = I + E + K — Calculate prediction capability.</p>
        <div class="calc-form">
          <label>Imagination (I) <input type="range" class="calc-slider" data-calc-var="i" data-calc-uid="${uid}" min="0" max="10" step="0.5" value="5"><span class="calc-val" data-calc-val="i" data-calc-uid="${uid}">5.0</span></label>
          <label>Experience (E) <input type="range" class="calc-slider" data-calc-var="e" data-calc-uid="${uid}" min="0" max="10" step="0.5" value="5"><span class="calc-val" data-calc-val="e" data-calc-uid="${uid}">5.0</span></label>
          <label>Knowledge (K) <input type="range" class="calc-slider" data-calc-var="k" data-calc-uid="${uid}" min="0" max="10" step="0.5" value="5"><span class="calc-val" data-calc-val="k" data-calc-uid="${uid}">5.0</span></label>
        </div>
        <div class="calc-result" data-calc-result="${uid}">P = 15.0</div>
      </div>`;
  }

  function renderSmallCause(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const id = containerId.replace(/[^a-z0-9-]/g, '');
    const uid = 'sc-' + id;
    container.innerHTML = `
      <div class="calc-section" data-calc-type="small-cause" data-calc-uid="${uid}">
        <h4>Small Cause Law Calculator</h4>
        <p class="calc-desc">G = s x C — Calculate great outcomes from small causes.</p>
        <div class="calc-form">
          <label>Small Cause (s) <input type="range" class="calc-slider" data-calc-var="s" data-calc-uid="${uid}" min="0" max="10" step="0.5" value="3"><span class="calc-val" data-calc-val="s" data-calc-uid="${uid}">3.0</span></label>
          <label>Chain (C) <input type="range" class="calc-slider" data-calc-var="c" data-calc-uid="${uid}" min="0" max="100" step="1" value="20"><span class="calc-val" data-calc-val="c" data-calc-uid="${uid}">20</span></label>
        </div>
        <div class="calc-result" data-calc-result="${uid}">G = 3.0 x 20 = 60.0</div>
      </div>`;
  }

  return { renderRealityFormation, renderExpanded, renderPrediction, renderSmallCause };
})();

/* ================================================================ */
/* CALCULATOR EVENT DELEGATION — Handles slider input via bubbling  */
/* ================================================================ */

document.addEventListener('input', (e) => {
  const slider = e.target.closest('.calc-slider');
  if (!slider) return;

  const uid = slider.dataset.calcUid;
  const calcSection = slider.closest('[data-calc-type]');
  if (!calcSection || !uid) return;

  const type = calcSection.dataset.calcType;

  // Update value display
  const valSpan = calcSection.querySelector(`.calc-val[data-calc-uid="${uid}"][data-calc-val="${slider.dataset.calcVar}"]`);
  if (valSpan) valSpan.textContent = parseFloat(slider.value).toFixed(1);

  // Get all current values
  const vars = {};
  calcSection.querySelectorAll(`.calc-slider[data-calc-uid="${uid}"]`).forEach(s => {
    vars[s.dataset.calcVar] = parseFloat(s.value);
  });

  const resultEl = calcSection.querySelector(`[data-calc-result="${uid}"]`);
  if (!resultEl) return;

  let result = 0;
  let display = '';

  switch (type) {
    case 'reality-formation': {
      const { i, k, a } = vars;
      result = i * k * a;
      display = `R = ${i.toFixed(1)} x ${k.toFixed(1)} x ${a.toFixed(1)} = ${result.toFixed(1)}`;
      // Update visual bar
      const bar = calcSection.querySelector(`[data-calc-bar="${uid}"]`);
      const label = calcSection.querySelector(`[data-calc-barlabel="${uid}"]`);
      if (bar) {
        const pct = Math.min(100, (result / 1000) * 100);
        bar.style.width = pct + '%';
      }
      if (label) label.textContent = result.toFixed(1) + ' / 1000';
      break;
    }
    case 'expanded': {
      const { i, k, a, o, u } = vars;
      result = ((i * k * a) * o) / u;
      display = `R = ((${i.toFixed(1)} x ${k.toFixed(1)} x ${a.toFixed(1)}) x ${o.toFixed(1)}) / ${u.toFixed(1)} = ${result.toFixed(1)}`;
      break;
    }
    case 'prediction': {
      const { i, e, k } = vars;
      result = i + e + k;
      display = `P = ${i.toFixed(1)} + ${e.toFixed(1)} + ${k.toFixed(1)} = ${result.toFixed(1)}`;
      break;
    }
    case 'small-cause': {
      const { s, c } = vars;
      result = s * c;
      display = `G = ${s.toFixed(1)} x ${c} = ${result.toFixed(1)}`;
      break;
    }
  }

  resultEl.textContent = display;
});

/* ================================================================ */
/* INITIALIZATION — Auto-run after DOM ready                       */
/* ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Auto-init any quiz containers found on the page
  document.querySelectorAll('[data-quiz-chapter]').forEach(el => {
    QuizUI.renderQuiz(el.id, el.dataset.quizChapter);
  });

  // Auto-init any calculator containers
  document.querySelectorAll('[data-calculator]').forEach(el => {
    const type = el.dataset.calculator;
    if (type === 'reality-formation') AntonimusCalculator.renderRealityFormation(el.id);
    else if (type === 'expanded') AntonimusCalculator.renderExpanded(el.id);
    else if (type === 'prediction') AntonimusCalculator.renderPrediction(el.id);
    else if (type === 'small-cause') AntonimusCalculator.renderSmallCause(el.id);
  });

  // Auto-init progress dashboard
  document.querySelectorAll('[data-progress-dashboard]').forEach(el => {
    ProgressAPI.renderDashboard(el.id);
  });

  // Auto-init achievements
  document.querySelectorAll('[data-achievements]').forEach(el => {
    QuizUI.renderAchievements(el.id);
  });
});
