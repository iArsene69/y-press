import React from "react";
import Header from "@/components/landing-page/header";

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Header />
       {children}
    </main>
  );
}
