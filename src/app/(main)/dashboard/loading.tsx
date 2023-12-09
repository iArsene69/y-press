import PageLoader from "@/components/global/page-loader";
import React from "react";

export default function Loading() {
  return (
    <div className="w-[100px] h-[100px] absolute top-1/2 left-1/2 m-[-25px_0_0_-25px]">
        <PageLoader />
    </div>
  )
}
