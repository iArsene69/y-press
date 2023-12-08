"use server";

import { validate } from "uuid";
import db from "./db";
import { and, eq, ilike, notExists } from "drizzle-orm";
import {
  files,
  folders,
  prices,
  users,
  workspaces,
} from "../../../migrations/schema";
import { collaborators } from "./schema";
import {
  createServerActionClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const getUserSubscriptionStatus = async (userId: string) => {
  try {
    const subsData = await db.query.subscriptions.findFirst({
      where: (sub, { eq }) => eq(sub.userId, userId),
    });
    if (subsData) return { data: subsData as Subscription, error: null };
    else return { data: null, error: null };
  } catch (error) {
    return { data: null, error: `Error` };
  }
};

export const getFiles = async (folderId: string) => {
  const isValid = validate(folderId);
  if (!isValid) return { data: null, error: "Error" };
  try {
    const results = (await db
      .select()
      .from(files)
      .orderBy(files.createdAt)
      .where(eq(files.folderId, folderId))) as FileType[] | [];
    return { data: results, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
};

export const createWorkspace = async (workspace: Workspace) => {
  try {
    const response = await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: `Error: ${error}` };
  }
};

export const getFolders = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid) {
    return {
      data: null,
      error: "Provided workspace identifier is not valid",
    };
  }

  try {
    const result: Folder[] | [] = await db
      .select()
      .from(folders)
      .orderBy(folders.createdAt)
      .where(eq(folders.workspaceId, workspaceId));
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: "Unable to retrieve folders data" };
  }
};

export const getPrivateWorkspaces = async (userId: string) => {
  if (!userId) return [];

  const privateWs = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .where(
      and(
        notExists(
          db
            .select()
            .from(collaborators)
            .where(eq(collaborators.workspaceId, workspaces.id))
        ),
        eq(workspaces.workspaceOwner, userId)
      )
    )) as Workspace[];
  return privateWs;
};

export const getCollaboratingWorkspaces = async (userId: string) => {
  if (!userId) return [];

  const collabWs = (await db
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(users)
    .innerJoin(collaborators, eq(users.id, collaborators.userId))
    .innerJoin(workspaces, eq(collaborators.workspaceId, workspaces.id))
    .where(eq(users.id, userId))) as Workspace[];
  return collabWs;
};

export const getSharedWorkspaces = async (userId: string) => {
  if (!userId) return [];
  const sharedWs = (await db
    .selectDistinct({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    .orderBy(workspaces.createdAt)
    .innerJoin(collaborators, eq(workspaces.id, collaborators.workspaceId))
    .where(eq(workspaces.workspaceOwner, userId))) as Workspace[];
  return sharedWs;
};

export const addCollaborators = async (users: User[], workspaceId: string) => {
  const response = users.forEach(async (user: User) => {
    const userExist = await db.query.collaborators.findFirst({
      where: (u, { eq }) =>
        and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
    });
    if (!userExist) {
      await db.insert(collaborators).values({ workspaceId, userId: user.id });
    }
  });
};

export const getUserFromSearch = async (email: string) => {
  if (!email) return [];
  const accounts = db
    .select()
    .from(users)
    .where(ilike(users.email, `${email}%`));
  return accounts;
};

export const removeCollaborators = async (
  users: User[],
  workspaceId: string
) => {
  const res = users.forEach(async (user: User) => {
    const userExist = await db.query.collaborators.findFirst({
      where: (u, { eq }) =>
        and(eq(u.userId, user.id), eq(u.workspaceId, workspaceId)),
    });
    if (userExist) {
      await db
        .delete(collaborators)
        .where(
          and(
            eq(collaborators.workspaceId, workspaceId),
            eq(collaborators.userId, user.id)
          )
        );
    }
  });
};

export const deleteWorkspace = async (workspaceId: string) => {
  if (!workspaceId) return;
  await db.delete(workspaces).where(eq(workspaces.id, workspaceId));
};

export const getCollaborators = async (workspaceId: string) => {
  const res = await db
    .select()
    .from(collaborators)
    .where(eq(collaborators.workspaceId, workspaceId));
  if (!res.length) return [];
  const userInfo: Promise<User | undefined>[] = res.map(async (user) => {
    const exists = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, user.userId),
    });
    return exists;
  });
  const resolveUsers = await Promise.all(userInfo);
  return resolveUsers.filter(Boolean) as User[];
};

export const updateWorkspace = async (
  workspace: Partial<Workspace>,
  workspaceId: string
) => {
  if (!workspaceId) return;
  try {
    await db
      .update(workspaces)
      .set(workspace)
      .where(eq(workspaces.id, workspaceId));
    return { data: null, errror: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error updating Workspace" };
  }
};

export const createFolder = async (folder: Folder) => {
  try {
    const res = await db.insert(folders).values(folder);
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: "Something went wrong when creating folder" };
  }
};

export const createFile = async (file: FileType) => {
  try {
    await db.insert(files).values(file);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error creating file" };
  }
};

export const updateFolder = async (
  folder: Partial<Folder>,
  folderId: string
) => {
  try {
    await db.update(folders).set(folder).where(eq(folders.id, folderId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error updating folder" };
  }
};

export const updateFile = async (file: Partial<FileType>, fileId: string) => {
  try {
    await db.update(files).set(file).where(eq(files.id, fileId));
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error updating file" };
  }
};

export const getAuthUser = async (userId: string) => {
  try {
    const res = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
    });
    return { data: res, error: null };
  } catch (error) {
    return { data: null, error: "unable to fetch user" };
  }
};

export const getAllUser = async () => {
  const supabase = createServerComponentClient({ cookies });
  try {
    const res = await db.select().from(users).orderBy(users.fullName);
    const resData = res.map((r) => {
      if (!r.avatarUrl) {
        return {
          ...r,
          avatarUrl: "",
        };
      }
      return {
        ...r,
        avatarUrl: supabase.storage.from("avatars").getPublicUrl(r.avatarUrl)
          .data.publicUrl,
      };
    });
    return resData;
  } catch (error) {
    return [];
  }
};

export const updateUser = async (user: Partial<User>, userId: string) => {
  try {
    await db.update(users).set(user).where(eq(users.id, userId));
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: "Error updating profile" };
  }
};

export const deleteFile = async (fileId: string) => {
  if (!fileId) return;
  await db.delete(files).where(eq(files.id, fileId));
};

export const deleteFolder = async (folderId: string) => {
  if (!folderId) return;
  await db.delete(folders).where(eq(folders.id, folderId));
};

export const getActiveProductWithPrice = async () => {
  try {
    const res = await db.query.products.findMany({
      where: (prd, { eq }) => eq(prd.active, true),
      with: {
        prices: {
          where: (prc, { eq }) => eq(prc.active, true),
        },
      },
    });
    if (res.length) return { data: res, error: null };
    return { data: [], error: null };
  } catch (error) {
    return { data: [], error: null };
  }
};

export const getFileDetails = async (fileId: string) => {
  const isValid = validate(fileId);
  if (!isValid) {
    data: [];
    error: "uuid is not valid";
  }

  try {
    const res = (await db
      .select()
      .from(files)
      .where(eq(files.id, fileId))
      .limit(1)) as FileType[];
    return { data: res, error: null };
  } catch (error) {
    return { data: [], error: "err" };
  }
};

export const getFolderDetails = async (folderId: string) => {
  const isValid = validate(folderId);
  if (!isValid) {
    data: [];
    error: "uuid is not valid";
  }

  try {
    const res = (await db
      .select()
      .from(folders)
      .where(eq(folders.id, folderId))
      .limit(1)) as Folder[];
    return { data: res, error: null };
  } catch (error) {
    return { data: [], error: "err" };
  }
};

export const getWorkspaceDetails = async (workspaceId: string) => {
  const isValid = validate(workspaceId);
  if (!isValid) {
    data: [];
    error: "uuid is not valid";
  }

  try {
    const res = (await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .limit(1)) as Workspace[];
    return { data: res, error: null };
  } catch (error) {
    return { data: [], error: "err" };
  }
};

export const findUser = async (userId: string) => {
  const response = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, userId),
  });
  return response;
};
