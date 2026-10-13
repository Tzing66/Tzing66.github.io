## The problem

Large parts of Mesa, Arizona have no bus service at all. This graduate project at Arizona State University (FSE 570) asked where new routes would help most, and what they would do for emissions.

## Method

- **Find the gaps:** joined ACS population data to census tracts in QGIS and overlaid the existing network, which left **63,413 residents** in tracts with no transit.
- **Design routes:** proposed **5 new bus routes with 45 stops** along major arterials, then used 500 m walking buffers intersected with tracts to check who each route actually reaches.
- **Cost it:** brought the city's transportation budget into the same pipeline for preliminary route-expansion and operating cost estimates.
- **Model emissions:** compared diesel and electric buses across 5–15% ridership uptake, two trip lengths and two occupancy levels, using national per-mile emission factors.

## Results

Across all 24 scenarios the routes save **about 8,078 metric tons of CO₂ a year** on average. Electric buses nearly double the benefit at high uptake: roughly 22,800 t a year at 15% uptake, versus 15,400 t for diesel (20 riders per bus, 12-mile trips).

Built with QGIS, Python, GeoPandas, pandas and Matplotlib on public data (ACS, OpenStreetMap, bus ridership records).
