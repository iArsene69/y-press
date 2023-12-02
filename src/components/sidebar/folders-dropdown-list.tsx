"use client";

import { useAppState } from "@/lib/providers/state-provider";
import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { toast } from "../ui/use-toast";
import { PlusIcon } from "lucide-react";
import { Accordion } from "../ui/accordion";
import { createFolder } from "@/lib/supabase/queries";
import TooltipComponent from "../global/tooltip-component";
import Dropdown from "./dropdown";

type FoldersDropdownListProps = {
  workspaceFolders: Folder[];
  workspaceId: string;
};

export default function FoldersDropdownList({
  workspaceFolders,
  workspaceId,
}: FoldersDropdownListProps) {
  //add realtime

  const { state, dispatch, folderId } = useAppState();
  const { open, setOpen } = useSubscriptionModal();
  const [folders, setFolders] = useState(workspaceFolders);
  const { subscription } = useSupabaseUser();

  useEffect(() => {
    if (workspaceFolders.length > 0) {
      dispatch({
        type: "SET_FOLDERS",
        payload: {
          workspaceId,
          folders: workspaceFolders.map((folder) => ({
            ...folder,
            files:
              state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((f) => f.id === folder.id)?.files || [],
          })),
        },
      });
    }
  }, [workspaceFolders, workspaceId]);

  useEffect(() => {
    setFolders(
      state.workspaces.find((workspace) => workspace.id === workspaceId)
        ?.folders || []
    );
  }, [state]);

  const addFolderHandler = async () => {
    if (folders.length >= 3 && !subscription) {
      setOpen(true);
      return;
    }
    const newFolder: Folder = {
      data: null,
      id: v4(),
      createdAt: new Date().toISOString(),
      title: "untitled",
      iconId: "📁",
      inTrash: null,
      workspaceId,
      bannerUrl: "",
    };
    dispatch({
      type: "ADD_FOLDER",
      payload: { workspaceId, folder: { ...newFolder, files: [] } },
    });
    const { data, error } = await createFolder(newFolder);
    if (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Unable to create the folder",
      });
    } else {
      toast({
        title: "Success",
        description: "Folder created successfully",
      });
    }
  };

  return (
    <>
      <div className="flex sticky z-20 top-0 bg-background group w-full h-10 group justify-between items-center pr-4 text-neutral-400">
        <span className="text-neutral-500 font-bold text-xs uppercase">
          folders
        </span>
        <TooltipComponent message="Create Folder">
          <PlusIcon
            onClick={addFolderHandler}
            size={16}
            className="group-hover:block hidden cursor-pointer hover:dark:text-white"
          />
        </TooltipComponent>
      </div>
      <Accordion
        type="multiple"
        defaultValue={[folderId || ""]}
        className="pb-20"
      >
        {folders
          .filter((folder) => !folder.inTrash)
          .map((folder) => (
            <Dropdown
              key={folder.id}
              title={folder.title}
              listType="folder"
              id={folder.id}
              iconId={folder.iconId}
            />
          ))}
      </Accordion>
    </>
  );
}
