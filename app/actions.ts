"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createBundle,
  getActiveBundle,
  createSession,
  countSessionsForBundle,
} from "@/lib/db";
import { SESSION_COOKIE, createSessionToken } from "@/lib/session";

type LoginState = { error?: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!password || password !== process.env.APP_PASSWORD) {
    return { error: "Contraseña incorrecta" };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });

  redirect("/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/login");
}

export async function createNewBundle(formData: FormData) {
  const price = Number(formData.get("price") ?? 0);
  const startDate = String(formData.get("startDate") ?? "");
  const totalSessionsInput = formData.get("totalSessions");
  const totalSessions = totalSessionsInput
    ? Number(totalSessionsInput)
    : undefined;

  if (!price || price <= 0) {
    throw new Error("El bono necesita un precio válido");
  }
  if (!startDate) {
    throw new Error("El bono necesita una fecha de inicio");
  }

  await createBundle({ price, startDate, totalSessions });

  revalidatePath("/");
  revalidatePath("/historial");
}

export type RemainingSessions =
  | { status: "active"; bundleId: number; remaining: number; totalSessions: number }
  | { status: "none" };

export async function getRemainingSessions(): Promise<RemainingSessions> {
  const bundle = await getActiveBundle();
  if (!bundle) {
    return { status: "none" };
  }

  const used = await countSessionsForBundle(bundle.id);

  return {
    status: "active",
    bundleId: bundle.id,
    remaining: bundle.total_sessions - used,
    totalSessions: bundle.total_sessions,
  };
}

export async function logSession(formData: FormData) {
  const bundle = await getActiveBundle();
  if (!bundle) {
    throw new Error("No hay bono activo");
  }

  const effort = Number(formData.get("effort") ?? 0) || null;
  const note = String(formData.get("note") ?? "") || null;
  const sessionDate = String(formData.get("date") ?? "") || undefined;

  await createSession({ bundleId: bundle.id, effort, note, sessionDate });

  revalidatePath("/");
  revalidatePath("/historial");
}
