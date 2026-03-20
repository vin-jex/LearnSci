export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export type TopicStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface TopicWithStatus {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  status: TopicStatus;
  lastScore?: number;
}

export interface KeyTerm {
  id: string;
  topicId: string;
  englishTerm: string;
  igboTerm: string;
  igboExplanation?: string | null;
}

export type QuestionType = "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";

export interface Question {
  id: string;
  topicId: string;
  type: QuestionType;
  questionText: string;
  options?: string[] | null;
  correctAnswer: string;
  feedbackRules: FeedbackRules;
}

export interface FeedbackRules {
  misconceptions: { pattern: string; feedback: string }[];
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
