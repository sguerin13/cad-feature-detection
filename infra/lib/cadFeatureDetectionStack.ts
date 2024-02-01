import { Stack } from "aws-cdk-lib";
import * as ApiGateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";
import path = require("path");
import { Construct } from "constructs";
import { CadFeatureDetectionBackendAPI } from "./cadFeatureDetectionBackend";
import { CADFeatureDetectionFrontEnd } from "./cadFeatureDetectionFrontend";
import { error } from "console";
export class CADFeatureDetectionStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    if (!process.env.API_SUBDOMAIN) {
      throw new Error("API_SUBDOMAIN is not defined");
    }

    if (!process.env.APP_NAME) {
      throw new Error("NAME is not defined");
    }
    if (!process.env.DOMAIN) {
      throw new Error("DOMAIN is not defined");
    }

    if (!process.env.FE_SUBDOMAIN) {
      throw new Error("FE_SUBDOMAIN is not defined");
    }

    if (!process.env.FE_BUCKET_NAME) {
      throw new Error("FE_BUCKET_NAME is not defined");
    }


    new CadFeatureDetectionBackendAPI(
      this,
      `${process.env.APP_NAME}BackendAPI`,
      {
        name: process.env.APP_NAME,
        domain: process.env.DOMAIN,
        apiSubDomain: process.env.API_SUBDOMAIN,
      }
    );

    new CADFeatureDetectionFrontEnd(
      this,
      `${process.env.APP_NAME}FrontEnd`,
      {
        s3BucketName: process.env.FE_BUCKET_NAME,
        name: process.env.APP_NAME,
        domain: process.env.DOMAIN,
        subDomain: process.env.FE_SUBDOMAIN,
      }
    );
  }
}
