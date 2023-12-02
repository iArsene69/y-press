"use client";

import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import dynamic from "next/dynamic";
import { EmojiClickData } from "emoji-picker-react";

export default function EmojiPicker({
  children,
  getValue,
}: {
  children: React.ReactNode;
  getValue?: (emoji: string) => void;
}) {
  const Picker = dynamic(() => import("emoji-picker-react"));
  const onClick = (selectedEmoji: EmojiClickData) => {
    if (getValue) getValue(selectedEmoji.emoji);
  };
  return (
    <div className="flex items-center">
      <Popover>
        <PopoverTrigger className="cursor-pointer">{children}</PopoverTrigger>
        <PopoverContent className="p-0 border-none">
          <Picker onEmojiClick={onClick} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
