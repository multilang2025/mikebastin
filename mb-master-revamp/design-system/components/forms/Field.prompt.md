Every labelled control goes in a Field. Labels are uppercase caps type in --dim, not sentence-case bold.

```jsx
<Field label="Your name" htmlFor="name" required>
  <Input id="name" value={name} onChange={e => setName(e.target.value)} />
</Field>

<Field label="Where the site is losing money" htmlFor="lang" hint="One market is enough to start." error={errors.lang}>
  <Select id="lang" options={MARKETS} value={lang} onChange={...} invalid={!!errors.lang} />
</Field>
```

Passing `error` swaps the hint for the error and turns the control's border berry. Keep the error text a plain instruction, no exclamation.
