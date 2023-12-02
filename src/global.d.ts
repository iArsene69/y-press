import { z } from "zod";
import { Database as DB } from "./lib/supabase/supabase.types";
import {
  FormSchema,
  CreateWorkspaceFormSchema,
  SignUpFormSchema,
} from "@/lib/types";
import { InferSelectModel } from "drizzle-orm";
import {
  customers,
  folders,
  prices,
  products,
  subscriptions,
  users,
  workspaces,
  files
} from "../migrations/schema";

type TABLES = DB["public"]["Tables"];

declare global {
  type Workspace = InferSelectModel<typeof workspaces>;
  type User = InferSelectModel<typeof users>;
  type Folder = InferSelectModel<typeof folders>;
  type FileType = InferSelectModel<typeof files>;
  type Product = InferSelectModel<typeof products>;
  type Price = InferSelectModel<typeof prices> & { products?: Product };
  type Customer = InferSelectModel<typeof customers>;
  type Subscription = InferSelectModel<typeof subscriptions> & {
    prices: Price;
  };

  type ProductWirhPrice = Product & {
    prices?: Price[];
  };
  type appFoldersType = Folder & { files: FileType[] | [] };
  type appWorkspacesType = Workspace & {
    folders: appFoldersType[] | [];
  };

  type Form = z.infer<typeof FormSchema>;
  type SignUpForm = z.infer<typeof SignUpFormSchema>;
  type CreateWorkspaceForm = z.infer<typeof CreateWorkspaceFormSchema>;
}
