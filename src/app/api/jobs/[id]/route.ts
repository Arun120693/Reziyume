import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { jobApplicationSchema } from "@/lib/jobApplication";
type Context = { params: Promise<{ id: string }> };
export async function PATCH(req: Request, { params }: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Sign in to continue" }, { status: 401 });
  const body = jobApplicationSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ error: "Check the job details." }, { status: 400 });
  const { id } = await params;
  const result = await prisma.jobApplication.updateMany({ where: { id, userId: session.user.id }, data: body.data });
  return Response.json({ ok: !!result.count }, { status: result.count ? 200 : 404 });
}
export async function DELETE(_: Request, { params }: Context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ error: "Sign in to continue" }, { status: 401 });
  const { id } = await params;
  const result = await prisma.jobApplication.deleteMany({ where: { id, userId: session.user.id } });
  return Response.json({ ok: !!result.count }, { status: result.count ? 200 : 404 });
}
