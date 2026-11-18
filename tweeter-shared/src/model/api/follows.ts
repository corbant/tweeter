import * as z from "@zod/mini";
import { userSummary } from "./users";
import { pagedResponseSchema } from "./common";

export const followListResponseSchema = z.extend(pagedResponseSchema, {
  items: z.array(userSummary)
});

export const getIsFollowingResponseSchema = z.object({
  isFollowing: z.boolean()
});

export type FollowListResponse = z.infer<typeof followListResponseSchema>;
export type IsFollowingResponse = z.infer<typeof getIsFollowingResponseSchema>;
