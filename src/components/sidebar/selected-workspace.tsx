"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Selectedworksapce({
  workspace,
  onClick,
}: {
  workspace: Workspace;
  onClick?: (option: Workspace) => void;
}) {
  const supabase = createClientComponentClient();
  const [wsLogo, setWsLogo] = useState("/img/cypresslogo.svg");
  useEffect(() => {
    if (workspace.logo) {
      const path = supabase.storage
        .from("workspace-logos")
        .getPublicUrl(workspace.logo)?.data.publicUrl;
      setWsLogo(path);
    }
  }, [workspace]);
  return (
    <Link
      href={`/dashboard/${workspace.id}`}
      onClick={() => {
        if (onClick) onClick(workspace);
      }}
      className="flex rounded-md hover:bg-muted transition-all flex-row p-2 gap-2 justify-start cursor-pointer items-center my-2"
    >
      <Image
        src={wsLogo}
        alt="workspace logo"
        width={26}
        height={26}
        className="object-cover"
      />
      <div className="flex flex-col">
        <p className="text-lg w-full overflow-hidden overflow-ellipsis whitespace-nowrap">
          {workspace.title}
        </p>
      </div>
    </Link>
  );
}
