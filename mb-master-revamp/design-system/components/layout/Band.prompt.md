Wrap every page section in a Band and alternate the variant. It supplies the shell container, the padding rhythm and the token set.

```jsx
<Band variant="a" grain glow hero>
  <p className="eyebrow">Reading the swell for twenty-five years, in four languages</p>
  <h1>Ranking is one language. <span className="shimmer">Converting is another.</span></h1>
</Band>
<Band variant="b">…</Band>
```

Never set a background on a child of a Band. `grain` and `glow` go on the hero only.
