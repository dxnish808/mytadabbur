import { z } from 'zod'

// ─── Reading Progress ────────────────────────────────────
export const PROGRESS_TYPES = ['juz', 'surah'] as const
export type ProgressType = (typeof PROGRESS_TYPES)[number]

export const toggleProgressSchema = z.object({
  type: z.enum(PROGRESS_TYPES),
  number: z.number().int().min(1),
  completed: z.boolean(),
})

// ─── Khatam Cycles ───────────────────────────────────────
export const createKhatamSchema = z.object({
  label: z.string().max(100).optional(),
})

export const completeKhatamSchema = z.object({
  id: z.string().uuid(),
})

// ─── Daily Streaks ───────────────────────────────────────
export const upsertStreakSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pagesRead: z.number().int().min(0).optional(),
  minutesSpent: z.number().int().min(0).optional(),
})

export const streakHistorySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
})
