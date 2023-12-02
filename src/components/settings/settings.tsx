import React from "react";
import CustomDialogTrigger from "../global/custom-dialog-trigger";
import SettingsForm from "./settings-form";

export default function Settings({ children }: { children: React.ReactNode }) {
  return (
    <CustomDialogTrigger header="Settings" content={<SettingsForm />}>
      {children}
    </CustomDialogTrigger>
  );
}
