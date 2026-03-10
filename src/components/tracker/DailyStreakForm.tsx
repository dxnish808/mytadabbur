import { useState, useEffect } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { BookOpen, Clock, Check } from 'lucide-react'
import { getTodayStreak, upsertDailyStreak } from '#/server/functions/streaks'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'

export function DailyStreakForm() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const todayFn = useServerFn(getTodayStreak)
  const upsertFn = useServerFn(upsertDailyStreak)

  const today = new Date().toISOString().slice(0, 10)

  const { data: todayEntry } = useQuery({
    queryKey: ['streaks', 'today'],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return todayFn({ data: { clerkToken } })
    },
  })

  const [pages, setPages] = useState(0)
  const [minutes, setMinutes] = useState(0)

  useEffect(() => {
    if (todayEntry) {
      setPages(todayEntry.pagesRead ?? 0)
      setMinutes(todayEntry.minutesSpent ?? 0)
    }
  }, [todayEntry])

  const upsertMutation = useMutation({
    mutationFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return upsertFn({
        data: {
          clerkToken,
          date: today,
          pagesRead: pages,
          minutesSpent: minutes,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['streaks'] })
    },
  })

  const hasEntry = !!todayEntry

  return (
    <div
      className={`rounded-xl border p-4 ${
        hasEntry
          ? 'border-[var(--primary)] bg-[var(--primary)]/5'
          : 'border-[var(--border)] bg-[var(--card)]'
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        {hasEntry && <Check className="size-4 text-[var(--primary)]" />}
        <h3 className="text-sm font-semibold text-[var(--foreground)]">
          {hasEntry ? 'Bacaan hari ini direkod' : 'Rekod bacaan hari ini'}
        </h3>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[120px]">
          <label className="mb-1 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <BookOpen className="size-3" />
            Halaman
          </label>
          <Input
            type="number"
            min={0}
            value={pages}
            onChange={(e) => setPages(parseInt(e.target.value) || 0)}
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="mb-1 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <Clock className="size-3" />
            Minit
          </label>
          <Input
            type="number"
            min={0}
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
          />
        </div>
        <Button
          onClick={() => upsertMutation.mutate()}
          disabled={upsertMutation.isPending || (pages === 0 && minutes === 0)}
          className="shrink-0"
        >
          {hasEntry ? 'Kemaskini' : 'Simpan'}
        </Button>
      </div>
    </div>
  )
}
