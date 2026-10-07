"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLinks } from "./nav-links";
import type { NavGroup } from "./nav";

export function MobileNav({ groups, brand }: { groups: NavGroup[]; brand: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-2 lg:hidden"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-surface p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              {brand}
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-2"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks groups={groups} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
