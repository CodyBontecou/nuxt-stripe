import Stripe from 'stripe'

export const stripe = new Stripe(useRuntimeConfig().STRIPE_SECRET_KEY)
