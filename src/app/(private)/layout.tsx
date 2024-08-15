"use client";

import * as React from "react";
import { getUser } from "@/api";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { Car, CirclePlus, House, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Sheet, SheetContent, SheetTitle } from "@/components/sheet";
import { Skeleton } from "@/components/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/cn";

function NavigationItem({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: React.ReactNode;
  icon: React.ElementType;
}) {
  const pathname = usePathname();
  const match = pathname === to;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* Note: NavLink does not work with asChild */}
        <Link
          href={to}
          className={cn(
            "rounded-lg p-2",
            match ? "bg-primary hover:bg-primary/90" : "hover:bg-accent",
          )}
        >
          <Icon className={cn("size-6", match && "text-primary-foreground")} />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function Navigation() {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[72px] border-r bg-background sm:block">
      <TooltipProvider>
        <nav className="flex flex-col gap-4 p-4">
          <NavigationItem to="/" icon={House} label="Home" />
          <NavigationItem to="/vehicles" icon={Car} label="Vehicles" />
          <NavigationItem to="/add" icon={CirclePlus} label="Add Vehicle" />
        </nav>
      </TooltipProvider>
    </aside>
  );
}

function MobileNavigationItem(props: {
  to: string;
  onClick: () => void;
  icon: React.ElementType;
  label: React.ReactNode;
}) {
  const pathname = usePathname();

  const Icon = props.icon;
  const match = props.to === pathname;

  return (
    <Link
      href={props.to}
      className={cn(
        "flex items-center gap-4 rounded-lg p-2",
        match ? "bg-primary hover:bg-primary/90" : "hover:bg-accent",
      )}
      onClick={props.onClick}
    >
      <Icon className={cn("size-6", match && "text-primary-foreground")} />
      <span className={cn("text-base", match && "text-primary-foreground")}>
        {props.label}
      </span>
    </Link>
  );
}

function MobileNavigation(props: { open: boolean; onOpenChange: () => void }) {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent
        className="max-w-72"
        side="left"
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <nav className="mr-6 flex flex-col gap-4">
          <MobileNavigationItem
            to="/"
            onClick={props.onOpenChange}
            icon={House}
            label="Home"
          />
          <MobileNavigationItem
            to="/vehicles"
            onClick={props.onOpenChange}
            icon={Car}
            label="Vehicles"
          />
          <MobileNavigationItem
            to="/add"
            onClick={props.onOpenChange}
            icon={CirclePlus}
            label="Add"
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default function PrivateLayout(props: { children: React.ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const userQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => getUser(),
    staleTime: Infinity,
  });

  return (
    <>
      <Navigation />

      <MobileNavigation
        open={isSheetOpen}
        onOpenChange={() => setIsSheetOpen(false)}
      />

      <div className="flex w-full flex-col sm:pl-[72px]">
        <header className="sticky top-0 z-50 bg-transparent backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2">
            <Button
              variant="outline"
              size="icon"
              className="flex sm:hidden"
              onClick={() => setIsSheetOpen(true)}
            >
              <Menu />
            </Button>

            <h1 className="grow text-lg font-medium">Vehicle Manager</h1>

            <ModeToggle />

            <>
              {userQuery.isLoading && (
                <Skeleton className="size-10 rounded-full" />
              )}
              {userQuery.isSuccess && <UserAvatar user={userQuery.data} />}
            </>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-7xl flex-col p-4">
          {props.children}
        </main>
      </div>
    </>
  );
}
