"use client";

import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import React, { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { getUserFromSearch } from "@/lib/supabase/queries";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type CollaboratorSearchProps = {
  children: React.ReactNode;
  getCollaborator: (collaborator: User) => void;
  existingCollaborators: User[] | [];
};

export default function CollaboratorSearch({
  children,
  getCollaborator,
  existingCollaborators,
}: CollaboratorSearchProps) {
  const { user } = useSupabaseUser();
  const [searchResult, setSearchResult] = useState<User[] | []>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const supabase = createClientComponentClient()

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const getUserData = () => {};

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const res = await getUserFromSearch(e.target.value);
      if(!res) return;
      const dataRes = res.map((r) => {
        if(!r.avatarUrl) return {
          ...r
        }
        return{
          ...r,
          avatarUrl: supabase.storage.from('avatars').getPublicUrl(r.avatarUrl).data.publicUrl
        }
      })
      setSearchResult(dataRes);
    }, 450);
  };

  const addCollaborator = (user: User) => {
    getCollaborator(user);
  };

  const matchRegex = (email: string | null) => {
    if(!email) return 'ID';
    const regex = /\b\w/;
    const match = email.match(regex);
    const merge = match?.join('')
    return merge;
  };

  return (
    <Sheet>
      <SheetTrigger className="w-full">{children}</SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Search Collaborator</SheetTitle>
          <SheetDescription>
            <p className="text-sm text-muted-foreground">
              This is still on development so stay tune
            </p>
          </SheetDescription>
        </SheetHeader>
        <div className="flex justify-center items-center gap-2 mt-2">
          <Search />
          <Input
            name="name"
            className="dark:bg-background"
            placeholder="E-mail"
            onChange={onChangeHandler}
          />
        </div>
        <ScrollArea className="mt-6 overflow-y-scroll w-full rounded-md">
          {searchResult
            .filter(
              (result) =>
                !existingCollaborators.some(
                  (existing) => existing.id === result.id
                )
            )
            .filter((result) => result.id !== user?.id)
            .map((user) => (
              <div
                key={user.id}
                className="p-4 flex justify-between items-center"
              >
                <div className="flex gap-4 items-center">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl ? user.avatarUrl : ""} />
                    <AvatarFallback>{matchRegex(user.email)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm gap-2 overflow-hidden overflow-ellipsis w-[180px] text-muted-foreground">
                    {user.email}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => addCollaborator(user)}
                >
                  Add
                </Button>
              </div>
            ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
