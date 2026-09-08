import { cn } from "@/lib/design-system/cn";
import { hintClassName, labelClassName } from "@/lib/design-system/variants";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <label className={cn(labelClassName, className)} {...props}>
      {children}
      {required ? <span className="text-critical"> *</span> : null}
    </label>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="mt-1.5">{children}</div>
      {hint && !error ? <p className={hintClassName}>{hint}</p> : null}
      {error ? (
        <p className="mt-1.5 text-sm text-critical" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export { hintClassName, labelClassName };
