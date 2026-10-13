## The problem

Predict how much power a solar plant in Phoenix, Arizona generates each day from the weather alone, and see whether automated feature selection beats simply using every feature.

## Data

- Daily weather (temperature, humidity, wind, solar radiation) for 2006 from the **NASA POWER API**.
- Hours of daylight for the site, computed with **pvlib**.
- Five-minute plant output from **NREL**, summed per day as the target.

## Modelling

Three regression models, evaluated on the same 10% hold-out (37 days):

| Model | R² | Avg. error |
|---|---|---|
| Linear regression, all features | **0.825** | **9.3%** |
| Polynomial (degree 2) | 0.750 | 12.8% |
| Linear after RFECV feature selection | 0.702 | 15.8% |

Feature selection made things *worse* here: with only five weather features there was little noise to remove, and dropping any of them cost signal. A random-forest importance check agreed: solar radiation carries most of the signal (≈0.74), with daylight hours a distant second (≈0.12).
