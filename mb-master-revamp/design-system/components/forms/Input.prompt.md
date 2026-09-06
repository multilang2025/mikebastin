Text, email and tel inputs. Always inside a Field.

```jsx
<Input id="email" type="email" placeholder="you@company.com" value={v} onChange={...} />
<Input id="email" invalid value={v} onChange={...} />
```

Focus shows both the berry border and the global 2px focus ring; do not suppress either.
