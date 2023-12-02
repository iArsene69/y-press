import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="h-screen p-6 flex justify-center">{children}</div>;
}
