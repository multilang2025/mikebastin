/**
 * Renders one or more JSON-LD schema objects as <script type="application/ld+json">
 * tags, so every page adds structured data the same way instead of repeating
 * the dangerouslySetInnerHTML boilerplate. Accepts a single schema object or
 * an array (a page needing several, e.g. Service + BreadcrumbList, passes both
 * in one call rather than rendering this component twice).
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
