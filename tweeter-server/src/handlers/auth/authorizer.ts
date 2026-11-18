import type { APIGatewayRequestSimpleAuthorizerHandlerV2WithContext, Handler } from "aws-lambda";

interface AuthorizerContext {
  alias: string;
}

export const handler: APIGatewayRequestSimpleAuthorizerHandlerV2WithContext<
  AuthorizerContext
> = async (event) => {
  const authorization = event.headers?.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return { isAuthorized: false, context: { alias: "" } };
  }

  // remove "Bearer "
  const alias = authorization.slice(7).trim();

  if (!alias) {
    return { isAuthorized: false, context: { alias: "" } };
  }

  return {
    isAuthorized: true,
    context: {
      alias
    }
  };
};
