"use client";

import * as React from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = React.useState<{
    left: number;
    width: number;
  } | null>(null);

  React.useEffect(() => {
    const updateIndicator = () => {
      if (!listRef.current) return;

      const activeTab = listRef.current.querySelector(
        "[data-active]",
      ) as HTMLElement;
      if (!activeTab) {
        setIndicatorStyle(null);
        return;
      }

      const listRect = listRef.current.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - listRect.left,
        width: tabRect.width,
      });
    };

    // Initial update
    updateIndicator();

    // Use MutationObserver to watch for active state changes
    const observer = new MutationObserver(updateIndicator);
    if (listRef.current) {
      observer.observe(listRef.current, {
        attributes: true,
        attributeFilter: ["data-active"],
        subtree: true,
      });
    }

    // Update on resize
    window.addEventListener("resize", updateIndicator);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateIndicator);
    };
  }, []);

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      className={cn(
        "relative inline-flex h-10 items-center justify-start gap-1 rounded-4xl bg-muted p-1 text-muted-foreground overflow-x-auto w-full",
        className,
      )}
      {...props}
    >
      {indicatorStyle && (
        <div
          className="absolute top-1 bottom-1 bg-background rounded-3xl shadow-sm transition-all duration-200 ease-out pointer-events-none"
          style={{
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      )}
      {props.children}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-3xl px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[active]:text-foreground z-10",
        className,
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger };
