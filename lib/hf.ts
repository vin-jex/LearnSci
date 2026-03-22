import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

const MODELS = {
  translation: "Helsinki-NLP/opus-mt-en-ig",
  feedback: "HuggingFaceH4/zephyr-7b-beta",
  questionGen: "HuggingFaceH4/zephyr-7b-beta",
  embedding: "sentence-transformers/all-MiniLM-L6-v2",
  shortAnswerNLI: "facebook/bart-large-mnli",
} as const;

const HF_TIMEOUT_MS = 8000;

// ── Translation ───────────────────────────────────────────────────

export async function translateToIgbo(text: string): Promise<string> {
  try {
    const result = await withTimeout(
      hf.translation({
        model: MODELS.translation,
        inputs: text,
      }),
      HF_TIMEOUT_MS,
    );
    return (result as { translation_text: string }).translation_text ?? text;
  } catch {
    return text;
  }
}

// ── Feedback augmentation ─────────────────────────────────────────

export async function augmentFeedback(
  questionText: string,
  correctAnswer: string,
  learnerAnswer: string,
  defaultFeedback: string,
): Promise<string> {
  try {
    const prompt =
      `<|system|>\nYou are a science tutor for Nigerian secondary school students. ` +
      `You give clear, encouraging, specific explanations. Never repeat the question. ` +
      `Reply with the explanation only — no preamble, no labels.</s>\n` +
      `<|user|>\nA student answered a quiz question incorrectly.\n\n` +
      `Question: ${questionText}\n` +
      `Correct answer: ${correctAnswer}\n` +
      `Student's answer: ${learnerAnswer}\n\n` +
      `Write a clear, encouraging 2-sentence explanation of why the correct answer is right.</s>\n` +
      `<|assistant|>\n`;

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
    const result = (await withTimeout(
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
    )) as { label: string; score: number }[];

    const correct = result.find((r) => r.label.startsWith("correct"));
    const confidence = correct?.score ?? 0;
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

  const prompt =
    `<|system|>\nYou are a quiz author for Nigerian secondary school science students. ` +
    `You respond ONLY with valid JSON — no explanation, no markdown, no preamble.</s>\n` +
    `<|user|>\nGenerate ${count} quiz questions for the following topic and lesson.\n\n` +
    `Topic: ${topicTitle}\n\n` +
    `Lesson content:\n${truncated}\n\n` +
    `Return a JSON array in exactly this format:\n` +
    `[\n` +
    `  {\n` +
    `    "type": "MCQ",\n` +
    `    "questionText": "...",\n` +
    `    "options": ["Option A", "Option B", "Option C", "Option D"],\n` +
    `    "correctAnswer": "Option A",\n` +
    `    "defaultFeedback": "1-2 sentence explanation of why the answer is correct."\n` +
    `  }\n` +
    `]\n\n` +
    `Rules:\n` +
    `- Mix MCQ, TRUE_FALSE, and SHORT_ANSWER types across the ${count} questions\n` +
    `- TRUE_FALSE must have options ["True", "False"]\n` +
    `- SHORT_ANSWER must have options as null\n` +
    `- correctAnswer must exactly match one of the options for MCQ and TRUE_FALSE\n` +
    `- Return ONLY the JSON array, nothing else</s>\n` +
    `<|assistant|>\n`;

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

  const prompt =
    `<|system|>\nYou are an educational analyst. ` +
    `You respond ONLY with a valid JSON array — no explanation, no preamble.</s>\n` +
    `<|user|>\nA student is taking a quiz on "${topicTitle}".\n\n` +
    `They answered these questions incorrectly:\n${wrongAnswers}\n\n` +
    `Based on the errors above, list 2-3 specific science concepts this student likely struggles with.\n` +
    `Return ONLY a JSON array of short concept strings.\n` +
    `Example: ["concept 1", "concept 2", "concept 3"]</s>\n` +
    `<|assistant|>\n`;

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

// ── Adaptive difficulty ranking ───────────────────────────────────

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

// ── Topic recommendations ─────────────────────────────────────────

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
