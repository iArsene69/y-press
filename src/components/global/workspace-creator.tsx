"use client";

import React, { useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";
import { addCollaborators, createWorkspace } from "@/lib/supabase/queries";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Lock, Plus, Share } from "lucide-react";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { Button } from "../ui/button";
import CollaboratorSearch from "./collaborator-search";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSubscriptionModal } from "@/lib/providers/subscription-modal-provider";

export default function WorkspaceCreator() {
  const { user, subscription } = useSupabaseUser();
  const { toast } = useToast();
  const router = useRouter();
  const [permission, setPermission] = useState("private");
  const [title, setTitle] = useState("");
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { open, setOpen } = useSubscriptionModal();

  const addCollaborator = (user: User) => {
    if (subscription?.status !== "active" && collaborators.length >= 2) {
      setOpen(open);
      return;
    }
    setCollaborators([...collaborators, user]);
  };

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((c) => c.id !== user.id));
  };

  const createItem = async () => {
    setIsLoading(true);
    const uuid = v4();
    if (user?.id) {
      const newWorkspace: Workspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: "📓",
        id: uuid,
        inTrash: "",
        title,
        workspaceOwner: user.id,
        logo: null,
        bannerUrl: "",
      };
      if (permission === "private") {
        toast({ title: "Success", description: "Workspace Created!" });
        await createWorkspace(newWorkspace);
        router.refresh();
      }
      if (permission === "shared") {
        toast({ title: "Success", description: "Workspace Created!" });
        await createWorkspace(newWorkspace);
        await addCollaborators(collaborators, uuid);
        router.refresh();
      }
    }
    setIsLoading(false);
  };

  const matchRegex = (email: string | null) => {
    if (!email) return "ID";
    const regex = /\b\w/;
    const match = email.match(regex);
    const merge = match?.join("");
    return merge;
  };

  return (
    <div className="flex gap-4 flex-col">
      <div>
        <Label htmlFor="name" className="text-sm text-muted-foreground">
          name
        </Label>
        <div className="flex justify-center items-center gap-2">
          <Input
            name="name"
            value={title}
            placeholder="Workspace Name"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
      </div>
      <>
        <Label htmlFor="permissions" className="text-sm text-muted-foreground">
          Permission
        </Label>
        <Select
          onValueChange={(val) => setPermission(val)}
          defaultValue={permission}
        >
          <SelectTrigger className="w-full h-24 -mt-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="private">
                <div className="p-2 flex gap-4 justify-center items-center">
                  <Lock />
                  <article className="text-left flex flex-col">
                    <span>Private</span>
                    <p>As it says this workspace will be private.</p>
                  </article>
                </div>
              </SelectItem>
              <SelectItem value="shared">
                <div className="p-2 flex gap-4 justify-center items-center">
                  <Share />
                  <article className="text-left flex flex-col">
                    <span>Shared</span>
                    <p>You can share it, idk do as you wish.</p>
                  </article>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <>
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
                            <AvatarFallback>
                              {matchRegex(c.email)?.toUpperCase()}
                            </AvatarFallback>
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
                        You have no collaborators
                      </span>
                    </div>
                  )}
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </div>
            </div>
          )}
        </>
      </>
      <Button
        type="button"
        disabled={
          !title ||
          (permission === "shared" && collaborators.length === 0) ||
          isLoading
        }
        variant="secondary"
        onClick={createItem}
      >
        Create
      </Button>
    </div>
  );
}
