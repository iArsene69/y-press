import QuillEditor from "@/components/quil-editor/quil-editor";
import { getWorkspaceDetails } from "@/lib/supabase/queries";
import React from "react";

export default async function WorkspaceDashboard({
  params,
}: {
  params: { workspaceId: string };
}) {
  const { data, error } = await getWorkspaceDetails(params.workspaceId);
  if (error || !data) return;
  return (
    <div className="relative">
      <QuillEditor
        dirType="workspace"
        fileId={params.workspaceId}
        dirDetails={data[0] || {}}
      />
    </div>
  );
}
