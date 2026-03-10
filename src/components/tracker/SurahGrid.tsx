import { useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { Check, Search } from 'lucide-react'
import {
  listReadingProgress,
  toggleReadingProgress,
} from '#/server/functions/tracker'
import { SURAHS, searchSurahs } from '#/lib/quran/surahs'
import { Input } from '#/components/ui/input'
import { ProgressRing } from './ProgressRing'

const TOTAL_SURAHS = 114

export function SurahGrid() {
  const [query, setQuery] = useState('')
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const listFn = useServerFn(listReadingProgress)
  const toggleFn = useServerFn(toggleReadingProgress)

  const { data: progress } = useQuery({
    queryKey: ['reading-progress', 'surah'],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return listFn({ data: { clerkToken, type: 'surah' as const } })
    },
  })

  const completedSet = new Set(
    progress?.filter((p) => p.completed).map((p) => p.number) ?? [],
  )
  const completedCount = completedSet.size

  const toggleMutation = useMutation({
    mutationFn: async (surahNumber: number) => {
      const clerkToken = (await getToken()) ?? ''
      return toggleFn({
        data: {
          clerkToken,
          type: 'surah' as const,
          number: surahNumber,
          completed: !completedSet.has(surahNumber),
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['reading-progress', 'surah'],
      })
    },
  })

  const surahs = query ? searchSurahs(query) : SURAHS

  return (
    <div>
      {/* Header with progress ring */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative">
          <ProgressRing value={completedCount} total={TOTAL_SURAHS} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Surah
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            {completedCount} daripada {TOTAL_SURAHS} selesai
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <Input
          placeholder="Cari surah..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {surahs.map((surah) => {
          const done = completedSet.has(surah.number)
          return (
            <button
              key={surah.number}
              type="button"
              onClick={() => toggleMutation.mutate(surah.number)}
              disabled={toggleMutation.isPending}
              className={`flex flex-col items-center gap-0.5 rounded-lg border px-2 py-2.5 text-center transition ${
                done
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)]'
              }`}
            >
              <span className="flex items-center gap-1 text-xs font-bold">
                {done && <Check className="size-3" />}
                {surah.number}
              </span>
              <span className="truncate text-[10px] leading-tight opacity-80">
                {surah.nameTransliteration}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
