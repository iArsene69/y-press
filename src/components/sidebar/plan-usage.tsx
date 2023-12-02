"use client";

import { MAX_FOLDERS_LENGTH } from "@/lib/constants";
import { useAppState } from "@/lib/providers/state-provider";
import { Diamond } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Progress } from "../ui/progress";

type PlanUsageProps = {
  foldersLength: number;
  subscription: Subscription | null;
};

export default function PlanUsage({
  foldersLength,
  subscription,
}: PlanUsageProps) {
  const { workspaceId, state } = useAppState();
  const [usagePercentage, setUsagePercentage] = useState(
    (foldersLength / MAX_FOLDERS_LENGTH) * 100
  );

  useEffect(() => {
    const stateFolderLen = state.workspaces.find((ws) => ws.id === workspaceId)
      ?.folders.length;
    if (stateFolderLen === undefined) return;
    setUsagePercentage((stateFolderLen / MAX_FOLDERS_LENGTH) * 100);
  }, [state, workspaceId]);
  return (
    <article className="mb-4">
      {subscription?.status !== "active" && (
        <div className="flex gap-2 text-muted-foreground mb-2 items-center">
          <Diamond className="w-4 h-4" />
          <div className="flex justify-between w-full items-center">
            <div>Free Plan</div>
            <small>{usagePercentage.toFixed(0)}% / 100%</small>
          </div>
        </div>
      )}
      {subscription?.status !== "active" && (
        <Progress value={usagePercentage} className="h-1" />
      )}
    </article>
  );
}
