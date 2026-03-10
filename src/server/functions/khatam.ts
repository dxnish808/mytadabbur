import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { eq, and, isNull, desc } from 'drizzle-orm'
import { db } from '#/db/index'
import { khatamCycles } from '#/db/schema'
import { requireAuth } from '../middleware/auth'
import { createKhatamSchema, completeKhatamSchema } from '#/lib/validators/tracker'

const tokenSchema = z.object({ clerkToken: z.string() })

// ─── List all khatam cycles ─────────────────────────────
export const listKhatamCycles = createServerFn({ method: 'GET' })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    return db
      .select()
      .from(khatamCycles)
      .where(eq(khatamCycles.userId, userId))
      .orderBy(desc(khatamCycles.cycleNumber))
  })

// ─── Get active (incomplete) khatam cycle ───────────────
export const getActiveKhatam = createServerFn({ method: 'GET' })
  .inputValidator(tokenSchema)
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    const [active] = await db
      .select()
      .from(khatamCycles)
      .where(
        and(
          eq(khatamCycles.userId, userId),
          isNull(khatamCycles.endDate),
        ),
      )
      .orderBy(desc(khatamCycles.cycleNumber))
      .limit(1)

    return active ?? null
  })

// ─── Start a new khatam cycle ───────────────────────────
export const startKhatamCycle = createServerFn({ method: 'POST' })
  .inputValidator(tokenSchema.extend(createKhatamSchema.shape))
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    // Check for existing active cycle
    const [active] = await db
      .select()
      .from(khatamCycles)
      .where(
        and(
          eq(khatamCycles.userId, userId),
          isNull(khatamCycles.endDate),
        ),
      )
      .limit(1)

    if (active) {
      throw new Error('Anda sudah mempunyai kitaran khatam aktif. Sila selesaikan dahulu.')
    }

    // Get next cycle number
    const [last] = await db
      .select({ cycleNumber: khatamCycles.cycleNumber })
      .from(khatamCycles)
      .where(eq(khatamCycles.userId, userId))
      .orderBy(desc(khatamCycles.cycleNumber))
      .limit(1)

    const nextCycle = (last?.cycleNumber ?? 0) + 1

    const [cycle] = await db
      .insert(khatamCycles)
      .values({
        userId,
        cycleNumber: nextCycle,
        label: data.label ?? `Khatam #${nextCycle}`,
        startDate: new Date().toISOString().slice(0, 10),
      })
      .returning()

    return cycle!
  })

// ─── Complete active khatam cycle ───────────────────────
export const completeKhatamCycle = createServerFn({ method: 'POST' })
  .inputValidator(tokenSchema.extend(completeKhatamSchema.shape))
  .handler(async ({ data }) => {
    const userId = await requireAuth(data.clerkToken)

    const [cycle] = await db
      .select()
      .from(khatamCycles)
      .where(
        and(
          eq(khatamCycles.id, data.id),
          eq(khatamCycles.userId, userId),
        ),
      )

    if (!cycle) {
      throw new Error('Kitaran khatam tidak ditemui')
    }

    if (cycle.endDate) {
      throw new Error('Kitaran ini sudah selesai')
    }

    const today = new Date().toISOString().slice(0, 10)
    const startMs = new Date(cycle.startDate).getTime()
    const endMs = new Date(today).getTime()
    const totalDays = Math.max(1, Math.ceil((endMs - startMs) / (1000 * 60 * 60 * 24)))

    const [updated] = await db
      .update(khatamCycles)
      .set({
        endDate: today,
        totalDays,
      })
      .where(eq(khatamCycles.id, data.id))
      .returning()

    return updated!
  })
