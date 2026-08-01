"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { sanitizeEmail } from "@/lib/sanitize";
import { headers } from "next/headers";

export async function loginAction(formData: FormData) {
  const email = sanitizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  const rate = checkRateLimit(`${ip}:${email}`, "login");
  if (!rate.success) {
    return { error: "Too many login attempts. Please try again later." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}
