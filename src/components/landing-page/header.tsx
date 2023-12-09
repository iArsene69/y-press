"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import BrandLogo from "./brand-logo";

const routes = [
  {
    title: "Resources",
    href: "#resources",
    components: [
      {
        title: "Alert Dialog",
        href: "#",
        description:
          "A modal dialog that interrupts the user with important content and expects a response.",
      },
      {
        title: "Hover Card",
        href: "#",
        description:
          "For sighted users to preview content available behind a link.",
      },
    ],
  },
  {
    title: "Pricing",
    href: "#pricing",
    components: [
      {
        title: "Progress",
        href: "#",
        description:
          "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
      },
      {
        title: "Scroll-area",
        href: "#",
        description: "Visually or semantically separates content.",
      },
    ],
  },
  {
    title: "Testimonials",
    href: "#testimonial",
    components: [
      {
        title: "Tabs",
        href: "#",
        description:
          "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
      },
      {
        title: "Tooltip",
        href: "#",
        description:
          "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
      },
    ],
  },
];

export default function Header() {
  const [path, setPath] = useState("");
  return (
    <header className="p-4 flex justify-center items-center sticky z-50 top-0 backdrop-blur-2xl bg-primary/30 border border-b-primary dark:bg-background/30">
      <Link href={"/"} className="w-full flex gap-2 justify-start items-center">
       <BrandLogo />
        <span className="font-semibold dark:text-white">YpresS</span>
      </Link>
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList>
          {routes.map((route, idx) => (
            <NavigationMenuItem key={idx}>
              <NavigationMenuTrigger
                onClick={() => setPath(route.href)}
                className={cn({
                  "dark:text-white": path === route.href,
                  "dark:text-white/40": path !== route.href,
                  "font-normal": true,
                  "text-lg": true,
                })}
              >
                {route.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px]  gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {route.components.map((component, idx) => (
                    <ListItem
                      key={idx}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <aside className="flex w-full gap-2 justify-end">
        <Link href={"/login"}>
          <Button variant="outline" className="border-primary border">
            Login
          </Button>
        </Link>
        <Link href={"/signup"}>
          <Button variant="default">Sign up</Button>
        </Link>
      </aside>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "group block select-none space-y-1 font-medium leading-none"
          )}
          {...props}
        >
          <div className="text-white text-sm font-medium leading-none">
            {title}
          </div>
          <p className="group-hover:text-white/70 line-clamp-2 text-sm leading-snug text-white/40">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
