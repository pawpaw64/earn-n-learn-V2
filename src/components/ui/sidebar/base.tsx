import * as React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useSidebar } from "./context";

// Define the missing constant
const SIDEBAR_WIDTH_MOBILE = "18rem";
const Sidebar = React.forwardRef<HTMLDivElement, React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}>(({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}, ref) => {
  const {
    isMobile,
    state,
    openMobile,
    setOpenMobile
  } = useSidebar();
  if (collapsible === "none") {
    return <div className={cn("flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground", className)} ref={ref} {...props}>
          {children}
        </div>;
  }
  if (isMobile) {
    return <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent data-sidebar="sidebar" data-mobile="true" className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden" style={{
        "--sidebar-width": SIDEBAR_WIDTH_MOBILE
      } as React.CSSProperties} side={side}>
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>;
  }
  return <div ref={ref} className="group peer hidden md:block text-sidebar-foreground" data-state={state} data-collapsible={state === "collapsed" ? collapsible : ""} data-variant={variant} data-side={side}>
        <div className={cn("duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]")} />
        <div className={cn("duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l", className)} {...props}>
          <div data-sidebar="sidebar" className="flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow mx-0 bg-green-50">
            {children}
          </div>
        </div>
      </div>;
});
Sidebar.displayName = "Sidebar";
const SidebarContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({
  className,
  ...props
}, ref) => {
  return <div ref={ref} data-sidebar="content" className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className)} {...props} />;
});
SidebarContent.displayName = "SidebarContent";
const SidebarHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({
  className,
  ...props
}, ref) => {
  return <div ref={ref} data-sidebar="header" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
});
SidebarHeader.displayName = "SidebarHeader";
const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(({
  className,
  ...props
}, ref) => {
  return <div ref={ref} data-sidebar="footer" className={cn("flex flex-col gap-2 p-2", className)} {...props} />;
});
SidebarFooter.displayName = "SidebarFooter";
const SidebarInset = React.forwardRef<HTMLDivElement, React.ComponentProps<"main">>(({
  className,
  ...props
}, ref) => {
  return <main ref={ref} className={cn("relative flex min-h-svh flex-1 flex-col bg-background", "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className)} {...props} />;
});
SidebarInset.displayName = "SidebarInset";
export { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset };