import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { cookies } from "next/headers";
import db from "@/lib/supabase/db";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";
import LogoutButton from "../global/logout-button";
import { ModeToggle } from "../global/mode-toggle";

export default async function UserCard({
  subscription,
}: {
  subscription: Subscription | null;
}) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;
  const res = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, user.id),
  });
  let avatarPath;
  if (!res) return;
  if (!res.avatarUrl) avatarPath = "";
  else {
    avatarPath = supabase.storage.from("avatars").getPublicUrl(res.avatarUrl)
      ?.data.publicUrl;
  }
  const profile = {
    ...res,
    avatarUrl: avatarPath,
  };

  const matchRegex = (email: string | null) => {
    if (!email) return "ID";
    const regex = /\b\w/;
    const match = email.match(regex);
    const merge = match?.join("");
    return merge;
  };
  return (
    <article className="hidden sm:flex justify-between items-center px-4 py-2 dark:bg-secondary rounded-3xl">
      <aside className="flex justify-center items-center gap-2">
        <Avatar>
          <AvatarImage src={profile.avatarUrl} />
          <AvatarFallback>
            {matchRegex(profile.email)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-muted-foreground">
            {subscription?.status === "active" ? "Pro Plan" : "Free Plan"}
          </span>
          <small className="w-[100px] overflow-hidden overflow-ellipsis">
            {profile.email}
          </small>
        </div>
      </aside>
      <div className="flex items-center justify-center">
        <LogoutButton>
          <LogOut />
        </LogoutButton>
        <ModeToggle />
      </div>
    </article>
  );
}
