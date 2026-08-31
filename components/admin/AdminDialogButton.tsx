import { forwardRef } from "react";

type DialogButtonVariant = "primary" | "secondary" | "danger" | "icon";

interface AdminDialogButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DialogButtonVariant;
}

const baseClass =
  "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55 dark:focus-visible:ring-offset-zinc-900";

const variantClasses: Record<DialogButtonVariant, string> = {
  primary:
    "border border-indigo-600 bg-indigo-600 text-white hover:border-indigo-500 hover:bg-indigo-500 active:bg-indigo-700",
  secondary:
    "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 active:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:active:bg-zinc-600",
  danger:
    "border border-red-600 bg-red-600 text-white hover:border-red-500 hover:bg-red-500 active:bg-red-700",
  icon:
    "size-10 min-h-10 border border-transparent bg-transparent p-0 text-zinc-600 shadow-none hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white",
};

const AdminDialogButton = forwardRef<
  HTMLButtonElement,
  AdminDialogButtonProps
>(function AdminDialogButton(
  { variant = "primary", className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${baseClass} ${variantClasses[variant]} ${className ?? ""}`}
      {...props}
    />
  );
});

export default AdminDialogButton;
