import { userAliasParamsSchema } from "tweeter-shared";
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

  const { alias: userToUnfollow } = pathResult.data;

  const followService = new FollowService();
  await followService.unfollow(alias, userToUnfollow);

  return {
    statusCode: 204
  };
};
