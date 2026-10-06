## The problem

Clickstream data arrives as a continuous stream of small events. This project builds a fully serverless pipeline on AWS that simulates that stream, lands it, transforms it and makes it queryable, with orchestration and alerting around it.

## Pipeline

```
Lambda (simulate events)
  → Kinesis stream
  → Lambda (read stream, write raw JSON to S3)
  → Step Functions
      → Glue ETL (flatten geo fields, convert timestamps, partition by date)
      → Athena (MSCK REPAIR TABLE)
      → SNS (success / failure)
```

## Services

- **Kinesis** for real-time ingestion
- **Lambda**, twice: one simulates events with `faker`, one reads from Kinesis and writes to S3
- **S3** for the raw and processed zones
- **Glue** for cleaning and date partitioning
- **Athena** to repair partition metadata and query the processed data
- **Step Functions** to orchestrate the run, with **SNS** notifications on success or failure
