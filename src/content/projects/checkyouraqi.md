## The problem

Delhi's air is among the worst of any major city, and it swings hard: PM2.5 can triple in a few days when crop-residue burning in Punjab and Haryana meets still winter air. Most public sites show what the air is like **now**. CheckYourAQI forecasts it for each of 70 government monitoring stations 24, 48 and 72 hours ahead, and is upfront about how accurate those forecasts are.

## How it works

- **Ingest:** hourly and daily pulls from OpenAQ (station PM2.5), Open-Meteo (weather and the CAMS air-quality model) and NASA FIRMS (satellite fire detections), orchestrated by Airflow on EC2.
- **Model:** a bronze → silver → gold lakehouse on S3 and Iceberg, built with 27 dbt models on Athena and guarded by 44 data tests.
- **Forecast:** one LightGBM model per horizon predicts every station every hour. Retraining runs weekly on GitHub Actions, and a challenger is promoted only if it beats production on data production has never seen.
- **Serve:** a Streamlit dashboard and a FastAPI read API on Lambda, both reading a small public Parquet snapshot so neither touches AWS credentials.
- **Operate:** Telegram alerts when a task fails or the data source goes down or recovers. The whole thing runs unattended for about $21 a month.

## Results

Walk-forward validation over 14 months (647k training rows). Mean absolute error in µg/m³, lower is better:

| Horizon | LightGBM | Persistence | Same hour, last 7 days | CAMS |
|---|---|---|---|---|
| 24h | **31.4** | 33.6 | 33.2 | 61.6 |
| 48h | **33.8** | 38.5 | 34.1 | 62.6 |
| 72h | 35.2 | 40.0 | **34.9** | 63.4 |

## Design decisions

- **No leakage, enforced by a test.** Features use only data available at prediction time, and a dbt test fails the build if any input post-dates the prediction. The same SQL macro builds training and live features.
- **UTC everywhere, IST only on screen.**
- **Honest about stale data.** Stations and the feed are classified live, delayed, inactive or outage, and forecasts built from stale inputs say so.
