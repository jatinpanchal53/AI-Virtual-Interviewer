import { AIProviderInterface } from './aiProvider.interface.js';

// Deep question bank by role and difficulty
const QUESTION_BANK = {
  'frontend-dev': {
    Easy: [
      {
        questionText: 'Can you explain the difference between `var`, `let`, and `const` in JavaScript, and how scoping affects them?',
        category: 'JavaScript Fundamentals',
        expectedTopics: ['hoisting', 'block scope', 'function scope', 'reassignment', 'temporal dead zone']
      },
      {
        questionText: 'What is the Virtual DOM in React, and how does React use reconciliation to update the real DOM efficiently?',
        category: 'React Architecture',
        expectedTopics: ['virtual DOM', 'reconciliation', 'diffing algorithm', 'performance', 'real DOM updates']
      },
      {
        questionText: 'Explain the CSS Box Model. What is the difference between `content-box` and `border-box`?',
        category: 'CSS & Layout',
        expectedTopics: ['margin', 'border', 'padding', 'content', 'box-sizing', 'border-box']
      }
    ],
    Medium: [
      {
        questionText: 'How does React’s `useEffect` hook handle dependencies and cleanup? What are the common causes of infinite render loops?',
        category: 'React Hooks & Lifecycle',
        expectedTopics: ['dependency array', 'cleanup function', 'unmounting', 'stale closures', 'object reference equality']
      },
      {
        questionText: 'Explain the JavaScript Event Loop. How do the call stack, microtask queue (Promises), and macrotask queue (setTimeout) interact?',
        category: 'JavaScript Concurrency',
        expectedTopics: ['call stack', 'microtask queue', 'macrotask queue', 'promises', 'event loop order']
      },
      {
        questionText: 'What strategies would you use to optimize the Core Web Vitals (LCP, INP/FID, CLS) of a slow React Single Page Application?',
        category: 'Web Performance',
        expectedTopics: ['code splitting', 'lazy loading', 'memoization', 'asset optimization', 'layout shifts', 'SSR']
      }
    ],
    Hard: [
      {
        questionText: 'Design a high-performance infinite-scrolling feed in React with thousands of items. How would you handle virtualization, dynamic heights, memory leaks, and image caching?',
        category: 'Frontend System Design',
        expectedTopics: ['virtualization / windowing', 'intersection observer', 'DOM recycling', 'layout thrashing', 'memory management', 'memoization']
      },
      {
        questionText: 'How does React 18 Concurrent Mode work under the hood? Explain Fiber reconciliation, lanes/priorities, and how `useTransition` and `useDeferredValue` prevent UI blocking.',
        category: 'Advanced React Internals',
        expectedTopics: ['fiber architecture', 'time slicing', 'scheduler priorities', 'lanes', 'non-blocking rendering', 'interruption']
      }
    ]
  },
  'python-dev': {
    Easy: [
      {
        questionText: 'What is the difference between lists and tuples in Python? When would you choose one over the other?',
        category: 'Python Fundamentals',
        expectedTopics: ['mutability', 'memory overhead', 'hashability', 'dictionary keys', 'performance']
      },
      {
        questionText: 'How does Python handle memory management and garbage collection? What role does reference counting play?',
        category: 'Python Internals',
        expectedTopics: ['reference counting', 'cyclic garbage collection', 'gc module', 'del keyword', 'memory allocator']
      }
    ],
    Medium: [
      {
        questionText: 'Explain how Python decorators work under the hood. Can you describe how to implement a decorator that accepts custom arguments and preserves function metadata?',
        category: 'Advanced Python',
        expectedTopics: ['closures', 'first-class functions', 'functools.wraps', 'nested wrapper functions', 'args/kwargs']
      },
      {
        questionText: 'What is the Global Interpreter Lock (GIL) in CPython, and how does it impact CPU-bound vs I/O-bound multithreaded applications?',
        category: 'Concurrency',
        expectedTopics: ['GIL', 'CPython', 'multithreading vs multiprocessing', 'I/O-bound operations', 'asyncio']
      }
    ],
    Hard: [
      {
        questionText: 'Architect an asynchronous distributed task worker system in Python using FastAPI, Redis/Celery, and AsyncIO. How do you handle graceful worker shutdown, task retries with backoff, and idempotent executions?',
        category: 'Distributed Systems',
        expectedTopics: ['asyncio event loop', 'celery/redis', 'dead letter queue', 'idempotency keys', 'graceful shutdown', 'distributed locks']
      }
    ]
  },
  'java-dev': {
    Easy: [
      {
        questionText: 'What are the main OOP principles and how are they implemented in Java? Explain the difference between method overloading and method overriding.',
        category: 'Java Core',
        expectedTopics: ['encapsulation', 'inheritance', 'polymorphism', 'abstraction', 'compile-time vs runtime polymorphism']
      }
    ],
    Medium: [
      {
        questionText: 'How does Spring Boot’s Dependency Injection and Inversion of Control (IoC) container work? Explain the Bean lifecycle and scope types.',
        category: 'Spring Framework',
        expectedTopics: ['ApplicationContext', 'Bean lifecycle', 'singleton vs prototype', 'autowiring', 'constructor injection']
      },
      {
        questionText: 'Explain the internal working of Java’s `HashMap`. What happens during hash collisions and how did Java 8 improve collision handling?',
        category: 'Java Collections',
        expectedTopics: ['hash code & equals', 'buckets', 'linked list to red-black tree threshold (TREEIFY_THRESHOLD = 8)', 'load factor', 're-hashing']
      }
    ],
    Hard: [
      {
        questionText: 'Design a multi-threaded high-throughput order processing engine in Java. How do you handle thread pools, race conditions, memory visibility with `volatile`, and lock-free data structures?',
        category: 'Java Concurrency & Performance',
        expectedTopics: ['ExecutorService', 'CompletableFuture', 'synchronized vs ReentrantLock', 'volatile & memory barrier', 'ConcurrentHashMap', 'CAS / Atomic variables']
      }
    ]
  },
  'data-analyst': {
    Easy: [
      {
        questionText: 'What is the difference between `WHERE` and `HAVING` clauses in SQL? Provide an example query showing both.',
        category: 'SQL Fundamentals',
        expectedTopics: ['row filtering', 'aggregate filtering', 'GROUP BY', 'order of execution', 'aggregate functions']
      },
      {
        questionText: 'Explain the differences between `INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, and `FULL OUTER JOIN`.',
        category: 'SQL Joins',
        expectedTopics: ['matching keys', 'null handling', 'unmatched records', 'table relationships', 'cartesian product prevention']
      }
    ],
    Medium: [
      {
        questionText: 'How do SQL Window Functions (such as `ROW_NUMBER()`, `RANK()`, and `DENSE_RANK()`) differ from standard aggregate functions? When would you use `PARTITION BY`?',
        category: 'Advanced SQL',
        expectedTopics: ['window functions', 'PARTITION BY', 'ORDER BY inside OVER()', 'ranking ties', 'cumulative metrics']
      },
      {
        questionText: 'How do you detect, handle, and impute missing or anomalous data in Pandas before conducting statistical analysis?',
        category: 'Data Cleaning & Pandas',
        expectedTopics: ['isnull / dropna / fillna', 'mean/median imputation', 'IQR outlier detection', 'z-score', 'forward/backward fill']
      }
    ],
    Hard: [
      {
        questionText: 'You are tasked with designing an end-to-end A/B testing framework to measure the conversion impact of a new feature. How would you calculate sample size, control for variance, avoid p-hacking, and validate statistical power?',
        category: 'Statistical Experimentation',
        expectedTopics: ['sample size estimation', 'null hypothesis', 'p-value & significance level alpha', 'power 1-beta', 'minimum detectable effect (MDE)', 'bonferroni correction']
      }
    ]
  },
  'fullstack-dev': {
    Easy: [
      {
        questionText: 'What are RESTful API conventions, and what are the primary differences between GET, POST, PUT, PATCH, and DELETE HTTP methods?',
        category: 'Web API Basics',
        expectedTopics: ['idempotency', 'status codes', 'resource-based URLs', 'CRUD operations', 'payloads']
      }
    ],
    Medium: [
      {
        questionText: 'How would you implement secure JWT-based authentication in a React and Node.js application? Where should tokens be stored to protect against XSS and CSRF attacks?',
        category: 'Full Stack Security',
        expectedTopics: ['HttpOnly cookies', 'access token vs refresh token', 'XSS mitigation', 'CSRF tokens / SameSite', 'token rotation']
      },
      {
        questionText: 'Explain how database indexing works (e.g. B-Trees) and how you would diagnose and optimize a slow query in a production relational database.',
        category: 'Database Optimization',
        expectedTopics: ['B-Tree index', 'EXPLAIN ANALYZE', 'full table scan', 'composite index', 'cardinality', 'query execution plan']
      }
    ],
    Hard: [
      {
        questionText: 'Architect a scalable real-time collaborative document editing system (like Google Docs). How do you handle real-time synchronization, concurrency conflict resolution (OT or CRDTs), WebSockets, and database persistence?',
        category: 'System Architecture',
        expectedTopics: ['WebSockets / Socket.io', 'Operational Transformation (OT) or CRDTs', 'Redis Pub/Sub', 'distributed state', 'database write-back', 'offline sync']
      }
    ]
  },
  'hr-behavioral': {
    Easy: [
      {
        questionText: 'Tell me about a time you had to learn a new technology or tool under a tight deadline. How did you approach the challenge and what was the outcome?',
        category: 'Adaptability & Growth',
        expectedTopics: ['STAR method', 'learning approach', 'prioritization', 'practical application', 'positive outcome']
      }
    ],
    Medium: [
      {
        questionText: 'Describe a situation where you had a significant technical disagreement with a teammate or stakeholder. How did you resolve the conflict productively?',
        category: 'Conflict Resolution',
        expectedTopics: ['empathy', 'active listening', 'data-driven decision', 'compromise / consensus', 'team harmony']
      }
    ],
    Hard: [
      {
        questionText: 'Can you walk through a high-stakes failure or production outage that occurred on your watch? What was your immediate reaction, root cause investigation, and long-term preventative action?',
        category: 'Leadership & Accountability',
        expectedTopics: ['accountability', 'incident post-mortem', 'blameless culture', 'preventative systems / testing', 'resilience']
      }
    ]
  }
};

export class MockAIProvider extends AIProviderInterface {
  async generateQuestion({ role, experienceLevel, interviewType, difficulty, previousQuestions = [], previousAnswers = [], repoContext }) {
    const targetDiff = difficulty || (experienceLevel === 'Beginner' ? 'Easy' : experienceLevel === 'Advanced' ? 'Hard' : 'Medium');

    // If repoContext is present, generate project-specific grilling questions
    if (repoContext) {
      const parsedRepo = typeof repoContext === 'string' ? JSON.parse(repoContext) : repoContext;
      const repoName = parsedRepo.repo || parsedRepo.fullName || 'your repository';
      const techList = parsedRepo.detectedTech && parsedRepo.detectedTech.length > 0 
        ? parsedRepo.detectedTech 
        : ['REST API', 'Modular Architecture', 'Database'];
      const fileList = parsedRepo.keyFiles && parsedRepo.keyFiles.length > 0
        ? parsedRepo.keyFiles
        : ['src/index.js', 'src/services/core.js'];

      const tech1 = techList[0] || 'your core framework';
      const tech2 = techList[1] || 'the database layer';
      const sampleFile = fileList[Math.floor(Math.random() * fileList.length)] || 'the main controller';

      const projectQuestions = [
        {
          questionText: `In your repository \`${repoName}\`, I see you used ${tech1} alongside ${tech2}. What was the primary motivation behind this architecture, and how does data flow between them?`,
          category: 'Project Architecture & Tech Choice',
          expectedTopics: [tech1.toLowerCase(), tech2.toLowerCase(), 'data flow', 'state management', 'separation of concerns']
        },
        {
          questionText: `Looking at your project structure (specifically \`${sampleFile}\`), how did you design error handling, logging, and recovery when unexpected runtime exceptions occur?`,
          category: 'Error Handling & Resilience',
          expectedTopics: ['error handling', 'try/catch', 'logging', 'graceful degradation', 'middleware']
        },
        {
          questionText: `Suppose \`${repoName}\` experiences a sudden 100x traffic spike with thousands of concurrent requests. What is the single biggest bottleneck in your current design, and how would you optimize or cache it?`,
          category: 'Scalability & Performance Bottlenecks',
          expectedTopics: ['caching / redis', 'database indexing', 'load balancing', 'connection pooling', 'rate limiting']
        },
        {
          questionText: `How did you approach security, authentication, and data validation in \`${repoName}\`? What measures protect against injection attacks or unauthorized access?`,
          category: 'Project Security & Data Integrity',
          expectedTopics: ['input validation', 'authentication / jwt', 'sanitization', 'authorization', 'security headers']
        },
        {
          questionText: `If you were to refactor \`${repoName}\` from scratch today with what you learned, what major design decision or dependency would you change and why?`,
          category: 'Engineering Trade-offs & Refactoring',
          expectedTopics: ['trade-offs', 'refactoring', 'clean architecture', 'testing', 'modularity']
        }
      ];

      const askedTexts = new Set(previousQuestions.map(q => (q.questionText || '').trim().toLowerCase()));
      const availableProjectQ = projectQuestions.filter(q => !askedTexts.has(q.questionText.trim().toLowerCase()));

      if (availableProjectQ.length > 0) {
        const selected = availableProjectQ[0];
        return {
          questionText: selected.questionText,
          category: selected.category,
          difficulty: targetDiff,
          expectedTopics: selected.expectedTopics
        };
      }
    }

    // Standard role-based question bank lookup
    let normalizedRole = 'frontend-dev';
    if (role.toLowerCase().includes('python')) normalizedRole = 'python-dev';
    else if (role.toLowerCase().includes('java')) normalizedRole = 'java-dev';
    else if (role.toLowerCase().includes('data')) normalizedRole = 'data-analyst';
    else if (role.toLowerCase().includes('full') || role.toLowerCase().includes('stack')) normalizedRole = 'fullstack-dev';
    else if (interviewType === 'HR' || role.toLowerCase().includes('hr')) normalizedRole = 'hr-behavioral';

    const roleBank = QUESTION_BANK[normalizedRole] || QUESTION_BANK['frontend-dev'];
    
    // Pick from current difficulty, or fallback to adjacent
    let pool = roleBank[targetDiff] || [];
    if (pool.length === 0) {
      pool = roleBank['Medium'] || roleBank['Easy'] || [];
    }

    // Filter out previously asked questions
    const askedTexts = new Set(previousQuestions.map(q => (q.questionText || '').trim().toLowerCase()));
    let available = pool.filter(q => !askedTexts.has(q.questionText.trim().toLowerCase()));

    // If all in this pool used, pull from other difficulties
    if (available.length === 0) {
      const allQuestions = [...(roleBank.Easy || []), ...(roleBank.Medium || []), ...(roleBank.Hard || [])];
      available = allQuestions.filter(q => !askedTexts.has(q.questionText.trim().toLowerCase()));
    }

    // If still empty (long interview), generate a dynamic contextual follow-up
    if (available.length === 0) {
      return {
        questionText: `Let's dive deeper into your engineering experience with ${role}. Describe a challenging architectural decision you made, the trade-offs you evaluated, and how you ensured scalability.`,
        category: 'Deep Architecture & Trade-offs',
        difficulty: targetDiff,
        expectedTopics: ['scalability', 'trade-offs', 'architecture', 'resilience', 'clean code']
      };
    }

    const selected = available[Math.floor(Math.random() * available.length)];
    return {
      questionText: selected.questionText,
      category: selected.category,
      difficulty: targetDiff,
      expectedTopics: selected.expectedTopics
    };
  }

  async evaluateAnswer({ questionText, category, difficulty, expectedTopics = [], answerText, role, experienceLevel }) {
    const text = (answerText || '').trim();
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const lowerText = text.toLowerCase();

    // Check how many expected topics were covered
    const matchedTopics = [];
    const missingConcepts = [];

    expectedTopics.forEach(topic => {
      const words = topic.toLowerCase().split(/[\s/]+/);
      const isMatched = words.some(w => w.length > 2 && lowerText.includes(w));
      if (isMatched) {
        matchedTopics.push(topic);
      } else {
        missingConcepts.push(topic);
      }
    });

    const topicCoverageRatio = expectedTopics.length > 0 ? (matchedTopics.length / expectedTopics.length) : 0.5;

    // Scoring heuristics
    let technicalScore = 0;
    let communicationScore = 0;
    let relevanceScore = 0;
    let problemSolvingScore = 0;

    if (wordCount < 8) {
      // Extremely brief or empty answer
      technicalScore = Math.floor(20 + Math.random() * 15);
      communicationScore = Math.floor(30 + Math.random() * 15);
      relevanceScore = Math.floor(30 + Math.random() * 15);
      problemSolvingScore = Math.floor(25 + Math.random() * 10);
    } else if (wordCount < 20) {
      // Short answer
      technicalScore = Math.floor(40 + topicCoverageRatio * 35);
      communicationScore = Math.floor(50 + Math.random() * 15);
      relevanceScore = Math.floor(45 + topicCoverageRatio * 35);
      problemSolvingScore = Math.floor(40 + topicCoverageRatio * 30);
    } else {
      // Substantial answer
      technicalScore = Math.min(98, Math.floor(58 + topicCoverageRatio * 38 + Math.min(wordCount, 100) * 0.1));
      communicationScore = Math.min(95, Math.floor(65 + Math.min(wordCount, 120) * 0.15 + (lowerText.includes('example') || lowerText.includes('because') ? 8 : 0)));
      relevanceScore = Math.min(98, Math.floor(62 + topicCoverageRatio * 34));
      problemSolvingScore = Math.min(96, Math.floor(60 + topicCoverageRatio * 32 + (text.includes('code') || text.includes(';') ? 6 : 0)));
    }

    const overallScore = Math.round(
      technicalScore * 0.4 +
      problemSolvingScore * 0.3 +
      relevanceScore * 0.15 +
      communicationScore * 0.15
    );

    // Strengths and weaknesses extraction
    const strengths = [];
    const weaknesses = [];

    if (matchedTopics.length > 0) {
      strengths.push(`Clearly articulated key concepts: ${matchedTopics.slice(0, 3).join(', ')}.`);
    }
    if (wordCount >= 40) {
      strengths.push('Provided a structured, comprehensive response with good contextual depth.');
    }
    if (lowerText.includes('for example') || lowerText.includes('such as') || lowerText.includes('in my project')) {
      strengths.push('Effective use of concrete real-world examples to support arguments.');
    }
    if (strengths.length === 0) {
      strengths.push('Recognized the core objective of the question.');
    }

    if (missingConcepts.length > 0) {
      weaknesses.push(`Omitted critical technical nuances around: ${missingConcepts.slice(0, 3).join(', ')}.`);
    }
    if (wordCount < 25) {
      weaknesses.push('Response is too brief; consider expanding on underlying mechanics and edge cases.');
    }
    if (!lowerText.includes('because') && !lowerText.includes('therefore') && !lowerText.includes('trade-off')) {
      weaknesses.push('Could demonstrate deeper architectural reasoning by analyzing trade-offs.');
    }
    if (weaknesses.length === 0) {
      weaknesses.push('Could mention alternative patterns or high-scale edge-case considerations.');
    }

    let feedback = '';
    if (overallScore >= 80) {
      feedback = `Strong response! You demonstrated a solid grasp of ${category}, especially regarding ${matchedTopics.slice(0, 2).join(' and ') || 'the core architecture'}.`;
    } else if (overallScore >= 50) {
      feedback = `Good foundational answer. You captured the primary purpose, but would benefit from discussing ${missingConcepts[0] || 'deeper internal mechanics'} in greater detail.`;
    } else {
      feedback = `The answer was somewhat incomplete. To excel in this topic, make sure to cover ${missingConcepts.slice(0, 2).join(' and ') || 'the key conceptual definitions'}.`;
    }

    let suggestedNextDifficulty = difficulty;
    if (overallScore >= 80) {
      suggestedNextDifficulty = difficulty === 'Easy' ? 'Medium' : 'Hard';
    } else if (overallScore < 50) {
      suggestedNextDifficulty = difficulty === 'Hard' ? 'Medium' : 'Easy';
    }

    return {
      technicalScore,
      communicationScore,
      relevanceScore,
      problemSolvingScore,
      overallScore,
      feedback,
      strengths,
      weaknesses,
      missingConcepts,
      suggestedNextDifficulty
    };
  }

  async generateFinalReport({ role, experienceLevel, interviewType, totalQuestions, answersWithQuestions = [] }) {
    if (answersWithQuestions.length === 0) {
      return {
        summary: 'No answers recorded for this interview session.',
        strengths: ['Started session'],
        weaknesses: ['Did not answer questions'],
        skillGaps: [],
        recommendedTopics: [],
        improvementPlan: ['Complete a full session to generate an in-depth report.']
      };
    }

    const avgOverall = Math.round(
      answersWithQuestions.reduce((acc, item) => acc + (item.answer?.overallScore || 0), 0) / answersWithQuestions.length
    );
    const avgTech = Math.round(
      answersWithQuestions.reduce((acc, item) => acc + (item.answer?.technicalScore || 0), 0) / answersWithQuestions.length
    );

    // Aggregate strengths & weaknesses
    const allStrengths = [];
    const allWeaknesses = [];
    const allMissing = [];

    answersWithQuestions.forEach(item => {
      if (item.answer?.strengths) {
        try {
          const s = typeof item.answer.strengths === 'string' ? JSON.parse(item.answer.strengths) : item.answer.strengths;
          allStrengths.push(...s);
        } catch (_) {}
      }
      if (item.answer?.weaknesses) {
        try {
          const w = typeof item.answer.weaknesses === 'string' ? JSON.parse(item.answer.weaknesses) : item.answer.weaknesses;
          allWeaknesses.push(...w);
        } catch (_) {}
      }
      if (item.answer?.missingConcepts) {
        try {
          const m = typeof item.answer.missingConcepts === 'string' ? JSON.parse(item.answer.missingConcepts) : item.answer.missingConcepts;
          allMissing.push(...m);
        } catch (_) {}
      }
    });

    const uniqueStrengths = [...new Set(allStrengths)].slice(0, 4);
    const uniqueWeaknesses = [...new Set(allWeaknesses)].slice(0, 4);
    const uniqueMissing = [...new Set(allMissing)];

    const skillGaps = uniqueMissing.slice(0, 4).map((concept, idx) => ({
      skill: concept.charAt(0).toUpperCase() + concept.slice(1),
      gap: `Demonstrated partial coverage during question responses; needs deeper theoretical and practical mastery.`,
      severity: idx === 0 ? 'High' : idx === 1 ? 'Medium' : 'Low'
    }));

    if (skillGaps.length === 0) {
      skillGaps.push({
        skill: `${role} Advanced Patterns`,
        gap: 'Candidate demonstrated solid baseline knowledge; can push towards large-scale system optimization.',
        severity: 'Low'
      });
    }

    const recommendedTopics = uniqueMissing.length > 0 
      ? uniqueMissing.map(m => `In-depth exploration of ${m}`) 
      : [`Advanced ${role} architecture`, 'Performance profiling', 'System scalability and design patterns'];

    const improvementPlan = [
      `Deepen expertise in ${uniqueMissing[0] || 'core architectural patterns'} by building a hands-on project.`,
      'Structure verbal/written answers using the STAR format (Situation, Task, Action, Result) for behavioral and problem-solving questions.',
      'Practice explaining trade-offs between memory, CPU performance, and developer velocity.',
      'Review official documentation and write unit test suites covering edge cases in your target stack.'
    ];

    const summary = `The candidate completed ${answersWithQuestions.length} questions for the ${role} (${experienceLevel}) position with an overall score of ${avgOverall}/100. Technical proficiency scored ${avgTech}/100. ${
      avgOverall >= 80 
        ? 'The candidate exhibited strong domain competence, precise terminology, and clear problem decomposition.' 
        : avgOverall >= 60 
          ? 'The candidate has a solid foundational understanding with room for deeper technical articulation and edge-case handling.' 
          : 'The candidate understands the basics but needs targeted revision on key concepts and structured problem-solving.'
    }`;

    return {
      summary,
      strengths: uniqueStrengths.length > 0 ? uniqueStrengths : ['Good communication and willingness to tackle technical challenges.'],
      weaknesses: uniqueWeaknesses.length > 0 ? uniqueWeaknesses : ['Need more depth on specific framework internals.'],
      skillGaps,
      recommendedTopics: recommendedTopics.slice(0, 5),
      improvementPlan
    };
  }
}
