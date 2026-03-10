import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { PenLine, Layers, BookOpen, Trophy, FileText } from 'lucide-react'
import { getStatsOverview } from '#/server/functions/stats'

const cards = [
  { key: 'journalEntries', label: 'Catatan', icon: PenLine, color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-950' },
  { key: 'juzCompleted', label: 'Juz Selesai', icon: Layers, suffix: '/ 30', color: 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950' },
  { key: 'surahCompleted', label: 'Surah Selesai', icon: BookOpen, suffix: '/ 114', color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-950' },
  { key: 'khatamCompleted', label: 'Khatam', icon: Trophy, color: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-950' },
  { key: 'totalPagesRead', label: 'Halaman Dibaca', icon: FileText, color: 'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-950' },
] as const satisfies readonly { key: string; label: string; icon: any; suffix?: string; color: string }[]

export function StatsOverview() {
  const { getToken } = useAuth()
  const overviewFn = useServerFn(getStatsOverview)

  const { data } = useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return overviewFn({ data: { clerkToken } })
    },
  })

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {cards.map(({ key, label, icon: Icon, suffix, color }) => (
        <div
          key={key}
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4"
        >
          <div className={`mb-2 flex size-9 items-center justify-center rounded-lg ${color}`}>
            <Icon className="size-4" />
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">
            {data ? data[key] : '—'}
            {suffix && (
              <span className="ml-1 text-sm font-normal text-[var(--muted-foreground)]">
                {suffix}
              </span>
            )}
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
        </div>
      ))}
    </div>
  )
}
