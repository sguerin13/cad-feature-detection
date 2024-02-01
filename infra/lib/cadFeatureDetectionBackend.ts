import * as cdk from "aws-cdk-lib";
import * as ApiGateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import { ApiGateway as APIGatewayTarget } from "aws-cdk-lib/aws-route53-targets";
import path = require("path");

type BEProps = {
  name: string;
  apiSubDomain: string;
  domain: string;
};

// Rest API
export class CadFeatureDetectionBackendAPI extends Construct {
  constructor(scope: Construct, id: string, props: BEProps) {
    super(scope, id);

    const { apiSubDomain, name, domain } = props;
    const website = apiSubDomain + "." + domain;

    const hostedZone = cdk.aws_route53.HostedZone.fromLookup(
      this,
      "HostedZone",
      {
        domainName: domain,
      }
    );

    // Creating certificate for API Gateway
    const certificate = new cdk.aws_certificatemanager.Certificate(
      this,
      "APIGateWayCertificate",
      {
        domainName: website,
        validation:
          cdk.aws_certificatemanager.CertificateValidation.fromDns(hostedZone),
      }
    );

    const lambdaFunction = new lambda.DockerImageFunction(
      this,
      "Lambda",
      {
        code: lambda.DockerImageCode.fromImageAsset(
          path.resolve(__dirname, "..", "..", "backend")
        ), // Path To the Folder
        timeout: cdk.Duration.seconds(30),
        memorySize: 512,
        // architecture: lambda.Architecture.ARM_64, - if using MAC M1 Chip to build docker image locally
      }
    );

    lambdaFunction.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        actions: ["sagemaker:InvokeEndpoint"],
        resources: [
          `arn:aws:sagemaker:us-east-1:${process.env.CDK_DEFAULT_ACCOUNT}:endpoint/*`,
        ],
      })
    );

    const api = new ApiGateway.LambdaRestApi(this, "RestAPI", {
      handler: lambdaFunction,
      domainName: {
        domainName: website,
        certificate: certificate,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: ApiGateway.Cors.ALL_ORIGINS,
        allowMethods: ApiGateway.Cors.ALL_METHODS, // this is also the default
      },
    });

    const record = new route53.ARecord(this, "APIAliasRecord", {
      zone: hostedZone,
      recordName: website,
      target: route53.RecordTarget.fromAlias(new APIGatewayTarget(api)),
    });
  }
}
