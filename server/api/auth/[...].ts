import GithubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { mapExpiresAt } from '~/server/utils/mapExpiresAt'
import { stripe } from '~/server/utils/stripe'

const runtimeConfig = useRuntimeConfig()
const prisma = new PrismaClient()

export default NuxtAuthHandler({
  secret: runtimeConfig.AUTH_SECRET,
  adapter: {
    ...PrismaAdapter(prisma),
    async linkAccount(account) {
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id: account.userId,
        },
      })

      if (user && user.email) {
        const customer = await stripe.customers.create({
          email: user.email,
        })

        const result = await prisma.account.create({
          data: {
            ...account,
            stripe_customer_id: customer.id,
          },
          select: {
            id: true,
            userId: true,
            provider: true,
            type: true,
            providerAccountId: true,
            access_token: true,
            expires_at: true,
            refresh_token: true,
            id_token: true,
            scope: true,
            token_type: true,
          },
        })

        return mapExpiresAt(result)
      }
    },
  },
  providers: [
    // @ts-expect-error
    GithubProvider.default({
      clientId: runtimeConfig.GITHUB_CLIENT_ID,
      clientSecret: runtimeConfig.GITHUB_CLIENT_SECRET,
    }),
  ],
})
