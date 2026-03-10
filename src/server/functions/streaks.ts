import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, and, gte, lte, desc } from 'drizzle-orm'
import { db } from '#/db/index'
import { dailyStreaks } from '#/db/schema'
import { requireAuth } from '../middleware/auth'
import {
  upsertStreakSchema,
  streakHistorySchema,
} from '#/lib/validators/tracker'

const tokenSchema = z.object({ clerkToken: z.string() })

// ─── Get today's streak entry ───────────────────────────
export const getTodayStreak = createServerFn({ method: 'GET' })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)
    const today = new Date().toISOString().slice(0, 10)

    const [entry] = await db
      .select()
      .from(dailyStreaks)
      .where(
        and(
          eq(dailyStreaks.userId, userId),
          eq(dailyStreaks.date, today),
        ),
      )

    return entry ?? null
  })

// ─── Upsert daily streak (create or update) ─────────────
export const upsertDailyStreak = createServerFn({ method: 'POST' })
  .inputValidator(tokenSchema.extend(upsertStreakSchema.shape))
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    const [existing] = await db
      .select()
      .from(dailyStreaks)
      .where(
        and(
          eq(dailyStreaks.userId, userId),
          eq(dailyStreaks.date, data.date),
        ),
      )

    if (existing) {
      const [updated] = await db
        .update(dailyStreaks)
        .set({
          pagesRead: data.pagesRead ?? existing.pagesRead,
          minutesSpent: data.minutesSpent ?? existing.minutesSpent,
        })
        .where(eq(dailyStreaks.id, existing.id))
        .returning()

      return updated!
    }

    const [created] = await db
      .insert(dailyStreaks)
      .values({
        userId,
        date: data.date,
        pagesRead: data.pagesRead ?? 0,
        minutesSpent: data.minutesSpent ?? 0,
      })
      .returning()

    return created!
  })

// ─── Get streak history (date range) ────────────────────
export const getStreakHistory = createServerFn({ method: 'GET' })
  .inputValidator(tokenSchema.extend(streakHistorySchema.shape))
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    return db
      .select()
      .from(dailyStreaks)
      .where(
        and(
          eq(dailyStreaks.userId, userId),
          gte(dailyStreaks.date, data.from),
          lte(dailyStreaks.date, data.to),
        ),
      )
      .orderBy(desc(dailyStreaks.date))
  })

// ─── Calculate current streak count ─────────────────────
export const getCurrentStreak = createServerFn({ method: 'GET' })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    // Get last 365 days of entries ordered by date desc
    const today = new Date()
    const yearAgo = new Date(today)
    yearAgo.setFullYear(yearAgo.getFullYear() - 1)

    const entries = await db
      .select({ date: dailyStreaks.date })
      .from(dailyStreaks)
      .where(
        and(
          eq(dailyStreaks.userId, userId),
          gte(dailyStreaks.date, yearAgo.toISOString().slice(0, 10)),
        ),
      )
      .orderBy(desc(dailyStreaks.date))

    if (entries.length === 0) return { streak: 0, totalDays: 0 }

    const dateSet = new Set(entries.map((e) => e.date))
    let streak = 0
    const check = new Date(today)

    // Check today first, if not present start from yesterday
    const todayStr = check.toISOString().slice(0, 10)
    if (!dateSet.has(todayStr)) {
      check.setDate(check.getDate() - 1)
    }

    while (dateSet.has(check.toISOString().slice(0, 10))) {
      streak++
      check.setDate(check.getDate() - 1)
    }

    return { streak, totalDays: entries.length }
  })
