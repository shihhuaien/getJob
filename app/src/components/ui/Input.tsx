import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseFieldProps = {
  label?: string;
  hint?: string;
  error?: string;
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & BaseFieldProps;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  BaseFieldProps;

const fieldBase =
  "w-full rounded-xl bg-[var(--color-bg)] px-4 py-2.5 text-sm text-text placeholder:text-text-placeholder shadow-neu-inset transition-shadow duration-fast ease-out focus:outline-none focus:shadow-neu-pressed focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] disabled:opacity-50 disabled:cursor-not-allowed";
const fieldError = "ring-1 ring-error focus:ring-error";

function Label({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-text"
    >
      {children}
    </label>
  );
}

function Helper({ hint, error }: { hint?: string; error?: string }) {
  if (error)
    return <p className="mt-1.5 text-xs text-error">{error}</p>;
  if (hint)
    return <p className="mt-1.5 text-xs text-text-light">{hint}</p>;
  return null;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, id, className = "", ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const classes = [fieldBase, error ? fieldError : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="w-full">
        {label ? <Label htmlFor={inputId}>{label}</Label> : null}
        <input ref={ref} id={inputId} className={classes} {...rest} />
        <Helper hint={hint} error={error} />
      </div>
    );
  },
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, hint, error, id, className = "", rows = 4, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const classes = [fieldBase, error ? fieldError : "", className]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="w-full">
        {label ? <Label htmlFor={inputId}>{label}</Label> : null}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={classes}
          {...rest}
        />
        <Helper hint={hint} error={error} />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Input;
