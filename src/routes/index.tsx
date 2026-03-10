import { Link, createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import {
  PenLine,
  CheckSquare,
  BookMarked,
  BarChart3,
  Flame,
  Layers,
  Trophy,
} from 'lucide-react'
import { Bismillah } from '#/components/shared/Bismillah'
import { getStatsOverview } from '#/server/functions/stats'
import { getCurrentStreak } from '#/server/functions/streaks'

export const Route = createFileRoute('/')({ component: DashboardPage })

const quickLinks = [
  {
    to: '/journal/new',
    label: 'Tulis Catatan',
    description: 'Catat refleksi tadabbur hari ini.',
    icon: PenLine,
  },
  {
    to: '/tracker',
    label: 'Penjejak Bacaan',
    description: 'Jejak progress Juz dan Surah.',
    icon: CheckSquare,
  },
  {
    to: '/quran',
    label: 'Al-Quran',
    description: 'Baca dan terokai 114 surah.',
    icon: BookMarked,
  },
  {
    to: '/stats',
    label: 'Statistik',
    description: 'Lihat ringkasan dan pencapaian.',
    icon: BarChart3,
  },
] as const

function DashboardPage() {
  const { getToken, isSignedIn } = useAuth()
  const overviewFn = useServerFn(getStatsOverview)
  const streakFn = useServerFn(getCurrentStreak)

  const { data: overview } = useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return overviewFn({ data: { clerkToken } })
    },
    enabled: !!isSignedIn,
  })

  const { data: streak } = useQuery({
    queryKey: ['streaks', 'current'],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return streakFn({ data: { clerkToken } })
    },
    enabled: !!isSignedIn,
  })

  return (
    <div>
      <div className="mb-8">
        <Bismillah size="sm" className="mb-4 text-[var(--muted-foreground)]" />
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Assalamualaikum
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Selamat datang ke MyTadabbur. Mulakan tadabbur hari ini.
        </p>
      </div>

      {/* Quick stats (only when signed in) */}
      {isSignedIn && overview && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
            <Flame className="size-5 text-orange-500" />
            <div>
              <p className="text-lg font-bold text-[var(--foreground)]">
                {streak?.streak ?? 0}
              </p>
              <p className="text-[10px] text-[var(--muted-foreground)]">
                Hari berturut
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
            <PenLine className="size-5 text-blue-500" />
            <div>
              <p className="text-lg font-bold text-[var(--foreground)]">
                {overview.journalEntries}
              </p>
              <p className="text-[10px] text-[var(--muted-foreground)]">
                Catatan
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
            <Layers className="size-5 text-emerald-500" />
            <div>
              <p className="text-lg font-bold text-[var(--foreground)]">
                {overview.juzCompleted}
                <span className="text-xs font-normal text-[var(--muted-foreground)]">
                  /30
                </span>
              </p>
              <p className="text-[10px] text-[var(--muted-foreground)]">Juz</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
            <Trophy className="size-5 text-amber-500" />
            <div>
              <p className="text-lg font-bold text-[var(--foreground)]">
                {overview.khatamCompleted}
              </p>
              <p className="text-[10px] text-[var(--muted-foreground)]">
                Khatam
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-[var(--accent)]">
              <item.icon className="size-5 text-[var(--primary)]" />
            </div>
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              {item.label}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
