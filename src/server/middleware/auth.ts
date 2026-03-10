import { createMiddleware } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'
import { createClerkClient } from '@clerk/backend'
import { eq } from 'drizzle-orm'
import { db } from '#/db/index'
import { users } from '#/db/schema'

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
})

/**
 * Auth middleware — verifies Clerk session and resolves the DB user.
 * Upserts user record on first sign-in.
 * Passes `userId` (DB uuid) in context.
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const request = getWebRequest()
  const token = request.headers
    .get('authorization')
    ?.replace('Bearer ', '')

  // Also check cookie-based sessions (Clerk sends __session cookie)
  const cookieToken = request.headers.get('cookie')
    ?.split(';')
    .find((c) => c.trim().startsWith('__session='))
    ?.split('=')[1]

  const sessionToken = token || cookieToken

  if (!sessionToken) {
    throw new Error('Tidak dibenarkan — sila log masuk')
  }

  let clerkUser: { id: string; firstName: string | null; lastName: string | null; emailAddresses: Array<{ emailAddress: string }>; imageUrl: string }
  try {
    const session = await clerk.verifyToken(sessionToken)
    clerkUser = await clerk.users.getUser(session.sub)
  } catch {
    throw new Error('Sesi tidak sah — sila log masuk semula')
  }

  // Upsert user in DB
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
      set: { name, email, avatarUrl: clerkUser.imageUrl, updatedAt: new Date() },
    })
    .returning({ id: users.id })

  return next({ context: { userId: dbUser!.id } })
})
