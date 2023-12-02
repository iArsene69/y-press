import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import clsx from "clsx";

type CustomDialogTriggerProps = {
  header?: string;
  content?: React.ReactNode;
  children?: React.ReactNode;
  description?: string;
  className?: string;
};

export default function CustomDialogTrigger({
  header,
  content,
  children,
  description,
  className,
}: CustomDialogTriggerProps) {
  return (
    <Dialog>
      <DialogTrigger className={clsx("", className)}>{children}</DialogTrigger>
      <DialogContent className="h-screen block sm:h-[440px] overflow-y-scroll w-full">
        <DialogHeader>
          <DialogTitle>{header}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
