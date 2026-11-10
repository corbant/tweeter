import * as z from "@zod/mini";

export const aliasSchema = z.string().check(z.minLength(1));

export const userAliasParamsSchema = z.object({
  alias: aliasSchema
});

export const paginationSchema = z.object({
  limit: z.optional(z.number().check(z.int(), z.minimum(1), z.maximum(50))),
  cursor: z.optional(z.string())
});

export const errorResponseSchema = z.object({
  error: z.string()
});

export const pagedResponseSchema = z.object({
  nextCursor: z.nullable(z.string())
});

export type UserAliasParams = z.infer<typeof userAliasParamsSchema>;

export type PaginationParams = z.infer<typeof paginationSchema>;

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export type PagedResponse = z.infer<typeof pagedResponseSchema>;
