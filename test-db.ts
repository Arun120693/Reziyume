/* eslint-disable */
// @ts-nocheck
import { PrismaClient } from "@prisma/client"
import prisma from "./src/lib/prisma"

async function main() {
  const users = await prisma.user.findMany()
  console.log(users)
}
main()
