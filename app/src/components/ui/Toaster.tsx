"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      duration={5000}
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!bg-white !text-text !rounded-xl !shadow-neu !ring-1 !ring-brand-100 !border-l-4",
          title: "!font-medium",
          description: "!text-text-light",
          success: "!border-l-[color:var(--color-success)]",
          error: "!border-l-[color:var(--color-error)]",
          info: "!border-l-[color:var(--color-info)]",
          warning: "!border-l-[color:var(--color-warning)]",
          closeButton:
            "!bg-white !text-text-light hover:!text-text !border !border-brand-100",
        },
      }}
    />
  );
}

export default Toaster;
