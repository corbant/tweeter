import * as z from "@zod/mini";
import { aliasSchema } from "./common";
import { userProfile } from "./users";

export const registerRequestSchema = z.object({
  alias: aliasSchema,
  firstName: z.string().check(z.minLength(1)),
  lastName: z.string().check(z.minLength(1)),
  password: z.string().check(z.minLength(8)),
  imageKey: z.optional(z.string())
});

export const loginRequestSchema = z.object({
  alias: aliasSchema,
  password: z.string()
});

export const authTokenSchema = z.object({
  token: z.string(),
  timestamp: z.number().check(z.int(), z.nonnegative())
});

export const authResponseSchema = z.object({
  authToken: authTokenSchema,
  user: userProfile
});

export type AuthTokenData = z.infer<typeof authTokenSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
