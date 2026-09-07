"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
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

export async function crearBono(formData: FormData) {
  const totalSesiones = Number(formData.get("totalSesiones") ?? 0);
  if (!totalSesiones || totalSesiones <= 0) {
    throw new Error("El bono necesita al menos una sesión");
  }

  await query(
    `insert into bonos (total_sesiones, sesiones_usadas, activo, creado_en)
     values ($1, 0, true, now())`,
    [totalSesiones],
  );

  revalidatePath("/");
}

export async function registrarEntreno(bonoId: number) {
  await query(
    `update bonos set sesiones_usadas = sesiones_usadas + 1 where id = $1`,
    [bonoId],
  );
  await query(
    `update bonos set activo = false
     where id = $1 and sesiones_usadas >= total_sesiones`,
    [bonoId],
  );
  await query(`insert into entrenos (bono_id, fecha) values ($1, now())`, [
    bonoId,
  ]);

  revalidatePath("/");
  revalidatePath("/historial");
}
