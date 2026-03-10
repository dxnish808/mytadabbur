import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, and, gte, count, sql, desc } from 'drizzle-orm'
import { db } from '#/db/index'
import {
  journalEntries,
  readingProgress,
  khatamCycles,
  dailyStreaks,
} from '#/db/schema'
import { requireAuth } from '../middleware/auth'

const tokenSchema = z.object({ clerkToken: z.string() })

// ─── Overview stats ─────────────────────────────────────
export const getStatsOverview = createServerFn({ method: 'GET' })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    const [journalCount] = await db
      .select({ count: count() })
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))

    const [juzCompleted] = await db
      .select({ count: count() })
      .from(readingProgress)
      .where(
        and(
          eq(readingProgress.userId, userId),
          eq(readingProgress.type, 'juz'),
          eq(readingProgress.completed, true),
        ),
      )

    const [surahCompleted] = await db
      .select({ count: count() })
      .from(readingProgress)
      .where(
        and(
          eq(readingProgress.userId, userId),
          eq(readingProgress.type, 'surah'),
          eq(readingProgress.completed, true),
        ),
      )

    const [khatamCount] = await db
      .select({ count: count() })
      .from(khatamCycles)
      .where(
        and(
          eq(khatamCycles.userId, userId),
          sql`${khatamCycles.endDate} IS NOT NULL`,
        ),
      )

    const [totalPages] = await db
      .select({ total: sql<number>`COALESCE(SUM(${dailyStreaks.pagesRead}), 0)` })
      .from(dailyStreaks)
      .where(eq(dailyStreaks.userId, userId))

    return {
      journalEntries: journalCount?.count ?? 0,
      juzCompleted: juzCompleted?.count ?? 0,
      surahCompleted: surahCompleted?.count ?? 0,
      khatamCompleted: khatamCount?.count ?? 0,
      totalPagesRead: Number(totalPages?.total ?? 0),
    }
  })

// ─── Monthly journal entries (last 12 months) ───────────
export const getMonthlyStats = createServerFn({ method: 'GET' })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
    twelveMonthsAgo.setDate(1)
    const fromDate = twelveMonthsAgo.toISOString().slice(0, 10)

    const rows = await db
      .select({
        month: sql<string>`TO_CHAR(${journalEntries.date}::date, 'YYYY-MM')`,
        count: count(),
      })
      .from(journalEntries)
      .where(
        and(
          eq(journalEntries.userId, userId),
          gte(journalEntries.date, fromDate),
        ),
      )
      .groupBy(sql`TO_CHAR(${journalEntries.date}::date, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${journalEntries.date}::date, 'YYYY-MM')`)

    // Fill in missing months
    const result: { month: string; label: string; count: number }[] = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toISOString().slice(0, 7)
      const label = d.toLocaleDateString('ms-MY', { month: 'short' })
      const row = rows.find((r) => r.month === key)
      result.push({ month: key, label, count: row?.count ?? 0 })
    }

    return result
  })

// ─── Top surahs by journal entries ──────────────────────
export const getTopSurahs = createServerFn({ method: 'GET' })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    return db
      .select({
        surahNumber: journalEntries.surahNumber,
        surahName: journalEntries.surahName,
        count: count(),
      })
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .groupBy(journalEntries.surahNumber, journalEntries.surahName)
      .orderBy(desc(count()))
      .limit(10)
  })

// ─── Monthly reading activity (pages + minutes) ────────
export const getMonthlyReading = createServerFn({ method: 'GET' })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
    twelveMonthsAgo.setDate(1)
    const fromDate = twelveMonthsAgo.toISOString().slice(0, 10)

    const rows = await db
      .select({
        month: sql<string>`TO_CHAR(${dailyStreaks.date}::date, 'YYYY-MM')`,
        pages: sql<number>`COALESCE(SUM(${dailyStreaks.pagesRead}), 0)`,
        minutes: sql<number>`COALESCE(SUM(${dailyStreaks.minutesSpent}), 0)`,
      })
      .from(dailyStreaks)
      .where(
        and(
          eq(dailyStreaks.userId, userId),
          gte(dailyStreaks.date, fromDate),
        ),
      )
      .groupBy(sql`TO_CHAR(${dailyStreaks.date}::date, 'YYYY-MM')`)
      .orderBy(sql`TO_CHAR(${dailyStreaks.date}::date, 'YYYY-MM')`)

    const result: { month: string; label: string; pages: number; minutes: number }[] = []
    const now = new Date()
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = d.toISOString().slice(0, 7)
      const label = d.toLocaleDateString('ms-MY', { month: 'short' })
      const row = rows.find((r) => r.month === key)
      result.push({
        month: key,
        label,
        pages: Number(row?.pages ?? 0),
        minutes: Number(row?.minutes ?? 0),
      })
    }

    return result
  })
