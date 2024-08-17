import { PrismaClient } from '@prisma/client'
import { stripe } from '~/server/utils/stripe'

const prisma = new PrismaClient()
const runtimeConfig = useRuntimeConfig()

export default eventHandler(async event => {
  const body = await readRawBody(event, false)
  let stripeEvent: any = body
  let subscription
  let status

  const signature = getHeader(event, 'stripe-signature')

  if (!body) {
    return { error: 'Invalid request body' }
  }

  if (!signature) {
    return { error: 'Invalid stripe-signature' }
  }

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      runtimeConfig.STRIPE_WEBHOOK_SECRET_KEY
    )
  } catch (err) {
    const error = createError({
      statusCode: 400,
      statusMessage: `Webhook error: ${err}`,
    })
    return sendError(event, error)
  }

  switch (stripeEvent.type) {
    case 'customer.subscription.deleted':
      subscription = stripeEvent.data.object
      status = subscription.status

      await prisma.account.update({
        where: {
          stripe_customer_id: subscription.customer,
        },
        data: {
          is_subscribed: false,
        },
      })

      break
    case 'customer.subscription.created':
      subscription = stripeEvent.data.object
      status = subscription.status

      await prisma.account.update({
        where: {
          stripe_customer_id: subscription.customer,
        },
        data: {
          is_subscribed: true,
        },
      })

      break
    default:
      console.log(`Unhandled event type ${stripeEvent.type}.`)
  }
  return { received: true }
})
