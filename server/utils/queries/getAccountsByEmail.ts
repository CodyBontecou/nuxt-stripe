import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAccountsByEmail = async (email: string) => {
  return await prisma.account.findMany({
    where: {
      user: {
        email: email,
      },
    },
  })
}
