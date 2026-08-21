The pain-point question. Name the symptoms so the visitor recognises theirs instead of describing it.

```jsx
<CheckboxGroup
  legend="What is going wrong"
  hint="Pick as many as apply."
  columns={2}
  value={pains}
  onChange={setPains}
  options={[
    { value: "impressions", label: "Impressions without clicks" },
    { value: "one-market", label: "One market ranks, the others do not" },
    { value: "translated", label: "Translated pages that do not convert" },
    { value: "hreflang", label: "Hreflang or duplicate-locale trouble" },
    { value: "thin", label: "Too many thin service pages" },
    { value: "unsure", label: "Not sure yet" },
  ]}
/>
```

Keep an escape option last ("Not sure yet") so nobody stalls on the question.
