"use client";

import * as React from "react";

const ScrollArea = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        {...props}
      >
        <div className="h-full w-full overflow-y-auto overflow-x-hidden scrollbar scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          {children}
        </div>
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

const ScrollBar = React.forwardRef(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <div
      ref={ref}
      className={`
      flex select-none touch-none
      ${
        orientation === "vertical"
          ? "h-full w-2.5 border-l border-l-transparent p-[1px]"
          : ""
      }
      ${
        orientation === "horizontal"
          ? "h-2.5 border-t border-t-transparent p-[1px]"
          : ""
      }
      ${className}
    `}
      {...props}
    >
      <div className="relative flex-1 rounded-full bg-gray-200" />
    </div>
  )
);

ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
