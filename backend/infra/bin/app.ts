#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { EnvironmentalJobAlertStack } from '../lib/environmental-job-alert-stack'

dotenv.config({ path: path.resolve(__dirname, '../env/.env') })

const app = new cdk.App()

new EnvironmentalJobAlertStack(app, 'EnvironmentalJobAlertStack', {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_DEFAULT_REGION ?? 'us-east-1',
  },
})
