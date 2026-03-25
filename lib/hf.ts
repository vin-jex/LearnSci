import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

const MODELS = {
  feedback: "mistralai/Mistral-7B-Instruct-v0.3",
  questionGen: "mistralai/Mistral-7B-Instruct-v0.3",
  embedding: "sentence-transformers/all-MiniLM-L6-v2",
  shortAnswerNLI: "facebook/bart-large-mnli",
} as const;

const HF_TIMEOUT_MS = 8000;

// ── Feedback augmentation ─────────────────────────────────────────

export async function augmentFeedback(
  questionText: string,
  correctAnswer: string,
  learnerAnswer: string,
  defaultFeedback: string,
): Promise<string> {
  try {
    const prompt = `<s>[INST] You are a science tutor for Nigerian secondary school students.
A student answered a question incorrectly.

Question: ${questionText}
Correct answer: ${correctAnswer}
Student's answer: ${learnerAnswer}

Write a clear, encouraging 2-sentence explanation of why the correct answer is right.
Be specific and educational. Do not repeat the question. Reply with the explanation only. [/INST]`;

    const result = await withTimeout(
      hf.textGeneration({
        model: MODELS.feedback,
        inputs: prompt,
        parameters: {
          max_new_tokens: 120,
          temperature: 0.4,
          return_full_text: false,
        },
      }),
      HF_TIMEOUT_MS,
    );

    const text = result.generated_text?.trim();
    return text && text.length > 20 ? text : defaultFeedback;
  } catch {
    return defaultFeedback;
  }
}

// ── Short answer NLI evaluation ───────────────────────────────────

export async function evaluateShortAnswerNLI(
  questionText: string,
  correctAnswer: string,
  learnerAnswer: string,
): Promise<{ isCorrect: boolean; confidence: number }> {
  try {
    const result = await withTimeout(
      hf.zeroShotClassification({
        model: MODELS.shortAnswerNLI,
        inputs: `Question: ${questionText} Answer: ${learnerAnswer}`,
        parameters: {
          candidate_labels: [
            `correct — matches: ${correctAnswer}`,
            "incorrect — does not match",
          ],
        },
      }),
      HF_TIMEOUT_MS,
    );

    const correctElem = Array.isArray(result)
      ? result.find((el) => el.label && el.label.startsWith("correct"))
      : undefined;
    const confidence = correctElem?.score ?? 0;
    return { isCorrect: confidence >= 0.65, confidence };
  } catch {
    const norm = (s: string) => s.toLowerCase().trim();
    const isCorrect = norm(learnerAnswer).includes(norm(correctAnswer));
    return { isCorrect, confidence: isCorrect ? 1 : 0 };
  }
}

// ── Embeddings ────────────────────────────────────────────────────

export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const result = (await withTimeout(
      hf.featureExtraction({
        model: MODELS.embedding,
        inputs: text,
      }),
      HF_TIMEOUT_MS,
    )) as number[] | number[][];

    const embedding = Array.isArray(result[0]) ? result[0] : result;
    return embedding as number[];
  } catch {
    return [];
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length === 0 || b.length === 0 || a.length !== b.length) return 0;
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

// ── Question generation ───────────────────────────────────────────

export async function generateQuestions(
  topicTitle: string,
  lessonContent: string,
  count: number = 5,
): Promise<GeneratedQuestion[]> {
  const truncated = lessonContent.slice(0, 2000);

  const prompt = `<s>[INST] You are creating quiz questions for Nigerian secondary school science students.

Topic: ${topicTitle}
Lesson content:
${truncated}

Generate ${count} quiz questions in this exact JSON format:
[
  {
    "type": "MCQ",
    "questionText": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "defaultFeedback": "Brief explanation of why the answer is correct."
  }
]

Rules:
- Mix MCQ, TRUE_FALSE, and SHORT_ANSWER types
- TRUE_FALSE has options ["True","False"]
- SHORT_ANSWER has options null
- correctAnswer must exactly match one option for MCQ/TRUE_FALSE
- defaultFeedback must be educational, 1-2 sentences
- Return ONLY valid JSON, no extra text [/INST]`;

  try {
    const result = await withTimeout(
      hf.textGeneration({
        model: MODELS.questionGen,
        inputs: prompt,
        parameters: {
          max_new_tokens: 1200,
          temperature: 0.5,
          return_full_text: false,
        },
      }),
      30000,
    );

    const raw = result.generated_text?.trim() ?? "";
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]) as GeneratedQuestion[];
    return parsed.filter(isValidGeneratedQuestion);
  } catch {
    return [];
  }
}

// ── Weak area prediction ──────────────────────────────────────────

export async function predictWeakAreas(
  topicTitle: string,
  answeredSoFar: { questionText: string; isCorrect: boolean; answer: string }[],
): Promise<string[]> {
  if (answeredSoFar.length < 3) return [];

  const wrongAnswers = answeredSoFar
    .filter((q) => !q.isCorrect)
    .map((q) => `- ${q.questionText} (answered: ${q.answer})`)
    .join("\n");

  if (!wrongAnswers) return [];

  const prompt = `<s>[INST] A student is taking a quiz on "${topicTitle}".
They have answered these questions incorrectly so far:
${wrongAnswers}

List 2-3 specific science concepts the student likely struggles with based on these errors.
Return ONLY a JSON array of short concept strings, e.g. ["concept 1", "concept 2"].
No explanation, just the JSON array. [/INST]`;

  try {
    const result = await withTimeout(
      hf.textGeneration({
        model: MODELS.feedback,
        inputs: prompt,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.3,
          return_full_text: false,
        },
      }),
      HF_TIMEOUT_MS,
    );

    const raw = result.generated_text?.trim() ?? "";
    const match = raw.match(/\[[\s\S]*?\]/);
    if (!match) return [];
    return JSON.parse(match[0]) as string[];
  } catch {
    return [];
  }
}

// ── Adaptive difficulty ───────────────────────────────────────────

export async function rankQuestionsByDifficulty(
  questions: { id: string; questionText: string; difficulty: number }[],
  learnerEmbedding: number[],
  targetDifficulty: number,
): Promise<string[]> {
  if (learnerEmbedding.length === 0) {
    return questions
      .sort(
        (a, b) =>
          Math.abs(a.difficulty - targetDifficulty) -
          Math.abs(b.difficulty - targetDifficulty),
      )
      .map((q) => q.id);
  }

  const scored = await Promise.all(
    questions.map(async (q) => {
      const qEmbed = await getEmbedding(q.questionText);
      const sim = cosineSimilarity(learnerEmbedding, qEmbed);
      const diffScore = 1 - Math.abs(q.difficulty - targetDifficulty);
      return { id: q.id, score: sim * 0.4 + diffScore * 0.6 };
    }),
  );

  return scored.sort((a, b) => b.score - a.score).map((q) => q.id);
}

// ── Recommendations ───────────────────────────────────────────────

export async function rankTopicRecommendations(
  topics: { id: string; title: string; description: string }[],
  weakAreaDescriptions: string[],
): Promise<string[]> {
  if (weakAreaDescriptions.length === 0) return topics.map((t) => t.id);

  const weakText = weakAreaDescriptions.join(". ");
  const weakEmbedding = await getEmbedding(weakText);
  if (weakEmbedding.length === 0) return topics.map((t) => t.id);

  const scored = await Promise.all(
    topics.map(async (topic) => {
      const topicEmbed = await getEmbedding(
        `${topic.title}: ${topic.description}`,
      );
      return {
        id: topic.id,
        score: cosineSimilarity(weakEmbedding, topicEmbed),
      };
    }),
  );

  return scored.sort((a, b) => b.score - a.score).map((t) => t.id);
}

// ── Helpers ───────────────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`HF timeout after ${ms}ms`)), ms),
    ),
  ]);
}

interface GeneratedQuestion {
  type: "MCQ" | "TRUE_FALSE" | "SHORT_ANSWER";
  questionText: string;
  options: string[] | null;
  correctAnswer: string;
  defaultFeedback: string;
}

function isValidGeneratedQuestion(q: unknown): q is GeneratedQuestion {
  if (!q || typeof q !== "object") return false;
  const obj = q as Record<string, unknown>;
  return (
    typeof obj.questionText === "string" &&
    typeof obj.correctAnswer === "string" &&
    typeof obj.defaultFeedback === "string" &&
    ["MCQ", "TRUE_FALSE", "SHORT_ANSWER"].includes(obj.type as string)
  );
}
