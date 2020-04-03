import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: '2020-03-02',
})

export const stripeEnabled = Boolean(process.env.STRIPE_PRIVATE_KEY)