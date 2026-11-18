import { createStatusRequestSchema } from "tweeter-shared";
import StatusService from "../../services/status";
import type {
  APIGatewayProxyHandlerV2WithLambdaAuthorizer,
  APIGatewayProxyResultV2
} from "aws-lambda";

interface AuthorizerContext {
  alias: string;
}

export const handler: APIGatewayProxyHandlerV2WithLambdaAuthorizer<AuthorizerContext> = async (
  event
): Promise<APIGatewayProxyResultV2> => {
  const bodyResult = createStatusRequestSchema.safeParse(event.body);

  if (!bodyResult.success) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: "Invalid body", issues: bodyResult.error?.issues })
    };
  }

  const alias = event.requestContext.authorizer.lambda.alias;

  const { content } = bodyResult.data;

  const statusService = new StatusService();
  await statusService.postStatus(alias, content);

  return {
    statusCode: 204
  };
};
