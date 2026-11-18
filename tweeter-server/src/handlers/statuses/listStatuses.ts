import {
  userAliasParamsSchema,
  type ErrorResponse,
  statusListResponseSchema,
  type StatusListResponse
} from "tweeter-shared";
import StatusService from "../../services/status";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import type { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { paginationSchema } from "tweeter-shared/dist/model/api/common";
import { DEFAULT_LIST_LIMIT } from "../common";

export const handler: APIGatewayProxyHandlerV2<StatusListResponse | ErrorResponse> = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2<StatusListResponse | ErrorResponse>> => {
  const pathResult = userAliasParamsSchema.safeParse(event.pathParameters);

  if (!pathResult.success) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "Invalid path parameters", issues: pathResult.error?.issues })
    };
  }

  const queryResult = paginationSchema.safeParse(event.queryStringParameters);

  if (!queryResult.success) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Invalid query parameters",
        issues: queryResult.error.issues
      })
    };
  }

  const { alias } = pathResult.data;
  const { limit, cursor } = queryResult.data;

  const statusService = new StatusService();
  const [items, nextCursor] = await statusService.getStory(
    alias,
    limit ?? DEFAULT_LIST_LIMIT,
    cursor ?? null
  );

  const result = {
    nextCursor,
    items
  };

  const response = statusListResponseSchema.parse(result);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(response)
  };
};
