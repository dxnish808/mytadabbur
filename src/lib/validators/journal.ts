import { z } from 'zod'

export const MOODS = [
  'grateful',
  'reflective',
  'motivated',
  'repentant',
  'calm',
  'amazed',
] as const

export const moodLabels: Record<(typeof MOODS)[number], string> = {
  grateful: 'Bersyukur',
  reflective: 'Renungan',
  motivated: 'Bermotivasi',
  repentant: 'Insaf',
  calm: 'Tenang',
  amazed: 'Kagum',
}

export const createJournalEntrySchema = z.object({
  surahNumber: z.number().int().min(1).max(114),
  surahName: z.string().min(1).max(100),
  ayahStart: z.number().int().min(1).nullable().optional(),
  ayahEnd: z.number().int().min(1).nullable().optional(),
  reflection: z
    .string()
    .min(1, 'Sila tulis refleksi anda')
    .max(5000, 'Refleksi terlalu panjang'),
  mood: z.enum(MOODS).nullable().optional(),
  tags: z.string().max(500).nullable().optional(),
  date: z.string().min(1, 'Sila pilih tarikh'),
})

export const updateJournalEntrySchema = createJournalEntrySchema.partial()

export type CreateJournalEntryInput = z.infer<typeof createJournalEntrySchema>
export type UpdateJournalEntryInput = z.infer<typeof updateJournalEntrySchema>
