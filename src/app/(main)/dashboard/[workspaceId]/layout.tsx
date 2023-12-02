import Sidebar from "@/components/sidebar/sidebar";
import { SubscriptionModalProvider } from "@/lib/providers/subscription-modal-provider";
import React from "react";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <main className="flex overflow-hidden h-screen w-screen">
      <SubscriptionModalProvider>
        <Sidebar params={params} />
        <div className="dark:border-neutral-50/70 border-l-[1px] w-full relative overflow-scroll">
          {children}
        </div>
      </SubscriptionModalProvider>
    </main>
  );
}
