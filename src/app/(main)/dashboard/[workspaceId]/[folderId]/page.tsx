import QuillEditor from "@/components/quil-editor/quil-editor";
import { getFolderDetails } from "@/lib/supabase/queries";
import React from "react";

export default async function Folder({
  params,
}: {
  params: { folderId: string };
}) {
  const { data, error } = await getFolderDetails(params.folderId);
  if (error || !data) return;
  return (
    <div className="relative">
      <QuillEditor
        dirType="folder"
        fileId={params.folderId}
        dirDetails={data[0] || {}}
      />
    </div>
  );
}
