import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "session";

const PAYLOAD = "authenticated";

function secret() {
  const value = process.env.APP_PASSWORD;
  if (!value) {
    throw new Error("APP_PASSWORD no está configurada");
  }
  return value;
}

export function createSessionToken() {
  return createHmac("sha256", secret()).update(PAYLOAD).digest("hex");
}

export function isValidSessionToken(token: string | undefined) {
  if (!token) return false;

  const expected = Buffer.from(createSessionToken());
  const actual = Buffer.from(token);

  return (
    expected.length === actual.length && timingSafeEqual(expected, actual)
  );
}
