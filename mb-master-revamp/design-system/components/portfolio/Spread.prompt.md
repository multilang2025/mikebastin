The homepage's main unit and the most designed surface on the site. Eight of them, numbered I to VIII, flipping alternately.

```jsx
{PROJECTS.map((p, i) => <Spread key={p.slug} project={p} flip={i % 2 === 1} />)}
```

Metrics are two per spread, never more. Where no screenshot exists, leave `shot` undefined and the gradient plate carries the domain name rather than a wrong image.
