// All classes that should be avaialble to other modules need to exported here. export * does not work when
// uploading to lambda. Instead we have to list each export.

// Domain Classes
export { Follow } from "./model/domain/Follow";
export { PostSegment, Type } from "./model/domain/PostSegment";
export { Status } from "./model/domain/Status";
export { UserProfile } from "./model/domain/UserProfile";
export { UserSummary } from "./model/domain/UserSummary";
export { AuthToken } from "./model/domain/AuthToken";

// Data
export type { UserSummaryData, UserProfileData } from "./model/api/users";

// Requests
export { userAliasParamsSchema, type UserAliasParams } from "./model/api/common";
export {
  loginRequestSchema,
  type LoginRequest,
  registerRequestSchema,
  type RegisterRequest
} from "./model/api/auth";
export { createStatusRequestSchema, type CreateStatusRequest } from "./model/api/statuses";

// Responses
export { followListResponseSchema, type FollowListResponse } from "./model/api/follows";
export { errorResponseSchema, type ErrorResponse } from "./model/api/common";
export { authResponseSchema, type AuthResponse } from "./model/api/auth";
export { userProfileResponseSchema, type UserProfileResponse } from "./model/api/users";
export { statusListResponseSchema, type StatusListResponse } from "./model/api/statuses";

// Other
export { FakeData } from "./util/FakeData";
