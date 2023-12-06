import { SubscriptionModalProvider } from "@/lib/providers/subscription-modal-provider";
import React from "react";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: string;
}) {
  // TODO: get active product with price and put it into the subs provider
  return (
    <main className="overflow-hidden flex h-[100dvh]">
      <SubscriptionModalProvider>{children}</SubscriptionModalProvider>
    </main>
  );
}
