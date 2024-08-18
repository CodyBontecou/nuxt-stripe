import GithubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from '#auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import { stripe } from '~/server/utils/stripe'
import { getAccountsByEmail } from '~/server/utils/queries/getAccountsByEmail'

const runtimeConfig = useRuntimeConfig()
const prisma = new PrismaClient()

export default NuxtAuthHandler({
  secret: runtimeConfig.AUTH_SECRET,
  adapter: {
    ...PrismaAdapter(prisma),
    async linkAccount(account) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: account.userId },
      })

      if (!user.email) {
        throw new Error('User email is required to create a Stripe customer')
      }

      const customer = await stripe.customers.create({ email: user.email })

      return prisma.account.create({
        data: {
          ...account,
          stripe_customer_id: customer.id,
        },
      })
    },
  },
  providers: [
    // @ts-expect-error
    GithubProvider.default({
      clientId: runtimeConfig.GITHUB_CLIENT_ID,
      clientSecret: runtimeConfig.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // Adding subscription status to default useAuth data object.
    async session({ session }) {
      if (session.user?.email) {
        const accounts = await getAccountsByEmail(session.user.email)

        return {
          ...session,
          user: {
            ...session.user,
            isSubscribed: accounts[0].is_subscribed,
          },
        }
      }

      return {
        ...session,
        user: {
          ...session.user,
          isSubscribed: undefined,
        },
      }
    },
  },
})
