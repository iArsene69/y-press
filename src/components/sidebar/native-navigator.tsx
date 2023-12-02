import { Home, Settings2, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import Settings from "../settings/settings";
import Trash from "../trash/trash";

type NativeNavProps = {
  myWorkspaceId: string;
  className?: string;
};

export default function NativeNavigation({
  myWorkspaceId,
  className,
}: NativeNavProps) {
  return (
    <nav className={twMerge("my-2", className)}>
      <ul className="flex flex-col gap-2">
        <li>
          <Link
            className="group/native flex text-neutral-400 transition-all gap-2"
            href={`/dashboard/${myWorkspaceId}`}
          >
            <Home className="w-4 h-4" />
            <span>My Workspace</span>
          </Link>
        </li>

        <Settings>
          <li className="group/native flex text-neutral-400 transition-all gap-2 cursor-pointer">
            <Settings2 className="h-4 w-4" />
            <span>Settings</span>
          </li>
        </Settings>

        <Trash>
          <li className="group/native flex text-neutral-400 transition-all gap-2">
            <Trash2 className="h-4 w-4" />
            <span>Trash Bin</span>
          </li>
        </Trash>
      </ul>
    </nav>
  );
}
