import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, Layers } from 'lucide-react'
import { JuzGrid } from '#/components/tracker/JuzGrid'
import { SurahGrid } from '#/components/tracker/SurahGrid'

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
    </div>
  )
}
