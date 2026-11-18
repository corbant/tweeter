import {
  userAliasParamsSchema,
  getIsFollowingResponseSchema,
  type IsFollowingResponse
} from "tweeter-shared";
import type {
  APIGatewayProxyHandlerV2WithLambdaAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";
import FollowService from "../../services/follow";

interface AuthorizerContext {
  alias: string;
}

export const handler: APIGatewayProxyHandlerV2WithLambdaAuthorizer<AuthorizerContext> = async (
  event
): Promise<APIGatewayProxyResultV2> => {
  const pathResult = userAliasParamsSchema.safeParse(event.pathParameters);

  if (!pathResult.success) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "Invalid body", issues: pathResult.error?.issues })
    };
  }

  const alias = event.requestContext.authorizer.lambda.alias;

  const { alias: userToVerify } = pathResult.data;

  const followService = new FollowService();
  const isFollowing = await followService.getIsFollower(alias, userToVerify);

  const result: IsFollowingResponse = {
    isFollowing
  };

  const response = getIsFollowingResponseSchema.parse(result);

  return {
    statusCode: 200,
    body: JSON.stringify(response)
  };
};
