export interface FeedbackRule {
  pattern: string;
  feedback: string;
}

export interface FeedbackRules {
  misconceptions: FeedbackRule[];
  defaultFeedback: string;
}

export interface EvaluationResult {
  isCorrect: boolean;
  feedback: string;
  weakArea?: string;
}

export type Classification = "STRONG" | "MODERATE" | "WEAK";

export interface PerformanceSummary {
  score: number;
  totalQuestions: number;
  correctCount: number;
  classification: Classification;
  weakAreas: string[];
  recommendation: string;
}

/**
 * Evaluates a learner's answer against the correct answer and feedback rules.
 * Deterministic - no AI involved.
 */
export function evaluateAnswer(
  userAnswer: string,
  correctAnswer: string,
  feedbackRules: FeedbackRules,
  questionText: string,
): EvaluationResult {
  const normalised = (s: string) => s.trim().toLowerCase();
  const isCorrect = normalised(userAnswer) === normalised(correctAnswer);

  if (isCorrect) {
    return {
      isCorrect: true,
      feedback: "Correct! Well done.",
    };
  }

  // Check misconception patterns
  for (const rule of feedbackRules.misconceptions) {
    if (normalised(userAnswer).includes(normalised(rule.pattern))) {
      return {
        isCorrect: false,
        feedback: rule.feedback,
        weakArea: questionText,
      };
    }
  }

  // Default wrong-answer feedback
  return {
    isCorrect: false,
    feedback:
      feedbackRules.defaultFeedback ||
      `The correct answer is: ${correctAnswer}.`,
    weakArea: questionText,
  };
}

/** Classifies a percentage score as STRONG / MODERATE / WEAK */
export function classifyScore(scorePercent: number): Classification {
  if (scorePercent >= 80) return "STRONG";
  if (scorePercent >= 50) return "MODERATE";
  return "WEAK";
}

/** Builds a full performance summary from per-question results */
export function buildPerformanceSummary(
  results: EvaluationResult[],
  totalQuestions: number,
): PerformanceSummary {
  const correctCount = results.filter((r) => r.isCorrect).length;
  const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
  const classification = classifyScore(score);

  const weakAreas = results
    .filter((r) => !r.isCorrect && r.weakArea)
    .map((r) => r.weakArea as string);

  const recommendation =
    classification === "STRONG"
      ? "Excellent work! You've mastered this topic. Unlock the next lesson."
      : classification === "MODERATE"
        ? "Good effort! Review the sections related to your weak areas before moving on."
        : "Keep going! Please review the lesson carefully before retaking the quiz.";

  return {
    score,
    totalQuestions,
    correctCount,
    classification,
    weakAreas,
    recommendation,
  };
}
