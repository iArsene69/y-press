"use client";

import { AuthUser } from "@supabase/supabase-js";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import EmojiPicker from "../global/emoji-picker";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { v4 } from "uuid";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loader from "../loader";
import { useToast } from "../ui/use-toast";
import { createWorkspace } from "@/lib/supabase/queries";
import { useAppState } from "@/lib/providers/state-provider";
import { useRouter } from "next/navigation";

type DashboardSetupProps = {
  user: AuthUser;
  subscription: Subscription | null;
};

export default function DashboardSetup({
  user,
  subscription,
}: DashboardSetupProps) {
  const [selectedEmoji, setSelectedEmoji] = useState("📓");
  const supabase = createClientComponentClient();
  const { toast } = useToast();
  const { dispatch } = useAppState();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isLoading, errors },
  } = useForm<CreateWorkspaceForm>({
    mode: "onChange",
    defaultValues: {
      logo: "",
      workspaceName: "",
    },
  });

  const onSubmit: SubmitHandler<CreateWorkspaceForm> = async (value) => {
    const file = value.logo?.[0];
    let filePath = null;
    const workspaceUUID = v4();

    if (file) {
      try {
        const { data, error } = await supabase.storage
          .from("workspace-logos")
          .upload(`wsLogo.${workspaceUUID}`, file, {
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error("Failed upload logo:", error);
        filePath = data.path;
      } catch (error) {
        console.log(error);
        toast({
          variant: "destructive",
          title: "Error! Could not upload your workspace logo",
        });
      }
      try {
        const newWorkspace: Workspace = {
          data: null,
          createdAt: new Date().toISOString(),
          iconId: selectedEmoji,
          id: workspaceUUID,
          inTrash: "",
          title: value.workspaceName,
          workspaceOwner: user.id,
          logo: filePath || null,
          bannerUrl: "",
        };
        const { data, error: createWsError } = await createWorkspace(
          newWorkspace
        );
        if (createWsError) {
          throw new Error("unable to create Workspace");
        }
        dispatch({
          type: "ADD_WORKSPACE",
          payload: { ...newWorkspace, folders: [] },
        });
        toast({
          title: "Workspace created",
          description: `${newWorkspace.title} has been created successfully`,
        });

        router.replace(`/dashboard/${newWorkspace.id}`);
      } catch (error) {
        console.log("Error on creating workspace:", error);
        toast({
          variant: "destructive",
          title: "Unable to create workspace",
          description: "I think this is your fault.",
        });
      } finally {
        reset();
      }
    }
  };
  return (
    <Card className="w-[800px] h-screen sm:h-auto">
      <CardHeader>
        <CardTitle>Create New Workspace</CardTitle>
        <CardDescription>
          Let&apos;s create idk something cool i guess, so yeah just do it!!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                <EmojiPicker getValue={(emoji) => setSelectedEmoji(emoji)}>
                  {selectedEmoji}
                </EmojiPicker>
              </div>
              <div className="w-full">
                <Label htmlFor="workspaceName">Name</Label>
                <Input
                  id="workspaceName"
                  type="text"
                  placeholder="Workspace Name"
                  disabled={isLoading}
                  {...register("workspaceName", {
                    required: "Workspace Name is required",
                  })}
                />
                <small className="text-red-600">
                  {errors.workspaceName?.message?.toString()}
                </small>
              </div>
            </div>
            <div>
              <Label htmlFor="logo">Workspace Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                placeholder="Workspace Logo"
                disabled={isLoading} // isLoading || subscription?.status !== 'active
                {...register("logo", {
                  required: false,
                })}
              />
              <small className="text-red-600">
                {errors.logo?.message?.toString()}
              </small>
              {subscription?.status !== "active" && (
                <small className="text-muted-foreground block">
                  To customize, consider uploading to Pro plan. And no this is
                  not a request.
                </small>
              )}
            </div>
            <div className="self-end">
              <Button disabled={isLoading} type="submit">
                {isLoading ? <Loader /> : "Create Workspace"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
