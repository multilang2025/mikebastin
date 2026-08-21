The site's only entrance animation. Wrap the eyebrow, the heading and the lede as separate Reveals with i=0,1,2 so they arrive in reading order.

```jsx
<Reveal><p className="eyebrow">Results, not impressions</p></Reveal>
<Reveal i={1}><h1>What actually happened, with the numbers attached</h1></Reveal>
```

Fires once. Under prefers-reduced-motion the content renders in place with no transition.
