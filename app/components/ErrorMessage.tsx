import type { ReactNode, HTMLAttributes } from "react";

export default function ErrorMessage({
  children,
  ...rest
}: { children: ReactNode } & HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className="form-validation-error" role="alert" {...rest}>
      {children}
    </p>
  );
}
