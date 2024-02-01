#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'dotenv/config';
import 'source-map-support/register';
import { CADFeatureDetectionStack } from '../lib/cadFeatureDetectionStack';

const app = new cdk.App();

new CADFeatureDetectionStack(app, 'CADFeatureDetectionStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  }
});