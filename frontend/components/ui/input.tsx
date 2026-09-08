import { cn } from "@/lib/design-system/cn";
import { inputClassName } from "@/lib/design-system/variants";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ className, hasError = false, ...props }: InputProps) {
  return (
    <input
      className={cn(
        inputClassName,
        hasError && "border-critical focus:border-critical focus:ring-critical",
        className,
      )}
      {...props}
    />
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function Textarea({ className, hasError = false, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        inputClassName,
        "min-h-[120px] resize-y",
        hasError && "border-critical focus:border-critical focus:ring-critical",
        className,
      )}
      {...props}
    />
  );
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function Select({ className, hasError = false, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        inputClassName,
        hasError && "border-critical focus:border-critical focus:ring-critical",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
