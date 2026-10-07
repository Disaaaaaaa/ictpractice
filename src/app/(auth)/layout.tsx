import type { ReactNode } from "react";
import { ThemeCycleButton } from "@/components/theme-toggle";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="relative flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeCycleButton />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-fg">CS</span>
          <h1 className="mt-4 text-xl font-semibold">NIS Computer Science</h1>
          <p className="text-sm text-muted">Exam Preparation Platform</p>
        </div>
        {children}
      </div>
    </main>
  );
}
