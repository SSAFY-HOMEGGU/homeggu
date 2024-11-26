// src/components/ui/toast.js
"use client";

import React from "react";
import { cn } from "@/lib/utils";

const Toast = ({ className, variant = "default", ...props }) => {
  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variant === "destructive" && "border-red-200 bg-red-50 text-red-900",
        variant === "success" && "border-green-200 bg-green-50 text-green-900",
        className
      )}
      {...props}
    />
  );
};

const ToastTitle = ({ className, ...props }) => {
  return <div className={cn("text-sm font-semibold", className)} {...props} />;
};

const ToastDescription = ({ className, ...props }) => {
  return <div className={cn("text-sm opacity-90", className)} {...props} />;
};

// Toaster 컴포넌트도 같은 파일에 포함
export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant}>
          {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
          {toast.description && (
            <ToastDescription>{toast.description}</ToastDescription>
          )}
        </Toast>
      ))}
    </div>
  );
}

export { Toast, ToastTitle, ToastDescription };
