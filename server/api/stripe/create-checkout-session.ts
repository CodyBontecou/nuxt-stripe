import { stripe } from '~/server/utils/stripe'
import { getServerSession } from '#auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const baseUrl = useRuntimeConfig().public.BASE_URL as string

export default eventHandler(async event => {
  const { lookup_key } = await readBody(event)
  const authSession = await getServerSession(event)

  if (authSession && authSession.user?.email) {
    const account = await prisma.account.findFirst({
      where: {
        user: {
          email: authSession.user.email,
        },
      },
    })

    if (account && account.stripe_customer_id && !account.is_subscribed) {
      const prices = await stripe.prices.list({
        lookup_keys: [lookup_key],
        expand: ['data.product'],
      })

      const session = await stripe.checkout.sessions.create({
        customer: account.stripe_customer_id,
        billing_address_collection: 'auto',
        line_items: [
          {
            price: prices.data[0].id,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${baseUrl}/success`,
        cancel_url: `${baseUrl}/cancelled`,
      })

      if (session.url) {
        return { url: session.url }
      }
    }
  }
})
