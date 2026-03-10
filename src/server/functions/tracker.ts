import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { db } from '#/db/index'
import { readingProgress } from '#/db/schema'
import { requireAuth } from '../middleware/auth'
import { toggleProgressSchema } from '#/lib/validators/tracker'

const tokenSchema = z.object({ clerkToken: z.string() })

// ─── List all progress for user ──────────────────────────
export const listReadingProgress = createServerFn({ method: 'GET' })
  .inputValidator(
    tokenSchema.extend({
      type: z.enum(['juz', 'surah']).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    const conditions = [eq(readingProgress.userId, userId)]
    if (data.type) {
      conditions.push(eq(readingProgress.type, data.type))
    }

    return db
      .select()
      .from(readingProgress)
      .where(and(...conditions))
      .orderBy(readingProgress.number)
  })

// ─── Toggle a single item (juz or surah) ────────────────
export const toggleReadingProgress = createServerFn({ method: 'POST' })
  .inputValidator(tokenSchema.extend(toggleProgressSchema.shape))
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    const existing = await db
      .select()
      .from(readingProgress)
      .where(
        and(
          eq(readingProgress.userId, userId),
          eq(readingProgress.type, data.type),
          eq(readingProgress.number, data.number),
        ),
      )

    if (existing.length > 0) {
      // Update existing
      const [updated] = await db
        .update(readingProgress)
        .set({
          completed: data.completed,
          completedDate: data.completed
            ? new Date().toISOString().slice(0, 10)
            : null,
          updatedAt: new Date(),
        })
        .where(eq(readingProgress.id, existing[0]!.id))
        .returning()

      return updated!
    }

    // Insert new
    const [created] = await db
      .insert(readingProgress)
      .values({
        userId,
        type: data.type,
        number: data.number,
        completed: data.completed,
        completedDate: data.completed
          ? new Date().toISOString().slice(0, 10)
          : null,
      })
      .returning()

    return created!
  })
