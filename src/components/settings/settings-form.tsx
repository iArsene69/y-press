"use client";

import { useAppState } from "@/lib/providers/state-provider";
import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
// import db from "@/lib/supabase/db";
import {
  addCollaborators,
  deleteWorkspace,
  getAllUser,
  getAuthUser,
  getCollaborators,
  removeCollaborators,
  updateUser,
  updateWorkspace,
} from "@/lib/supabase/queries";
import { postData } from "@/lib/utils";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Briefcase,
  CreditCard,
  ExternalLink,
  Lock,
  LogOut,
  Plus,
  Share,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { AuthUser } from "@supabase/supabase-js";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CollaboratorSearch from "../global/collaborator-search";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Alert, AlertDescription } from "../ui/alert";
import { useToast } from "../ui/use-toast";
import LogoutButton from "../global/logout-button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import Loader from "../loader";

export default function SettingsForm() {
  const { user, subscription } = useSupabaseUser();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const { dispatch, state, workspaceId } = useAppState();
  const [collaborators, setCollaborators] = useState<User[] | []>([]);
  const { open, setOpen } = useSubscriptionModal();
  const [permission, setPermission] = useState("private");
  const router = useRouter();
  const titleTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const supabase = createClientComponentClient();
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [workspaceDetails, setWorkspaceDetails] = useState<Workspace>();
  const [profile, setProfile] = useState<User>();
  const [uploadingProfilePic, setUploadingProfilePic] = useState(false);
  const { toast } = useToast();
  const [wsTitle, setWsTitle] = useState<string | undefined>();
  const [userFullName, setUserFullName] = useState<string | undefined>();

  const redirectToCustomerPortal = async () => {
    setLoadingPortal(true);
    try {
      const { url, error } = await postData({
        url: "some/url",
      });
      window.location.assign(url);
      throw new Error("Error at payment portal");
    } catch (error) {
      setLoadingPortal(false);
    }
    setLoadingPortal(false);
  };

  const addCollaborator = async (profile: User) => {
    if (!workspaceId) return;
    if (subscription?.status !== "active" && collaborators.length >= 2) {
      setOpen(open);
      return;
    }
    await addCollaborators([profile], workspaceId);
    setCollaborators([...collaborators, profile]);
  };

  const removeCollaborator = async (user: User) => {
    if (!workspaceId) return;
    if (collaborators.length === 1) {
      setPermission("private");
    }
    await removeCollaborators([user], workspaceId);
    setCollaborators((prevState) =>
      prevState.filter((prev) => prev.id !== user?.id)
    );
    router.refresh();
  };

  const workspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId || !e.target.value) return;
    dispatch({
      type: "UPDATE_WORKSPACE",
      payload: { workspace: { title: e.target.value }, workspaceId },
    });
    if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
    titleTimerRef.current = setTimeout(async () => {
      await updateWorkspace({ title: e.target.value }, workspaceId);
    }, 500);
    router.refresh();
  };

  //Fix state

  const onChangeFullName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value || !user?.id) return;
    setUserFullName(e.target.value)
    if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
    titleTimerRef.current = setTimeout(async () => {
      await updateUser({ fullName: e.target.value }, user?.id);
    }, 500);
    router.refresh();
  };

  const onChangeWsLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!workspaceId) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const uuid = v4();
    setUploadingLogo(true);
    const { data, error } = await supabase.storage
      .from("workspace-logos")
      .upload(`wsLogo.${uuid}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (!error) {
      dispatch({
        type: "UPDATE_WORKSPACE",
        payload: { workspace: { logo: data.path }, workspaceId },
      });
      await updateWorkspace({ logo: data.path }, workspaceId);
      setUploadingLogo(false);
    }
    router.refresh();
  };

  const onChangeProfilePicture = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!user) return;
    const profilePic = e.target.files?.[0];
    if (!profilePic) return;
    const uuid = v4();
    const { data: authUser, error: authUserError } = await getAuthUser(user.id);
    setUploadingProfilePic(true);
    if (!authUser?.avatarUrl) {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`av.${uuid}`, profilePic, {
          cacheControl: "3600",
          upsert: true,
        });
      if (!error) {
        await updateUser({ avatarUrl: data.path }, user.id);
        setUploadingProfilePic(false);
      }
    } else {
      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([authUser.avatarUrl]);
      if (deleteError) return;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`av.${uuid}`, profilePic, {
          cacheControl: "3600",
          upsert: true,
        });
      if (!error && !deleteError) {
        await updateUser({ avatarUrl: data.path }, user.id);
        setUploadingProfilePic(false);
      }
    }
    router.refresh();
  };

  const onClickAlertConfirm = async () => {
    if (!workspaceId) return;
    if (collaborators.length > 0) {
      await removeCollaborators(collaborators, workspaceId);
    }
    setPermission("private");
    setOpenAlertMessage(false);
  };

  const onPermissionChange = (val: string) => {
    if (val === "private") {
      setOpenAlertMessage(true);
    } else setPermission(val);
  };

  useEffect(() => {
    const getProfile = async () => {
      let avatarUrl;
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await getAuthUser(user?.id);
      if (!data) return;
      if (!data.avatarUrl) avatarUrl = "";
      else {
        avatarUrl = supabase.storage
          .from("avatars")
          .getPublicUrl(data.avatarUrl).data.publicUrl;
      }
      const dataRes = {
        ...data,
        avatarUrl,
      };
      setProfile(dataRes);
      setUserFullName(dataRes.fullName ? dataRes.fullName : "");
    };
    getProfile();
  }, [uploadingProfilePic, supabase]);

  useEffect(() => {
    const showingWorkspace = state.workspaces.find(
      (workspace) => workspace.id === workspaceId
    );
    if (showingWorkspace) {
      setWorkspaceDetails(showingWorkspace);
    }
  }, [workspaceId, state]);

  useEffect(() => {
    if (!workspaceId) return;
    const fetchCollaborators = async () => {
      const response = await getCollaborators(workspaceId);
      if (response.length) {
        const res = response.map((r) => {
          if (!r.avatarUrl)
            return {
              ...r,
            };
          return {
            ...r,
            avatarUrl: supabase.storage
              .from("avatars")
              .getPublicUrl(r.avatarUrl).data.publicUrl,
          };
        });
        setPermission("shared");
        setCollaborators(res);
      }
    };
    fetchCollaborators();
  }, [workspaceId]);

  return (
    <div className="flex gap-4 flex-col">
      <p className="flex items-center gap-2 mt-6">
        <Briefcase size={20} />
        Workspace
      </p>
      <Separator orientation="horizontal" />
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="workspaceName"
          className="text-sm text-muted-foreground"
        >
          Name
        </Label>
        <Input
          name="workspaceName"
          value={workspaceDetails?.title ? workspaceDetails.title : ""}
          placeholder="Workspace Name"
          onChange={workspaceNameChange}
        />
        <Label
          htmlFor="workspaceLogo"
          className="text-sm text-muted-foreground"
        >
          Workspace Logo
        </Label>
        <Input
          name="workspaceLogo"
          type="file"
          accept="image/*"
          placeholder="Workspace Logo"
          onChange={onChangeWsLogo}
          disabled={uploadingLogo || subscription?.status !== "active"}
        />
        {subscription?.status !== "active" && (
          <small className="text-muted-foreground">
            To customize your workspace, you need to be on a Pro Plan
          </small>
        )}
      </div>
      <>
        <Label htmlFor="permissions">Permission</Label>
        <Select onValueChange={onPermissionChange} value={permission}>
          <SelectTrigger className="w-full h-26 -mt-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="private">
                <div className="p-2 flex gap-4 justify-center items-center">
                  <Lock />
                  <article className="text-left flex flex-col">
                    <span>Private</span>
                    <p>Your private Workspace.</p>
                  </article>
                </div>
              </SelectItem>
              <SelectItem value="shared">
                <div className="p-2 flex gap-4 justify-center items-center">
                  <Share />
                  <article className="text-left flex flex-col">
                    <span>Shared</span>
                    <p>You can invite collaborators.</p>
                  </article>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {permission === "shared" && (
          <div>
            <CollaboratorSearch
              existingCollaborators={collaborators}
              getCollaborator={(user) => {
                addCollaborator(user);
              }}
            >
              <Button type="button" className="text-sm mt-4">
                <Plus />
                Add Collaborators
              </Button>
            </CollaboratorSearch>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                Collaborators {collaborators.length || ""}
              </span>
              <ScrollArea className="h-[120px] max-w-full w-full rounded-md border border-muted-foreground/20">
                {collaborators.length ? (
                  collaborators.map((c) => (
                    <div
                      className="p-4 flex justify-around items-center"
                      key={c.id}
                    >
                      <div className="flex gap-4 items-center">
                        <Avatar>
                          <AvatarImage src={c.avatarUrl ? c.avatarUrl : ""} />
                          <AvatarFallback>FB</AvatarFallback>
                        </Avatar>
                        <div className="text-sm gap-2 text-muted-foreground overflow-hidden overflow-ellipsis sm:w-fit w-[140px]">
                          {c.email}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => removeCollaborator(c)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="absolute right-0 left-0 top-0 bottom-0 flex justify-center items-center">
                    <span className="text-muted-foreground text-sm">
                      You have no friends.
                    </span>
                  </div>
                )}
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </div>
        )}
        <Alert variant="destructive">
          <AlertDescription>
            Deleting workspace will permanently delete all data related to this
            workspace
          </AlertDescription>
          <Button
            type="submit"
            size="sm"
            variant="destructive"
            className="mt-4 text-sm bg-destructive/40 border-2 border-destructive"
            onClick={async () => {
              if (!workspaceId) return;
              await deleteWorkspace(workspaceId);
              toast({
                title: "Successfully delete your woekspace",
              });
              dispatch({
                type: "DELETE_WORKSPACE",
                payload: workspaceId,
              });
              router.replace("/dashboard");
            }}
          >
            Delete Workspace
          </Button>
        </Alert>
        <p className="flex items-center gap-2 mt-6">
          <UserIcon size={20} /> Profile
        </p>
        <Separator orientation="horizontal" />
        <div className="flex items-start">
          <label>
            <input
              name="profilePicture"
              type="file"
              accept="image/*"
              disabled={uploadingProfilePic}
              hidden
              onChange={onChangeProfilePicture}
            />
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={
                  uploadingProfilePic
                    ? ""
                    : profile?.avatarUrl
                    ? profile.avatarUrl
                    : ""
                }
              />
              <AvatarFallback>
                {uploadingProfilePic ? <Loader /> : "AV"}
              </AvatarFallback>
            </Avatar>
          </label>
          <div className="flex flex-col ml-6 gap-4 w-full">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              name="fullName"
              value={userFullName}
              placeholder="John Smith"
              onChange={onChangeFullName}
            />
            <small className="text-muted-foreground cursor-not-allowed">
              {profile ? profile.email : ""}
            </small>
          </div>
        </div>
        <div className="flex items-center">
          <span className="cursor-not-allowed">Log out</span>
          <LogoutButton>
            <div className="text-destructive">
              <LogOut />
            </div>
          </LogoutButton>
        </div>
        <p className="flex items-center gap-2 mt-6">
          <CreditCard size={20} /> Billing & Plan
        </p>
        <Separator orientation="horizontal" />
        <p className="text-muted-foreground">
          You&apos;re currently on a{" "}
          {subscription?.status === "active" ? "Pro" : "Free"} Plan
        </p>
        <Link
          href="/"
          target="_blank"
          className="text-muted-foreground flex flex-row items-center gap-2"
        >
          View Plans <ExternalLink size={16} />
        </Link>
        {subscription?.status === "active" ? (
          <div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={loadingPortal}
              className="text-sm"
              onClick={redirectToCustomerPortal}
            >
              Manage Subscription
            </Button>
          </div>
        ) : (
          <div>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="text-sm"
              onClick={() => setOpen(true)}
            >
              Start Plan
            </Button>
          </div>
        )}
      </>
      <AlertDialog open={openAlertMessage}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Changing a shared workspace to private workspace will remove all
              collaborators permanently
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenAlertMessage(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onClickAlertConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
