#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { TweeterServerStack } from "../lib/tweeter-server-stack";
import path from "path";

const app = new cdk.App();

const projectRoot = path.join(__dirname, "../..");

new TweeterServerStack(app, "TweeterServerStack", {
  env: { account: "600810015473", region: "us-west-2" },
  projectRoot
});
