"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";

type CreateAccountProps = {
  fullName: string;
  email: string;
};

export const createAccount = async ({
  fullName,
  email,
}: CreateAccountProps) => {
  const existingUser = await getUserByEmail(email);

  const accountId = await sendEmailOTP(email);

  if (!accountId) throw new Error("Failed to send an OTP");

  if (!existingUser) {
    const { databases } = await createAdminClient();

    await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.userCollecionId!,
      ID.unique(),
      {
        fullName,
        email,
        avatar:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSClCC2sTN0JYMZx12xcEgb5lELVfcJbTWAgmypCgB_fhJ6_VSx_fmrojdUj48pa7G5aYY&usqp=CAU",
        accountId,
      }
    );
  }

  return parseStringify({ accountId });
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};

export const getCurrentUser = async () => {
  const { databases, account } = await createSessionClient();

  const result = await account.get();

  const user = await databases.listDocuments(
    appwriteConfig.databaseId!,
    appwriteConfig.userCollecionId!,
    [Query.equal("accountId", [result.$id])]
  );

  if(user.total < 0) return null;

  return parseStringify(user.documents[0]);
}

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId!,
    appwriteConfig.userCollecionId!,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

export const sendEmailOTP = async (email: string) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);

    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

const handleError = (error: unknown, message: string) => {
  console.log(message, error);
  throw error;
};