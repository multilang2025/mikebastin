# Website UI kit

`index.html` is a click-through of the shipped site, one screen per template that exists
in the repository today: **Spread** (the portfolio homepage), **Ledger** (`/results/`),
**Service** (the consolidation view and reviews) and **Plain** (`/contact/`, built with the
new form set).

What works: the four screens via the header nav, the theme toggle top-right (it flips the
band mapping exactly as `ThemeToggle` does), the cluster accordion, the review filter,
the impression bars growing on arrival, and the form's email error state on submit.

Copy, figures and screenshots are the real ones from `lib/projects.ts` and the shipped
pages. Journal and Index are not here: no design for them exists in the repository yet, and
inventing one would put a guess in front of a reader who would take it for the design.

The screens are written as token-styled HTML rather than as importable JSX so the kit opens
and runs anywhere with no build step. The components in `components/` are the source of
truth for props and behaviour; the kit mirrors them.
