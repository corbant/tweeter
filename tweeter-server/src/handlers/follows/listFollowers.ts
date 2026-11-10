import {
  userAliasParamsSchema,
  type ErrorResponse,
  followListResponseSchema,
  type FollowListResponse
} from "tweeter-shared";
import FollowService from "../../services/follow";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import type { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { paginationSchema } from "tweeter-shared/dist/model/api/common";

export const handler: APIGatewayProxyHandlerV2<FollowListResponse | ErrorResponse> = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2<FollowListResponse | ErrorResponse>> => {
  const pathResult = userAliasParamsSchema.safeParse(event.pathParameters);

  if (!pathResult.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid path parameters", issues: pathResult.error?.issues })
    };
  }

  const queryResult = paginationSchema.safeParse(event.queryStringParameters);

  if (!queryResult.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid query parameters",
        issues: queryResult.error.issues
      })
    };
  }

  const { alias } = pathResult.data;
  const { limit, cursor } = queryResult.data;

  const followService = new FollowService();
  const [items, nextCursor] = await followService.loadMoreFollowers(
    alias,
    limit ?? DEFAULT_LIST_LIMIT,
    cursor ?? null
  );

  const result = {
    nextCursor,
    items
  };

  const response = followListResponseSchema.parse(result);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(response)
  };
};
