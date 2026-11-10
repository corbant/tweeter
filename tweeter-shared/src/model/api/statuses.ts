import * as z from "@zod/mini";
import { pagedResponseSchema } from "./common";
import { userSummary } from "./users";

export const statusSchema = z.object({
  author: userSummary,
  content: z.string(),
  timestamp: z.number().check(z.int(), z.nonnegative())
});

export const createStatusRequestSchema = z.object({
  content: z.string().check(z.minLength(1), z.maxLength(1000))
});

export const createStatusResponseSchema = statusSchema;

export const statusListResponseSchema = z.extend(pagedResponseSchema, {
  items: z.array(statusSchema)
});

export type StatusData = z.infer<typeof statusSchema>;

export type CreateStatusRequest = z.infer<typeof createStatusRequestSchema>;
export type CreateStatusResponse = z.infer<typeof createStatusResponseSchema>;
export type StatusListResponse = z.infer<typeof statusListResponseSchema>;
