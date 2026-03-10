import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, Layers } from 'lucide-react'
import { JuzGrid } from '#/components/tracker/JuzGrid'
import { SurahGrid } from '#/components/tracker/SurahGrid'
import { DailyStreakForm } from '#/components/tracker/DailyStreakForm'
import { StreakSummary } from '#/components/tracker/StreakSummary'
import { StreakCalendar } from '#/components/tracker/StreakCalendar'

export const Route = createFileRoute('/tracker/')({
  component: TrackerPage,
})

type Tab = 'juz' | 'surah'

function TrackerPage() {
  const [tab, setTab] = useState<Tab>('juz')

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Penjejak Bacaan
        </h1>
        <Link
          to="/tracker/khatam"
          className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] no-underline transition hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
        >
          <BookOpen className="size-3.5" />
          Kitaran Khatam
        </Link>
      </div>

      {/* Tab switcher */}
      <div className="mb-4 flex gap-1 rounded-lg bg-[var(--muted)] p-1">
        <button
          type="button"
          onClick={() => setTab('juz')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition ${
            tab === 'juz'
              ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <Layers className="size-4" />
          Juz (30)
        </button>
        <button
          type="button"
          onClick={() => setTab('surah')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition ${
            tab === 'surah'
              ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
          }`}
        >
          <BookOpen className="size-4" />
          Surah (114)
        </button>
      </div>

      {/* Content */}
      {tab === 'juz' ? <JuzGrid /> : <SurahGrid />}

      {/* Streak section */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Rekod Harian
        </h2>
        <DailyStreakForm />
        <StreakSummary />
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <h3 className="mb-3 text-sm font-medium text-[var(--foreground)]">
            Aktiviti 6 bulan lepas
          </h3>
          <StreakCalendar />
        </div>
      </div>
    </div>
  )
}
