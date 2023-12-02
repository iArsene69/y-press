import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";
import { files } from "../../migrations/schema";

export const FormSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid Email" }),
  password: z.string().describe("Password").min(1, "Password is Required"),
})

export const SignUpFormSchema = z
.object({
  email: z.string().describe("Email").email({ message: "Invalid Email" }),
  password: z
    .string()
    .describe("Password")
    .min(8, "Password must have minimum of 8 characters"),
  confirmPassword: z
    .string()
    .describe("Password")
    .min(8, "Password must have minimum of 8 characters"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Password didn't match",
  path: ["confirmPassword"],
});

export const CreateWorkspaceFormSchema = z.object({
  workspaceName: z.string().describe("Workspace Name").min(1, 'Workspace name is required'),
  logo: z.any()
})

export type Files = InferSelectModel<typeof files>