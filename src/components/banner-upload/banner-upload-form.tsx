"use client";

import { useAppState } from "@/lib/providers/state-provider";
import {
  updateFile,
  updateFolder,
  updateWorkspace,
} from "@/lib/supabase/queries";
import { UploadBannerFormSchema } from "@/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Loader from "../loader";

type BannerUploadFormProps = {
  dirType: "workspace" | "folder" | "file";
  id: string;
};

export default function BannerUploadForm({
  dirType,
  id,
}: BannerUploadFormProps) {
  const supabase = createClientComponentClient();
  const { state, workspaceId, folderId, dispatch } = useAppState();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting: isUploading, errors },
  } = useForm<z.infer<typeof UploadBannerFormSchema>>({
    mode: "onChange",
    defaultValues: {
      banner: "",
    },
  });
  const onSubmitHandler: SubmitHandler<
    z.infer<typeof UploadBannerFormSchema>
  > = async (val) => {
    const file = val.banner?.[0];
    if (!file || !id) return;
    try {
      let filePath = null;

      const uploadBanner = async () => {
        const { data, error } = await supabase.storage
          .from("banners")
          .upload(`banner.${id}`, file, {
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error("Error uploading banner");
        filePath = data.path;
      };
      switch (dirType) {
        case "file":
          if (!workspaceId || !folderId) return;
          await uploadBanner();
          dispatch({
            type: "UPDATE_FILE",
            payload: {
              file: { bannerUrl: filePath },
              fileId: id,
              folderId,
              workspaceId,
            },
          });
          await updateFile({ bannerUrl: filePath }, id);
          break;
        case "folder":
          if (!workspaceId || !folderId) return;
          await uploadBanner();
          dispatch({
            type: "UPDATE_FOLDER",
            payload: {
              folder: { bannerUrl: filePath },
              folderId: id,
              workspaceId,
            },
          });
          await updateFolder({ bannerUrl: filePath }, id);
          break;
        case "workspace":
          if (!workspaceId) return;
          await uploadBanner();
          dispatch({
            type: "UPDATE_WORKSPACE",
            payload: { workspace: { bannerUrl: filePath }, workspaceId },
          });
          await updateWorkspace({ bannerUrl: filePath }, id);
          break;
      }
      toast({
        title: "Success",
        description: "Upload banner success",
      });
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Unable to upload banner",
      });
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col gap-2"
    >
      <Label htmlFor="bannerImage" className="text-sm text-muted-foreground">
        Banner Image
      </Label>
      <Input
        id="bannerImage"
        type="file"
        accept="image/*"
        disabled={isUploading}
        {...register("banner", { required: "Banner image is required" })}
      />
      <small className="text-red-600">
        {errors.banner?.message?.toString()}
      </small>
      <Button disabled={isUploading} type="submit">
        {!isUploading ? "Upload Banner" : <Loader />}
      </Button>
    </form>
  );
}
