import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { Search, PenLine, BookOpen } from 'lucide-react'
import { listJournalEntries } from '#/server/functions/journal'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { EmptyState } from '#/components/shared/EmptyState'
import { LoadingSpinner } from '#/components/shared/LoadingSpinner'
import { JournalCard } from './JournalCard'
import { MOODS, moodLabels } from '#/lib/validators/journal'

interface JournalListProps {
  surahNumber?: number
  mood?: string
  search?: string
  sort?: 'newest' | 'oldest' | 'surah-asc' | 'surah-desc'
}

export function JournalList({
  surahNumber,
  mood,
  search,
  sort,
}: JournalListProps) {
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const listFn = useServerFn(listJournalEntries)

  const { data: entries, isLoading } = useQuery({
    queryKey: ['journal', { surahNumber, mood, search, sort }],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return listFn({ data: { clerkToken, surahNumber, mood, search, sort } })
    },
  })

  return (
    <div className="space-y-4">
      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Cari dalam refleksi..."
            defaultValue={search}
            className="pl-9"
            onChange={(e) => {
              const val = e.target.value || undefined
              navigate({
                to: '/journal',
                search: (prev: any) => ({ ...prev, search: val }),
                replace: true,
              })
            }}
          />
        </div>

        <select
          className="h-9 rounded-md border border-[var(--input)] bg-transparent px-3 text-sm text-[var(--foreground)]"
          value={mood ?? ''}
          onChange={(e) =>
            navigate({
              to: '/journal',
              search: (prev: any) => ({
                ...prev,
                mood: e.target.value || undefined,
              }),
              replace: true,
            })
          }
        >
          <option value="">Semua perasaan</option>
          {MOODS.map((m) => (
            <option key={m} value={m}>
              {moodLabels[m]}
            </option>
          ))}
        </select>

        <select
          className="h-9 rounded-md border border-[var(--input)] bg-transparent px-3 text-sm text-[var(--foreground)]"
          value={sort ?? 'newest'}
          onChange={(e) =>
            navigate({
              to: '/journal',
              search: (prev: any) => ({ ...prev, sort: e.target.value }),
              replace: true,
            })
          }
        >
          <option value="newest">Terbaru</option>
          <option value="oldest">Terlama</option>
          <option value="surah-asc">Surah A-Z</option>
          <option value="surah-desc">Surah Z-A</option>
        </select>

        <Button
          onClick={() => navigate({ to: '/journal/new' })}
          className="shrink-0"
        >
          <PenLine className="size-4" />
          Tulis
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner label="Memuatkan catatan..." className="py-12" />
      ) : !entries || entries.length === 0 ? (
        <EmptyState
          icon={<BookOpen />}
          title="Tiada catatan lagi"
          description="Mula menulis catatan tadabbur pertama anda."
          action={
            <Button onClick={() => navigate({ to: '/journal/new' })}>
              <PenLine className="size-4" />
              Tulis Catatan
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {entries.map((entry: (typeof entries)[number]) => (
            <JournalCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
