/* eslint-disable @typescript-eslint/no-explicit-any */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .replace(/[<>\"']/g, "")
    .trim()
    .slice(0, 1000);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = sanitizeInput(email);
  return emailRegex.test(sanitized) && sanitized.length <= 254;
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password) {
    errors.push("La contraseña es requerida");
    return { valid: false, errors };
  }

  if (password.length < 8) {
    errors.push("Mínimo 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Al menos una mayúscula");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Al menos una minúscula");
  }

  if (!/\d/.test(password)) {
    errors.push("Al menos un número");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Un carácter especial: !@#$%^&*");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

const rateLimitStore = new Map<string, number[]>();

export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60 * 1000
): boolean {
  const now = Date.now();
  const key = `rate-limit:${identifier}`;
  const timestamps = rateLimitStore.get(key) || [];

  const recentTimestamps = timestamps.filter((ts) => now - ts < windowMs);

  if (recentTimestamps.length >= limit) {
    return false;
  }

  recentTimestamps.push(now);
  rateLimitStore.set(key, recentTimestamps);

  if (Math.random() < 0.1) {
    for (const [k, v] of rateLimitStore.entries()) {
      const filtered = v.filter((ts) => now - ts < windowMs * 5);
      if (filtered.length === 0) {
        rateLimitStore.delete(k);
      } else {
        rateLimitStore.set(k, filtered);
      }
    }
  }

  return true;
}

export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken;
}

export function isValidRedirectURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    const appUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    return parsed.origin === new URL(appUrl).origin;
  } catch {
    return url.startsWith("/") && !url.startsWith("//");
  }
}

export function sanitizeForLogging(obj: any): any {
  const sensitiveKeys = [
    "password",
    "token",
    "secret",
    "apiKey",
    "creditCard",
    "ssn",
  ];

  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const key in sanitized) {
    if (sensitiveKeys.some((k) => key.toLowerCase().includes(k))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof sanitized[key] === "object") {
      sanitized[key] = sanitizeForLogging(sanitized[key]);
    }
  }

  return sanitized;
}

export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function generateSessionID(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function validateObjectSchema(
  obj: any,
  schema: Record<string, string>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const [key, type] of Object.entries(schema)) {
    if (!(key in obj)) {
      errors[key] = `Campo requerido: ${key}`;
      continue;
    }

    if (typeof obj[key] !== type) {
      errors[key] = `Tipo incorrecto: esperado ${type}, recibido ${typeof obj[
        key
      ]}`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function isValidMongoId(id: string): boolean {
  return /^[0-9a-f]{24}$/.test(id);
}

export function isValidPrediction(prediction: any): boolean {
  if (!prediction || typeof prediction !== "object") return false;

  const hasRequiredFields =
    typeof prediction.birdSpecies === "string" &&
    (typeof prediction.confidence === "number" ||
      typeof prediction.score === "number");

  if (!hasRequiredFields) return false;

  const confidence = prediction.confidence ?? prediction.score;
  return confidence >= 0 && confidence <= 1;
}
