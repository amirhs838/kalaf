import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAdminCredentials, randomToken, setAdminCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "درخواست نامعتبر" }, { status: 400 });
  }
  if (!verifyAdminCredentials(body.username ?? "", body.password ?? "")) {
    return NextResponse.json({ error: "نام کاربری یا رمز اشتباه است" }, { status: 401 });
  }
  const token = randomToken();
  await db.adminSession.create({ data: { token } });
  const res = NextResponse.json({ ok: true });
  res.headers.set("set-cookie", setAdminCookie(token));
  return res;
}
