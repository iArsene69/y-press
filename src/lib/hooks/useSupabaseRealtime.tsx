"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect } from "react";
import { useAppState } from "../providers/state-provider";
import { useRouter } from "next/navigation";

export default function useSupabaseRealtime() {
  const supabase = createClientComponentClient();
  const { dispatch, state, workspaceId: selectedWorkspace } = useAppState();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "files" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            console.log("🟢 Received RT event");
            const {
              folder_id: folderId,
              workspace_id: workspaceId,
              id: fileId,
            } = payload.new;
            if (
              !state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((folder) => folder.id === folderId)
                ?.files.find((file) => file.id === fileId)
            ) {
              const newFile: FileType = {
                id: payload.new.id,
                workspaceId: payload.new.workspace_id,
                folderId: payload.new.folder_id,
                createdAt: payload.new.created_at,
                title: payload.new.title,
                iconId: payload.new.icon_id,
                data: payload.new.data,
                inTrash: payload.new.in_trash,
                bannerUrl: payload.new.banner_url,
              };
              dispatch({
                type: "ADD_FILE",
                payload: { file: newFile, folderId, workspaceId },
              });
            }
          } else if (payload.eventType === "DELETE") {
            let workspaceId = "";
            let folderId = "";
            const fileExist = state.workspaces.some((workspace) =>
              workspace.folders.some((folder) =>
                folder.files.some((file) => {
                  if (file.id === payload.old.id) {
                    workspaceId = workspace.id;
                    folderId = folder.id;
                    return true;
                  }
                })
              )
            );
            if (fileExist && workspaceId && folderId) {
              router.replace(`/dashboard/${workspaceId}`);
              dispatch({
                type: "DELETE_FILE",
                payload: { fileId: payload.old.id, folderId, workspaceId },
              });
            }
          } else if (payload.eventType === "UPDATE") {
            const { folder_id: folderId, workspace_id: workspaceId } =
              payload.new;

            state.workspaces.some((workspace) =>
              workspace.folders.some((folder) =>
                folder.files.some((file) => {
                  if (file.id === payload.new.id) {
                    dispatch({
                      type: "UPDATE_FILE",
                      payload: {
                        workspaceId,
                        folderId,
                        fileId: payload.new.id,
                        file: {
                          title: payload.new.title,
                          iconId: payload.new.icon_id,
                          inTrash: payload.new.in_trash,
                          bannerUrl: payload.new.banner_url,
                        },
                      },
                    });
                    return true;
                  }
                })
              )
            );
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "folders" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            console.log("🟢 Received RT event");
            const { workspace_id: workspaceId, id: folderId } = payload.new;
            if (
              !state.workspaces
                .find((workspace) => workspace.id === workspaceId)
                ?.folders.find((folder) => folder.id === folderId)
            ) {
              const newFolder: appFoldersType = {
                id: payload.new.id,
                workspaceId: payload.new.workspace_id,
                createdAt: payload.new.created_at,
                title: payload.new.title,
                iconId: payload.new.icon_id,
                data: payload.new.data,
                inTrash: payload.new.in_trash,
                files: [],
                bannerUrl: payload.new.banner_url,
              };
              dispatch({
                type: "ADD_FOLDER",
                payload: { workspaceId, folder: newFolder },
              });
            }
          } else if (payload.eventType === "DELETE") {
            let workspaceId = "";
            const fileExist = state.workspaces.some((workspace) =>
              workspace.folders.some((folder) => {
                if (folder.id === payload.old.id) {
                  workspaceId = workspace.id;
                  return true;
                }
              })
            );
            if (fileExist && workspaceId) {
              router.replace(`/dashboard/${workspaceId}`);
              dispatch({
                type: "DELETE_FOLDER",
                payload: { folderId: payload.old.id, workspaceId },
              });
            }
          } else if (payload.eventType === "UPDATE") {
            const { workspace_id: workspaceId } = payload.new;

            state.workspaces.some((workspace) =>
              workspace.folders.some((folder) => {
                if (folder.id === payload.new.id) {
                  dispatch({
                    type: "UPDATE_FOLDER",
                    payload: {
                      workspaceId,
                      folderId: payload.new.id,
                      folder: {
                        title: payload.new.title,
                        iconId: payload.new.icon_id,
                        inTrash: payload.new.in_trash,
                        bannerUrl: payload.new.banner_url,
                      },
                    },
                  });
                  return true;
                }
              })
            );
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workspaces" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            console.log("🟢 Received RT event");
            const { id: workspaceId } = payload.new;
            if (
              !state.workspaces.find(
                (workspace) => workspace.id === workspaceId
              )
            ) {
              const newWorkspace: appWorkspacesType = {
                id: payload.new.id,
                createdAt: payload.new.created_at,
                title: payload.new.title,
                iconId: payload.new.icon_id,
                data: payload.new.data,
                inTrash: payload.new.in_trash,
                bannerUrl: payload.new.banner_url,
                logo: payload.new.logo,
                folders: [],
                workspaceOwner: payload.new.workspace_owner,
              };
              dispatch({
                type: "ADD_WORKSPACE",
                payload: newWorkspace,
              });
            }
          } else if (payload.eventType === "DELETE") {
            const fileExist = state.workspaces.some((workspace) => {
              if (workspace.id === payload.old.id) {
                return true;
              }
            });
            if (fileExist) {
              router.replace(`/dashboard`);
              dispatch({
                type: "DELETE_WORKSPACE",
                payload: payload.old.id,
              });
            }
          } else if (payload.eventType === "UPDATE") {
            state.workspaces.some((workspace) => {
              if (workspace.id === payload.new.id) {
                dispatch({
                  type: "UPDATE_WORKSPACE",
                  payload: {
                    workspace: {
                      title: payload.new.title,
                      iconId: payload.new.icon_id,
                      bannerUrl: payload.new.banner_url,
                      logo: payload.new.logo,
                    },
                    workspaceId: payload.new.id,
                  },
                });
                return true;
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase, state, selectedWorkspace]);

  return null;
}
