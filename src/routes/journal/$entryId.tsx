import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@clerk/clerk-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { ArrowLeft, Pencil, Trash2, Calendar, BookOpen } from 'lucide-react'
import {
  getJournalEntry,
  deleteJournalEntry,
} from '#/server/functions/journal'
import { moodLabels } from '#/lib/validators/journal'
import { LoadingSpinner } from '#/components/shared/LoadingSpinner'
import { Button } from '#/components/ui/button'

const moodEmojis: Record<string, string> = {
  grateful: '🤲',
  reflective: '🤔',
  motivated: '💪',
  repentant: '😢',
  calm: '😌',
  amazed: '😲',
}

export const Route = createFileRoute('/journal/$entryId')({
  component: JournalEntryPage,
})

function JournalEntryPage() {
  const { entryId } = Route.useParams()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  const getFn = useServerFn(getJournalEntry)
  const deleteFn = useServerFn(deleteJournalEntry)

  const { data: entry, isLoading } = useQuery({
    queryKey: ['journal', entryId],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return getFn({ data: { clerkToken, id: entryId } })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return deleteFn({ data: { clerkToken, id: entryId } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] })
      navigate({ to: '/journal' })
    },
  })

  if (isLoading) {
    return <LoadingSpinner label="Memuatkan catatan..." className="py-16" />
  }

  if (!entry) {
    return (
      <div className="py-16 text-center text-[var(--muted-foreground)]">
        Catatan tidak ditemui.
      </div>
    )
  }

  const ayahRange = entry.ayahStart
    ? entry.ayahEnd && entry.ayahEnd !== entry.ayahStart
      ? `${entry.ayahStart}-${entry.ayahEnd}`
      : `${entry.ayahStart}`
    : null

  const tags = entry.tags ? entry.tags.split(',').filter(Boolean) : []

  return (
    <div>
      {/* Back link */}
      <Link
        to="/journal"
        className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] no-underline hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="size-4" />
        Kembali ke senarai
      </Link>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-[var(--primary)]" />
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {entry.surahName}
              {ayahRange && (
                <span className="font-normal text-[var(--muted-foreground)]">
                  {' '}
                  : {ayahRange}
                </span>
              )}
            </h1>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              {entry.date}
            </span>
            {entry.mood && (
              <span>
                {moodEmojis[entry.mood]}{' '}
                {moodLabels[entry.mood as keyof typeof moodLabels]}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: '/journal/new',
                search: {
                  surah: entry.surahNumber,
                  ayah: entry.ayahStart ?? undefined,
                },
              })
            }
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (confirm('Padam catatan ini?')) {
                deleteMutation.mutate()
              }
            }}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="rounded-md bg-[var(--muted)] px-2 py-0.5 text-xs font-medium text-[var(--muted-foreground)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Reflection */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]">
          {entry.reflection}
        </p>
      </div>
    </div>
  )
}
