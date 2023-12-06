import MobileSidebar from "@/components/sidebar/mobile-sidebar";
import Sidebar from "@/components/sidebar/sidebar";
import React from "react";

export default function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <>
      <main className="flex flex-col sm:flex-row overflow-hidden h-screen w-screen">
        <MobileSidebar>
          <Sidebar
            params={params}
            className="w-auto inline-block sm:hidden"
          />
        </MobileSidebar>
        <Sidebar params={params} />
        <div className="dark:border-neutral-50/70 border-none sm:border-l-[1px] w-full relative overflow-scroll">
          {children}
        </div>
      </main>
    </>
  );
}
