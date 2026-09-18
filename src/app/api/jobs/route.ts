import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { jobApplicationSchema } from "@/lib/jobApplication";
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Sign in to continue" }, { status: 401 });
  return Response.json(await prisma.jobApplication.findMany({ where: { userId: session.user.id }, orderBy: { updatedAt: "desc" } }));
}
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Sign in to continue" }, { status: 401 });
  const body = jobApplicationSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Check the company, role, URL, and application date." }, { status: 400 });
  return Response.json(await prisma.jobApplication.create({ data: { ...body.data, userId: session.user.id } }), { status: 201 });
}
