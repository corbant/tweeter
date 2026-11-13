import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

interface Props extends cdk.StackProps {
  projectRoot?: string;
}

export class TweeterServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: Props) {
    super(scope, id, props);

    const projectRoot = props?.projectRoot;

    const getFolloweesLambda = new NodejsFunction(this, "FolloweesLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/handlers/follows/listFollowees.ts"),
      handler: "handler",
      projectRoot,
      architecture: Architecture.ARM_64
    });

    const getFollowersLambda = new NodejsFunction(this, "FollowersLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/handlers/follows/listFollowers.ts"),
      handler: "handler",
      projectRoot,
      architecture: Architecture.ARM_64
    });

    const loginLambda = new NodejsFunction(this, "LoginLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/handlers/auth/login.ts"),
      handler: "handler",
      projectRoot,
      architecture: Architecture.ARM_64
    });

    const logoutLambda = new NodejsFunction(this, "LogoutLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/handlers/auth/logout.ts"),
      handler: "handler",
      projectRoot,
      architecture: Architecture.ARM_64
    });

    const registerLambda = new NodejsFunction(this, "RegisterLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/handlers/auth/register.ts"),
      handler: "handler",
      projectRoot,
      architecture: Architecture.ARM_64
    });

    const httpApi = new apigateway.HttpApi(this, "TweeterApi", {
      corsPreflight: {
        allowHeaders: ["Authorization"],
        allowMethods: [apigateway.CorsHttpMethod.GET],
        allowOrigins: ["*"],
        maxAge: cdk.Duration.days(10)
      }
    });

    // GET /users/{alias}
    // GET /users/{alias}/followers
    const getFollowersRoute = httpApi.addRoutes({
      path: "/users/{alias}/followers",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("FollowersLambdaIntegration", getFollowersLambda)
    });

    // GET /users/{alias}/followees
    const getFolloweesRoute = httpApi.addRoutes({
      path: "/users/{alias}/followees",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("FolloweesLambdaIntegration", getFolloweesLambda)
    });
    // GET /me/following/{alias}
    // PUT /me/following/{alias}
    // DELETE /me/following/{alias}
    // GET /users/{alias}/feed
    // GET /users/{alias}/story
    // POST /me/posts

    // POST /auth/login
    const loginRoute = httpApi.addRoutes({
      path: "/auth/login",
      methods: [apigateway.HttpMethod.POST],
      integration: new HttpLambdaIntegration("LoginLambdaIntegration", loginLambda)
    });
    // POST /auth/register
    const registerRoute = httpApi.addRoutes({
      path: "/auth/register",
      methods: [apigateway.HttpMethod.POST],
      integration: new HttpLambdaIntegration("RegisterLambdaIntegration", registerLambda)
    });
    // POST /auth/logout
    const logoutRoute = httpApi.addRoutes({
      path: "/auth/logout",
      methods: [apigateway.HttpMethod.POST],
      integration: new HttpLambdaIntegration("LogoutLambdaIntegration", logoutLambda)
    });
    // POST /uploads/profile-image
  }
}
