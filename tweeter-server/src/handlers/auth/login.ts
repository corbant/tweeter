import {
  type ErrorResponse,
  authResponseSchema,
  AuthResponse,
  loginRequestSchema
} from "tweeter-shared";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import type { APIGatewayProxyHandlerV2, APIGatewayProxyResultV2 } from "aws-lambda";
import UserService from "../../services/user";

export const handler: APIGatewayProxyHandlerV2<AuthResponse | ErrorResponse> = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2<AuthResponse | ErrorResponse>> => {
  const bodyResult = loginRequestSchema.safeParse(event.body);

  if (!bodyResult.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid body", issues: bodyResult.error?.issues })
    };
  }

  const { alias, password } = bodyResult.data;

  const userService = new UserService();

  const [authToken, user] = await userService.login(alias, password);

  const result = {
    authToken,
    user
  };

  const response = authResponseSchema.parse(result);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(response)
  };
};
