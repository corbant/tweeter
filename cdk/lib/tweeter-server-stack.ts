import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import {
  HttpLambdaAuthorizer,
  HttpLambdaResponseType
} from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { Duration } from "aws-cdk-lib/core";
import { HttpNoneAuthorizer } from "aws-cdk-lib/aws-apigatewayv2";

interface Props extends cdk.StackProps {
  projectRoot?: string;
}

export class TweeterServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: Props) {
    super(scope, id, props);

    const projectRoot = props?.projectRoot;

    const getProfileLambda = new NodejsFunction(this, "ProfileLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/handlers/users/getProfile.ts"),
      handler: "handler",
      projectRoot,
      architecture: Architecture.ARM_64
    });

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

    const getIsFollowingLambda = new NodejsFunction(this, "IsFollowingLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(
        __dirname,
        "../../tweeter-server/src/handlers/follows/getFollowingStatus.ts"
      ),
      handler: "handler",
      projectRoot,
      architecture: Architecture.ARM_64
    });

    const followLambda = new NodejsFunction(this, "FollowLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/handlers/follows/follow.ts"),
      handler: "handler",
      projectRoot,
      architecture: Architecture.ARM_64
    });

    const unfollowLambda = new NodejsFunction(this, "UnfollowLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/handlers/follows/unfollow.ts"),
      handler: "handler",
      projectRoot,
      architecture: Architecture.ARM_64
    });

    const getFeedLambda = new NodejsFunction(this, "FeedLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/handlers/statuses/listFeed.ts"),
      handler: "handler",
      projectRoot,
      architecture: Architecture.ARM_64
    });

    const getStoryLambda = new NodejsFunction(this, "StoryLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/handlers/statuses/listStatuses.ts"),
      handler: "handler",
      projectRoot,
      architecture: Architecture.ARM_64
    });

    const createStatusLambda = new NodejsFunction(this, "StatusLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/handlers/statuses/createStatus.ts"),
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

    const authorizerLambda = new NodejsFunction(this, "AuthorizerLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/handlers/auth/authorizer.ts"),
      handler: "handler",
      projectRoot,
      architecture: Architecture.ARM_64
    });

    const authorizer = new HttpLambdaAuthorizer("ApiAuthorizer", authorizerLambda, {
      responseTypes: [HttpLambdaResponseType.SIMPLE],
      identitySource: ["$request.header.Authorization"],
      resultsCacheTtl: Duration.seconds(0)
    });

    const noAuthorizer = new HttpNoneAuthorizer();

    const httpApi = new apigateway.HttpApi(this, "TweeterApi", {
      corsPreflight: {
        allowHeaders: ["Authorization"],
        allowMethods: [apigateway.CorsHttpMethod.GET],
        allowOrigins: ["*"],
        maxAge: cdk.Duration.days(10)
      },
      defaultAuthorizer: authorizer
    });

    // GET /users/{alias}
    const getProfileRoute = httpApi.addRoutes({
      path: "/users/{alias}",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("ProfileLambdaIntegration", getProfileLambda)
    });
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
    const getIsFollowingRoute = httpApi.addRoutes({
      path: "/me/following/{alias}",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("IsFollowingLambdaIntegration", getIsFollowingLambda)
    });
    // PUT /me/following/{alias}
    const followUserRoute = httpApi.addRoutes({
      path: "/me/following/{alias}",
      methods: [apigateway.HttpMethod.PUT],
      integration: new HttpLambdaIntegration("FollowUserLambdaIntegration", followLambda)
    });
    // DELETE /me/following/{alias}
    const unfollowUserRoute = httpApi.addRoutes({
      path: "/me/following/{alias}",
      methods: [apigateway.HttpMethod.DELETE],
      integration: new HttpLambdaIntegration("UnfollowUserLambdaIntegration", unfollowLambda)
    });
    // GET /users/{alias}/feed
    const getFeedRoute = httpApi.addRoutes({
      path: "/users/{alias}/feed",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("FeedLambdaIntegration", getFeedLambda)
    });
    // GET /users/{alias}/story
    const getStoryRoute = httpApi.addRoutes({
      path: "/users/{alias}/story",
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration("StoryLambdaIntegration", getStoryLambda)
    });
    // POST /me/statuses
    const postStatusRoute = httpApi.addRoutes({
      path: "/me/statuses",
      methods: [apigateway.HttpMethod.POST],
      integration: new HttpLambdaIntegration("StatusLambdaIntegration", createStatusLambda)
    });

    // POST /auth/login
    const loginRoute = httpApi.addRoutes({
      path: "/auth/login",
      methods: [apigateway.HttpMethod.POST],
      integration: new HttpLambdaIntegration("LoginLambdaIntegration", loginLambda),
      authorizer: noAuthorizer
    });
    // POST /auth/register
    const registerRoute = httpApi.addRoutes({
      path: "/auth/register",
      methods: [apigateway.HttpMethod.POST],
      integration: new HttpLambdaIntegration("RegisterLambdaIntegration", registerLambda),
      authorizer: noAuthorizer
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
