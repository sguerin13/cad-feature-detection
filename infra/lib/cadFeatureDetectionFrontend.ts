import * as cdk from "aws-cdk-lib";
import {
  CloudFrontWebDistribution,
  OriginAccessIdentity,
  ViewerCertificate,
} from "aws-cdk-lib/aws-cloudfront";
import { ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import { BucketDeployment } from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import path = require("path");


type FEProps = {
  name: string;
  subDomain: string;
  domain: string;
  s3BucketName: string;
};
export class CADFeatureDetectionFrontEnd extends Construct {
  constructor(scope: Construct, id: string, props: FEProps) {
    super(scope, id);

    const { name, subDomain, domain, s3BucketName } = props;
    const website = subDomain + "." + domain;

    const hostedZone = cdk.aws_route53.HostedZone.fromLookup(
      this,
      "HostedZone",
      {
        domainName: domain,
      }
    );

    // We can create a certificate or use an existing one, we'll create one on the fly
    const certificate = new cdk.aws_certificatemanager.Certificate(
      this,
      "Certificate",
      {
        domainName: website,
        validation:
          cdk.aws_certificatemanager.CertificateValidation.fromDns(hostedZone),
      }
    );

    // Create S3 Bucket for Website
    const bucket = new s3.Bucket(this, "Bucket", {
      bucketName: s3BucketName,
      publicReadAccess: false, // cloudfront will access the bucket,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      accessControl: s3.BucketAccessControl.PRIVATE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create the bucket deployment
    new BucketDeployment(this, "BucketDeployment", {
      destinationBucket: bucket,
      sources: [cdk.aws_s3_deployment.Source.asset(path.resolve(__dirname, "..", "..", "frontend", "build"))],
    });

    // Create access id for the bucket
    const accessId = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity",
    );
    bucket.grantRead(accessId);

    // create the viewer certificate for cloudfront
    const viewerCertificate = ViewerCertificate.fromAcmCertificate(
      certificate,
      {
        aliases: [website], // This is the domain name we want to use for serving content from cloudfront
      }
    );

    // Create CloudFront distribution
    const distro = new CloudFrontWebDistribution(
      this,
      "CloudFrontDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: accessId,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        viewerCertificate, // Certificate and links Cloudfront to domain url
        errorConfigurations: [
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: "/index.html",
          },
        ],
      }
    );

    // Create Route53 Alias record for CloudFront - pointing domain to cloudfront
    new ARecord(this, "AliasRecord", {
      zone: hostedZone,
      recordName: website,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distro)),
    });
  }
}
