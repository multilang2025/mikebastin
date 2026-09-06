Four per strip, in a grid whose gap is 1px over a --rule background so the hairlines are the grid.

```jsx
<div style={{ display: "grid", gap: 1, background: "var(--rule)", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
  <StatCell to={25} label="Years in search" />
  <StatCell to={4} suffix="+1" label="Languages spoken" />
</div>
```
