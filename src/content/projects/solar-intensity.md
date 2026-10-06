## The problem

Predict solar power generation in Phoenix, Arizona from weather data, and see whether automated feature selection actually beats using every feature.

## Data

- Daily weather (temperature, humidity, wind, solar radiation) from the **NASA POWER API**.
- Hours of daylight for the location, computed with **pvlib**.
- Solar plant power output (MW) records from **NREL**.

## Modelling

Three regression approaches, compared at the end of the notebook:

1. Linear regression on all features
2. Linear regression after **recursive feature elimination with cross-validation (RFECV)**
3. Polynomial regression on the RFECV-selected features
