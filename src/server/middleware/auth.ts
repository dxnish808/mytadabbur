import { createClerkClient, verifyToken } from '@clerk/backend'
import { db } from '#/db/index'
import { users } from '#/db/schema'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
})

/**
 * Resolves the authenticated DB user from a Clerk session token.
 * Upserts user on first sign-in. Returns the DB user UUID.
 *
 * Usage: call from server function handlers that receive the token
 * via the `clerkToken` field in the input data.
 */
export async function requireAuth(token: string): Promise<string> {
  if (!token) {
    throw new Error('Tidak dibenarkan — sila log masuk')
  }

  let clerkUser: {
    id: string
    firstName: string | null
    lastName: string | null
    emailAddresses: Array<{ emailAddress: string }>
    imageUrl: string
  }

  try {
    const session = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY! })
    clerkUser = await clerk.users.getUser(session.sub)
  } catch {
    throw new Error('Sesi tidak sah — sila log masuk semula')
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
    'Pengguna'
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? ''

  const [dbUser] = await db
    .insert(users)
    .values({
      clerkId: clerkUser.id,
      name,
      email,
      avatarUrl: clerkUser.imageUrl,
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: {
        name,
        email,
        avatarUrl: clerkUser.imageUrl,
        updatedAt: new Date(),
      },
    })
    .returning({ id: users.id })

  return dbUser!.id
}
