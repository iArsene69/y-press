import { SubscriptionModalProvider } from "@/lib/providers/subscription-modal-provider";
import { getActiveProductWithPrice } from "@/lib/supabase/queries";
import React, { Suspense } from "react";
import Loading from "./loading";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params?: string;
}) {
  // const { data: products, error } = await getActiveProductWithPrice();
  // if (error) {
  //   throw new Error()
  // }
  return (
    <main className="overflow-hidden flex h-[100dvh]">
      <SubscriptionModalProvider>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </SubscriptionModalProvider>
    </main>
  );
}
