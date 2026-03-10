import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { Flame, Calendar } from 'lucide-react'
import { getCurrentStreak } from '#/server/functions/streaks'

export function StreakSummary() {
  const { getToken } = useAuth()
  const streakFn = useServerFn(getCurrentStreak)

  const { data } = useQuery({
    queryKey: ['streaks', 'current'],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return streakFn({ data: { clerkToken } })
    },
  })

  const streak = data?.streak ?? 0
  const totalDays = data?.totalDays ?? 0

  return (
    <div className="flex gap-3">
      <div className="flex flex-1 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
          <Flame className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {streak}
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            Hari berturut-turut
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <Calendar className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {totalDays}
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            Jumlah hari aktif
          </p>
        </div>
      </div>
    </div>
  )
}
