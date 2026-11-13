import { type ErrorResponse, AuthResponse } from "tweeter-shared";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import type { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import UserService from "../../services/user";

export const handler: APIGatewayProxyHandlerV2<null> = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2<null>> => {
  const userService = new UserService();

  await userService.logout();

  return {
    statusCode: 204
  };
};
