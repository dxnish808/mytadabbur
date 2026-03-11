import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { Bismillah } from '#/components/shared/Bismillah'
import { JournalForm } from '#/components/journal/JournalForm'
import { getJournalEntry } from '#/server/functions/journal'
import { LoadingSpinner } from '#/components/shared/LoadingSpinner'

const searchSchema = z.object({
  surah: z.number().optional(),
  ayah: z.number().optional(),
  entryId: z.string().optional(),
})

export const Route = createFileRoute('/journal/new')({
  validateSearch: searchSchema,
  component: NewJournalPage,
})

function NewJournalPage() {
  const { surah, ayah, entryId } = Route.useSearch()
  const { getToken } = useAuth()
  const getFn = useServerFn(getJournalEntry)

  const { data: existingEntry, isLoading } = useQuery({
    queryKey: ['journal', entryId],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return getFn({ data: { clerkToken, id: entryId! } })
    },
    enabled: !!entryId,
  })

  if (entryId && isLoading) {
    return <LoadingSpinner label="Memuatkan catatan..." className="py-16" />
  }

  const isEdit = !!existingEntry

  const defaultValues = existingEntry
    ? {
        id: existingEntry.id,
        surahNumber: existingEntry.surahNumber,
        surahName: existingEntry.surahName,
        ayahStart: existingEntry.ayahStart,
        ayahEnd: existingEntry.ayahEnd,
        reflection: existingEntry.reflection,
        mood: existingEntry.mood,
        tags: existingEntry.tags,
        date: existingEntry.date,
      }
    : surah
      ? { surahNumber: surah, ayahStart: ayah ?? null }
      : undefined

  return (
    <div>
      <Bismillah size="sm" className="mb-4 text-[var(--muted-foreground)]" />
      <h1 className="mb-6 text-2xl font-bold text-[var(--foreground)]">
        {isEdit ? 'Edit Catatan' : 'Tulis Catatan Baru'}
      </h1>
      <JournalForm key={existingEntry?.id} defaultValues={defaultValues} />
    </div>
  )
}
