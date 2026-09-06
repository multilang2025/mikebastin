The site's action element: filled berry for the one primary action per view, hairline outline for secondary, type only for ghost.

```jsx
<Button variant="primary" size="md">Send the brief</Button>
<Button variant="secondary">See the numbers</Button>
<Button variant="ghost" size="sm">Cancel</Button>
<Button variant="primary" disabled>Sending</Button>
```

One primary per view. Hover darkens to `--berry-deep` rather than lightening; press moves down 1px. Never set a colour on it: the band supplies the palette, so the same button works on Night Swell and Morning Glass.
