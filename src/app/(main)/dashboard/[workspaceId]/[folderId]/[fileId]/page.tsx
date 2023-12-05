import QuillEditor from "@/components/quil-editor/quil-editor";
import { getFileDetails } from "@/lib/supabase/queries";
import React from "react";

export default async function FilePage({
  params,
}: {
  params: { fileId: string };
}) {
  const { data, error } = await getFileDetails(params.fileId);
  if (error || !data) return;
  return (
    <div className="relative">
      <QuillEditor
        dirType="file"
        fileId={params.fileId}
        dirDetails={data[0] || {}}
      />
    </div>
  );
}
