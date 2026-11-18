import {
  type ErrorResponse,
  type UserProfileResponse,
  userProfileResponseSchema,
  userAliasParamsSchema
} from "tweeter-shared";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import type { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import UserService from "../../services/user";

export const handler: APIGatewayProxyHandlerV2<UserProfileResponse | ErrorResponse> = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2<UserProfileResponse | ErrorResponse>> => {
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

  const { alias } = pathResult.data;

  const userService = new UserService();

  const user = await userService.getUserByAlias(alias);

  if (!user) {
    return {
      statusCode: 404
    };
  }

  const response = userProfileResponseSchema.parse(user);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(response)
  };
};
