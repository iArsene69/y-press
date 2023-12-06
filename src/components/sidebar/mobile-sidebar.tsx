"use client";

import { MenuSquare } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

export default function MobileSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sheet>
      <SheetContent side={"left"}>{children}</SheetContent>
      <nav className="sticky top-0 w-full bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 sm:hidden z-50">
        <ul className="flex justify-startitems-center p-4">
          <SheetTrigger asChild>
            <Button size="icon" variant="outline">
              <MenuSquare />
            </Button>
          </SheetTrigger>
        </ul>
      </nav>
    </Sheet>
  );
}

