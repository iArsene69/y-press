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
      <SheetContent side="right">{children}</SheetContent>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed z-50 sm:hidden bottom-8 rounded-full right-4"
          variant="default"
        >
          <MenuSquare />
        </Button>
      </SheetTrigger>
    </Sheet>
  );
}
