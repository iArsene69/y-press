"use client";

import { useAppState } from "@/lib/providers/state-provider";
import React, { useEffect, useState } from "react";
import SelectedWorkspace from "./selected-workspace";
import CustomDialogTrigger from "../global/custom-dialog-trigger";
import WorkspaceCreator from "../global/workspace-creator";
import { Lock, Share, Users2 } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type WsDropdownProps = {
  privateWs: Workspace[] | [];
  collabWs: Workspace[] | [];
  sharedWs: Workspace[] | [];
  defaultValues: Workspace | undefined;
};

export default function WorkspaceDropdown({
  privateWs,
  collabWs,
  sharedWs,
  defaultValues,
}: WsDropdownProps) {
  const { dispatch, state } = useAppState();
  const [selectedOption, setSelectedOption] = useState(defaultValues);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!state.workspaces.length) {
      dispatch({
        type: "SET_WORKSPACES",
        payload: {
          workspaces: [...privateWs, ...sharedWs, ...collabWs].map(
            (workspace) => ({ ...workspace, folders: [] })
          ),
        },
      });
    }
  }, [privateWs, collabWs, sharedWs]);

  const handleSelect = (option: Workspace) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const findSelectedWorkspace = state.workspaces.find(
      (workspace) => workspace.id === defaultValues?.id
    );
    if (findSelectedWorkspace) setSelectedOption(findSelectedWorkspace);
  }, [state, defaultValues]);
  return (
    <div className="relative w-full inline-block text-left">
      <div>
        <span onClick={() => setIsOpen((prev) => !prev)}>
          {selectedOption ? (
            <SelectedWorkspace workspace={selectedOption} />
          ) : (
            "Select Workspace"
          )}
        </span>
      </div>
      {isOpen && (
        <div className="absolute ">
          <ScrollArea className="origin-top-right w-full rounded-md shadow-md z-50 h-[190px] bg-black/10 backdrop-blur-lg group border-[1px] border-muted">
            <div className="rounded-md flex flex-col">
              <div className="!p-2">
                {!!privateWs.length && (
                  <>
                    <div className="flex justify-start items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <p className="text-muted-foreground">Private</p>
                    </div>
                    <hr />
                    {privateWs.map((option) => (
                      <SelectedWorkspace
                        key={option.id}
                        workspace={option}
                        onClick={handleSelect}
                      />
                    ))}
                  </>
                )}
                {!!sharedWs.length && (
                  <>
                    <div className="flex justify-start items-center gap-2">
                      <Share className="w-4 h-4" />
                      <p className="text-muted-foreground">Shared</p>
                    </div>
                    <hr />
                    {sharedWs.map((option) => (
                      <SelectedWorkspace
                        key={option.id}
                        workspace={option}
                        onClick={handleSelect}
                      />
                    ))}
                  </>
                )}
                {!!collabWs.length && (
                  <>
                    <div className="flex justify-start items-center gap-2">
                      <Users2 className="w-4 h-4" />
                      <p className="text-muted-foreground">Collaborating</p>
                    </div>
                    <hr />
                    {collabWs.map((option) => (
                      <SelectedWorkspace
                        key={option.id}
                        workspace={option}
                        onClick={handleSelect}
                      />
                    ))}
                  </>
                )}
              </div>
              <CustomDialogTrigger
                header="Create A Workspace"
                content={<WorkspaceCreator />}
                description="Workspace is workspace dude"
              >
                <div className="flex transition-all hover:bg-muted justify-center items-center gap-2 p-2 w-full">
                  <article className="text-slate-500 rounded-full bg-slate-800 w-4 h-4 flex items-center justify-center">
                    +
                  </article>
                  Create Workspace
                </div>
              </CustomDialogTrigger>
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
