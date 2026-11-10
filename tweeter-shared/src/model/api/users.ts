import * as z from "@zod/mini";
import { aliasSchema } from "./common";

export const userSummary = z.object({
  alias: aliasSchema,
  firstName: z.string(),
  lastName: z.string(),
  imageUrl: z.url()
});

export const userProfile = z.extend(userSummary, {
  followerCount: z.number(),
  followeeCount: z.number()
});

export const userProfileResponseSchema = userProfile;

export type UserSummaryData = z.infer<typeof userSummary>;
export type UserProfileData = z.infer<typeof userProfile>;

export type UserResponse = z.infer<typeof userProfileResponseSchema>;
