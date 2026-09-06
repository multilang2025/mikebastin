import type { ComponentProps, ReactNode } from "react";

/**
 * Label, control and the two things that hang off it: a hint and an
 * error. The wiring is the point. The label is bound with htmlFor, the
 * hint and error are bound with aria-describedby, and an errored control
 * gets aria-invalid, so a screen reader reads the same three pieces a
 * sighted reader sees rather than an unexplained red border.
 */
export function Field({
  id,
  label,
  hint,
  error,
  required = false,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
        {required && (
          <span className="field-required" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <span className="field-hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {error && (
        <span className="field-error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

/** The describedby value a control inside a Field should carry. */
export function describedBy(id: string, hint?: string, error?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function Input({ className, ...rest }: ComponentProps<"input">) {
  return <input className={["control", className].filter(Boolean).join(" ")} {...rest} />;
}

export function Textarea({ className, ...rest }: ComponentProps<"textarea">) {
  return <textarea className={["control", className].filter(Boolean).join(" ")} {...rest} />;
}

export function Select({ className, children, ...rest }: ComponentProps<"select">) {
  return (
    <select className={["control", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </select>
  );
}

/**
 * The checkbox carries its own label, because a tick box with the label
 * beside it is one control, not a field with a caption above it.
 */
export function Checkbox({
  label,
  className,
  ...rest
}: ComponentProps<"input"> & { label: ReactNode }) {
  return (
    <label className={["check", className].filter(Boolean).join(" ")}>
      <input type="checkbox" {...rest} />
      <span>{label}</span>
    </label>
  );
}
