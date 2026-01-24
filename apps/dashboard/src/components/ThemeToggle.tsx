"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";

export function ThemeToggle({
  className,
  stopPropagation,
}: {
  className?: string;
  stopPropagation?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <button
        className={cn(
          "p-2 rounded-md hover:bg-sidebar-accent cursor-pointer",
          className,
        )}
        aria-label="Toggle theme"
      >
        <HugeiconsIcon icon={Sun02Icon} strokeWidth={2} size={18} />
      </button>
    );
  }

  return (
    <button
      className={cn(
        "p-2 rounded-md hover:bg-sidebar-accent cursor-pointer",
        className,
      )}
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      onClick={toggleTheme}
    >
      <HugeiconsIcon
        icon={theme === "dark" ? Sun02Icon : Moon02Icon}
        strokeWidth={2}
        size={18}
      />
    </button>
  );
}
