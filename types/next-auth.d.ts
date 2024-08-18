import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider`
   */
  interface Session {
    user: {
      /** The user's Stripe subscription status. */
      isSubscribed: boolean
    } & DefaultSession['user']
  }
}
