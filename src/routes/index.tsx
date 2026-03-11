import { Link, createFileRoute } from '@tanstack/react-router'
import {
  SignInButton,
  SignUpButton,
  useAuth,
} from '@clerk/clerk-react'
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
  BookOpen,
  Target,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { Bismillah } from '#/components/shared/Bismillah'
import { getStatsOverview } from '#/server/functions/stats'
import { getCurrentStreak } from '#/server/functions/streaks'

export const Route = createFileRoute('/')({ component: HomePage })

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

function HomePage() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <DashboardView />
  }

  return <WelcomeView />
}

/* ─── Welcome / Landing Page (unauthenticated) ─── */

const features = [
  {
    icon: BookOpen,
    title: 'Jurnal Tadabbur',
    description:
      'Tulis refleksi harian berdasarkan ayat Al-Quran yang dibaca. Simpan catatan bermakna untuk rujukan masa hadapan.',
  },
  {
    icon: Target,
    title: 'Penjejak Bacaan',
    description:
      'Jejak progress bacaan mengikut Juz dan Surah. Rancang dan capai matlamat khatam Al-Quran.',
  },
  {
    icon: TrendingUp,
    title: 'Statistik & Streak',
    description:
      'Lihat pencapaian, streak harian, dan ringkasan bacaan. Kekal istiqamah dengan data yang jelas.',
  },
] as const

function WelcomeView() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <div className="mx-auto max-w-2xl py-8 text-center sm:py-12">
        <Bismillah size="md" className="mb-6 text-[var(--muted-foreground)]" />

        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Jurnal Al-Quran Harian Anda
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
          MyTadabbur membantu anda mencatat refleksi tadabbur, menjejak bacaan
          Al-Quran, dan kekal istiqamah setiap hari.
        </p>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <SignUpButton mode="modal">
            <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-[var(--primary)] px-6 text-sm font-semibold text-white shadow-sm transition hover:opacity-90">
              Daftar Percuma
              <ArrowRight className="size-4" />
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="inline-flex h-11 items-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 text-sm font-semibold text-[var(--foreground)] shadow-sm transition hover:bg-[var(--accent)]">
              Log Masuk
            </button>
          </SignInButton>
        </div>
      </div>

      {/* Features */}
      <div className="w-full max-w-3xl">
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm"
            >
              <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-[var(--accent)]">
                <feature.icon className="size-5 text-[var(--primary)]" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted-foreground)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quran quote */}
      <div className="mt-10 max-w-lg text-center">
        <p
          className="text-xl leading-relaxed text-[var(--foreground)] opacity-70"
          lang="ar"
          dir="rtl"
          style={{ fontFamily: 'var(--font-arabic)' }}
        >
          وَلَقَدْ يَسَّرْنَا ٱلْقُرْءَانَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ
        </p>
        <p className="mt-2 text-xs text-[var(--muted-foreground)]">
          "Dan sesungguhnya Kami telah mudahkan Al-Quran untuk peringatan, maka
          adakah orang yang mahu mengambil peringatan?" — Al-Qamar 54:17
        </p>
      </div>
    </div>
  )
}

/* ─── Dashboard (authenticated) ─── */

function DashboardView() {
  const { getToken } = useAuth()
  const overviewFn = useServerFn(getStatsOverview)
  const streakFn = useServerFn(getCurrentStreak)

  const { data: overview } = useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return overviewFn({ data: { clerkToken } })
    },
  })

  const { data: streak } = useQuery({
    queryKey: ['streaks', 'current'],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return streakFn({ data: { clerkToken } })
    },
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

      {/* Quick stats */}
      {overview && (
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
