Single consent or opt-in box, and the unit CheckboxGroup repeats.

```jsx
<Checkbox id="consent" checked={ok} onChange={e => setOk(e.target.checked)}
  label="Send me the reply by email" hint="Nothing else, and no list." />
```
