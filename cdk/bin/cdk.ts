#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { TweeterServerStack } from "../lib/tweeter-server-stack";

const app = new cdk.App();
new TweeterServerStack(app, "TweeterServerStack", {
  env: { account: "600810015473", region: "us-west-2" }
});
