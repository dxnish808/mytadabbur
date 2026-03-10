import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, and, desc, ilike, sql } from 'drizzle-orm'
import { db } from '#/db/index'
import { journalEntries } from '#/db/schema'
import { authMiddleware } from '../middleware/auth'
import {
  createJournalEntrySchema,
  updateJournalEntrySchema,
} from '#/lib/validators/journal'

// ─── List entries (with optional filters) ────────────────
const listFiltersSchema = z.object({
  surahNumber: z.number().optional(),
  mood: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'surah-asc', 'surah-desc']).optional(),
})

export const listJournalEntries = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(listFiltersSchema)
  .handler(async ({ context, data }) => {
    const { userId } = context
    const { surahNumber, mood, search, sort = 'newest' } = data

    const conditions = [eq(journalEntries.userId, userId)]

    if (surahNumber) {
      conditions.push(eq(journalEntries.surahNumber, surahNumber))
    }
    if (mood) {
      conditions.push(eq(journalEntries.mood, mood))
    }
    if (search) {
      conditions.push(ilike(journalEntries.reflection, `%${search}%`))
    }

    const orderBy = (() => {
      switch (sort) {
        case 'oldest':
          return journalEntries.date
        case 'surah-asc':
          return journalEntries.surahNumber
        case 'surah-desc':
          return desc(journalEntries.surahNumber)
        default:
          return desc(journalEntries.date)
      }
    })()

    const entries = await db
      .select()
      .from(journalEntries)
      .where(and(...conditions))
      .orderBy(orderBy)

    return entries
  })

// ─── Get single entry ────────────────────────────────────
export const getJournalEntry = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const [entry] = await db
      .select()
      .from(journalEntries)
      .where(
        and(
          eq(journalEntries.id, data.id),
          eq(journalEntries.userId, context.userId),
        ),
      )

    if (!entry) {
      throw new Error('Catatan tidak ditemui')
    }

    return entry
  })

// ─── Create entry ────────────────────────────────────────
export const createJournalEntry = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(createJournalEntrySchema)
  .handler(async ({ context, data }) => {
    const [entry] = await db
      .insert(journalEntries)
      .values({
        userId: context.userId,
        surahNumber: data.surahNumber,
        surahName: data.surahName,
        ayahStart: data.ayahStart ?? null,
        ayahEnd: data.ayahEnd ?? null,
        reflection: data.reflection,
        mood: data.mood ?? null,
        tags: data.tags ?? null,
        date: data.date,
      })
      .returning()

    return entry!
  })

// ─── Update entry ────────────────────────────────────────
export const updateJournalEntry = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(
    z.object({
      id: z.string().uuid(),
      data: updateJournalEntrySchema,
    }),
  )
  .handler(async ({ context, data }) => {
    const [entry] = await db
      .update(journalEntries)
      .set({ ...data.data, updatedAt: new Date() })
      .where(
        and(
          eq(journalEntries.id, data.id),
          eq(journalEntries.userId, context.userId),
        ),
      )
      .returning()

    if (!entry) {
      throw new Error('Catatan tidak ditemui')
    }

    return entry
  })

// ─── Delete entry ────────────────────────────────────────
export const deleteJournalEntry = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const [deleted] = await db
      .delete(journalEntries)
      .where(
        and(
          eq(journalEntries.id, data.id),
          eq(journalEntries.userId, context.userId),
        ),
      )
      .returning({ id: journalEntries.id })

    if (!deleted) {
      throw new Error('Catatan tidak ditemui')
    }

    return { success: true }
  })
