import { useAuth } from '@clerk/clerk-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { Check } from 'lucide-react'
import {
  listReadingProgress,
  toggleReadingProgress,
} from '#/server/functions/tracker'
import { ProgressRing } from './ProgressRing'

const TOTAL_JUZ = 30

export function JuzGrid() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const listFn = useServerFn(listReadingProgress)
  const toggleFn = useServerFn(toggleReadingProgress)

  const { data: progress } = useQuery({
    queryKey: ['reading-progress', 'juz'],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return listFn({ data: { clerkToken, type: 'juz' as const } })
    },
  })

  const completedSet = new Set(
    progress?.filter((p) => p.completed).map((p) => p.number) ?? [],
  )
  const completedCount = completedSet.size

  const toggleMutation = useMutation({
    mutationFn: async (juzNumber: number) => {
      const clerkToken = (await getToken()) ?? ''
      return toggleFn({
        data: {
          clerkToken,
          type: 'juz' as const,
          number: juzNumber,
          completed: !completedSet.has(juzNumber),
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reading-progress', 'juz'] })
    },
  })

  return (
    <div>
      {/* Header with progress ring */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative">
          <ProgressRing value={completedCount} total={TOTAL_JUZ} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Juz
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            {completedCount} daripada {TOTAL_JUZ} selesai
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-10">
        {Array.from({ length: TOTAL_JUZ }, (_, i) => i + 1).map((juz) => {
          const done = completedSet.has(juz)
          return (
            <button
              key={juz}
              type="button"
              onClick={() => toggleMutation.mutate(juz)}
              disabled={toggleMutation.isPending}
              className={`relative flex aspect-square items-center justify-center rounded-lg border text-sm font-medium transition ${
                done
                  ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--accent)]'
              }`}
            >
              {done ? <Check className="size-4" /> : juz}
            </button>
          )
        })}
      </div>
    </div>
  )
}
