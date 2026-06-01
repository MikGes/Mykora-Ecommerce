"use server";

import { signIn, signOut } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { signupSchema, profileSchema, changePasswordSchema } from "@/lib/validators";
import { sanitizeInput } from "@/lib/utils";
import { checkRateLimit, getClientIp } from "@/lib/security";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { ActionResult } from "@/types";
import type { UserProfile } from "@/types";

export async function loginAction(
  email: string,
  password: string,
  rememberMe?: boolean
): Promise<ActionResult> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`login:${ip}`);
  if (!allowed) return { success: false, error: "Too many login attempts" };

  try {
    await signIn("credentials", {
      email: sanitizeInput(email),
      password,
      redirect: false,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Invalid email or password" };
  }
}

export async function signupAction(data: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult<UserProfile>> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`signup:${ip}`);
  if (!allowed) return { success: false, error: "Too many requests" };

  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    const user = await authService.createUser({
      name: sanitizeInput(parsed.data.name),
      email: parsed.data.email,
      password: parsed.data.password,
    });
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
    return { success: true, data: user };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Signup failed",
    };
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirect: false });
  revalidatePath("/");
}

export async function updateProfileAction(data: {
  name: string;
  email: string;
  phone?: string;
  image?: string;
}): Promise<ActionResult<UserProfile>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    const user = await authService.updateProfile(session.user.id, {
      name: sanitizeInput(parsed.data.name),
      email: parsed.data.email,
      phone: parsed.data.phone,
      image: parsed.data.image || undefined,
    });
    revalidatePath("/account");
    return { success: true, data: user };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Update failed",
    };
  }
}

export async function changePasswordAction(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = changePasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  try {
    await authService.changePassword(
      session.user.id,
      parsed.data.currentPassword,
      parsed.data.newPassword
    );
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Password change failed",
    };
  }
}

export async function deleteAccountAction(): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  await authService.deleteAccount(session.user.id);
  await signOut({ redirect: false });
  return { success: true };
}
