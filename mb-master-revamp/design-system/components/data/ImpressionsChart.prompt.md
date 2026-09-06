Search Console data on the Ledger template. Bars, not a line chart: the comparison is between URLs, not over time.

```jsx
<ImpressionsChart />
<ImpressionsChart data={rows} legend={[{ tone: "berry", label: "Kept" }]} note="…" />
```

Two tones only. `moves: true` paints a row silver, which is how a page marked for migration is shown. Never add a third colour to carry a third meaning: split the chart instead.
