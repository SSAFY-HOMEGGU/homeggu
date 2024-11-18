"use client";

import { useToast } from "./use-toast";
import { Toast, ToastTitle, ToastDescription } from "./toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 w-full max-w-md p-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          className={
            toast.variant === "destructive" ? "bg-red-100" : "bg-green-100"
          }
        >
          {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
          {toast.description && (
            <ToastDescription>{toast.description}</ToastDescription>
          )}
        </Toast>
      ))}
    </div>
  );
}
// export { Toaster };
