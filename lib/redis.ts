import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const TOKEN_TTL = {
  emailVerification: 60 * 60 * 24, // 24 hours
  passwordReset: 60 * 60, // 1 hour
  idempotency: 60 * 60 * 24, // 24 hours
} as const;

export type TokenType = "email_verify" | "password_reset";

export async function storeToken(
  type: TokenType,
  token: string,
  userId: string,
): Promise<void> {
  const ttl =
    type === "email_verify"
      ? TOKEN_TTL.emailVerification
      : TOKEN_TTL.passwordReset;
  await redis.set(`token:${type}:${token}`, userId, { ex: ttl });
}

export async function consumeToken(
  type: TokenType,
  token: string,
): Promise<string | null> {
  const key = `token:${type}:${token}`;
  const userId = await redis.get<string>(key);
  if (userId) await redis.del(key);
  return userId;
}

export async function getExistingToken(
  type: TokenType,
  userId: string,
): Promise<string | null> {
  return redis.get<string>(`token:${type}:user:${userId}`);
}

export async function storeTokenBidirectional(
  type: TokenType,
  token: string,
  userId: string,
): Promise<void> {
  const ttl =
    type === "email_verify"
      ? TOKEN_TTL.emailVerification
      : TOKEN_TTL.passwordReset;
  const pipe = redis.pipeline();
  pipe.set(`token:${type}:${token}`, userId, { ex: ttl });
  pipe.set(`token:${type}:user:${userId}`, token, { ex: ttl });
  await pipe.exec();
}

export async function consumeTokenBidirectional(
  type: TokenType,
  token: string,
): Promise<string | null> {
  const userId = await redis.get<string>(`token:${type}:${token}`);
  if (!userId) return null;
  const pipe = redis.pipeline();
  pipe.del(`token:${type}:${token}`);
  pipe.del(`token:${type}:user:${userId}`);
  await pipe.exec();
  return userId;
}

export async function checkIdempotency(
  key: string,
): Promise<{ seen: boolean; cachedResult?: string }> {
  const cached = await redis.get<string>(`idempotent:${key}`);
  return cached ? { seen: true, cachedResult: cached } : { seen: false };
}

export async function storeIdempotencyResult(
  key: string,
  result: string,
): Promise<void> {
  await redis.set(`idempotent:${key}`, result, {
    ex: TOKEN_TTL.idempotency,
  });
}
