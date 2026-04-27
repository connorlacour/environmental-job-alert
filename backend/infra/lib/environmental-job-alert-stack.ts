import * as path from 'path'
import * as cdk from 'aws-cdk-lib'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import * as events from 'aws-cdk-lib/aws-events'
import * as targets from 'aws-cdk-lib/aws-events-targets'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as lambdaNodejs from 'aws-cdk-lib/aws-lambda-nodejs'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { Construct } from 'constructs'

export class EnvironmentalJobAlertStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // ── S3 ───────────────────────────────────────────────────────────────
    const bucket = new s3.Bucket(this, 'Bucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    })

    // ── Lambda ───────────────────────────────────────────────────────────
    // VAPID keys are read from env at synth time and stored as Lambda env vars.
    // For stricter security, move them to Secrets Manager and use
    // secretsmanager.Secret.fromSecretNameV2() to reference them here.
    const handler = new lambdaNodejs.NodejsFunction(this, 'Handler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: path.join(__dirname, '../../lambda/index.js'),
      handler: 'handler',
      timeout: cdk.Duration.seconds(30),
      logGroup: new logs.LogGroup(this, 'HandlerLogs', {
        retention: logs.RetentionDays.ONE_MONTH,
      }),
      environment: {
        S3_BUCKET: bucket.bucketName,
        VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY ?? '',
        VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY ?? '',
        VAPID_EMAIL: process.env.VAPID_EMAIL ?? '',
      },
      bundling: {
        minify: true,
        forceDockerBundling: false,
        format: lambdaNodejs.OutputFormat.ESM,
        externalModules: ['@aws-sdk/*'],
        // web-push is bundled by esbuild — run `pnpm install` in lambda/ first
      },
    })

    bucket.grantReadWrite(handler)

    // ── REST API ─────────────────────────────────────────────────────────
    // proxy: true routes all paths/methods to the Lambda, which handles
    // its own routing and CORS headers internally.
    const api = new apigw.LambdaRestApi(this, 'Api', {
      handler,
      proxy: true,
      restApiName: 'environmental-job-alert',
      deployOptions: { stageName: 'prod' },
    })

    // ── EventBridge daily scrape ──────────────────────────────────────────
    new events.Rule(this, 'DailyScrape', {
      schedule: events.Schedule.cron({ hour: '8', minute: '0' }),
      targets: [new targets.LambdaFunction(handler)],
    })

    // ── Outputs ───────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url.replace(/\/$/, ''),
      description: 'Set as VITE_API_URL in root .env',
    })
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
    })
  }
}
