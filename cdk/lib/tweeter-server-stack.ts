import * as cdk from "aws-cdk-lib/core";
import { Construct } from "constructs";
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class TweeterServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getFolloweesLambda = new NodejsFunction(this, "GetFollowees", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../../tweeter-server/src/lambda/follow/GetFollowees.ts"),
      handler: "handler",
      architecture: Architecture.ARM_64
    });

    const gateway = new apigateway.RestApi(this, "TweeterApi");

    const followees = gateway.root.addResource("followees");
    followees.addMethod("POST", new apigateway.LambdaIntegration(getFolloweesLambda));
  }
}
