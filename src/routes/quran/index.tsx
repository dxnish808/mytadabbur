import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { Input } from '#/components/ui/input'
import { SURAHS, searchSurahs } from '#/lib/quran/surahs'

export const Route = createFileRoute('/quran/')({
  component: QuranPage,
})

function QuranPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'Makkiyyah' | 'Madaniyyah'>(
    'all',
  )

  const searched = query ? searchSurahs(query) : SURAHS
  const filtered =
    filter === 'all'
      ? searched
      : searched.filter((s) => s.revelationType === filter)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[var(--foreground)]">
        Al-Quran
      </h1>

      {/* Search + filter */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <Input
            placeholder="Cari surah..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'Makkiyyah', 'Madaniyyah'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                filter === f
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  : 'border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--accent)]'
              }`}
            >
              {f === 'all' ? 'Semua' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Surah grid */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((surah) => (
          <Link
            key={surah.number}
            to="/quran/$surahNumber"
            params={{ surahNumber: String(surah.number) }}
            className="flex items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 no-underline transition hover:bg-[var(--accent)]"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)] text-sm font-bold text-[var(--foreground)]">
              {surah.number}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-[var(--foreground)]">
                  {surah.nameTransliteration}
                </span>
                <span className="shrink-0 font-[var(--font-arabic)] text-base text-[var(--foreground)]">
                  {surah.name}
                </span>
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                {surah.nameMalay} · {surah.ayahCount} ayat ·{' '}
                {surah.revelationType}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-[var(--muted-foreground)]">
          Tiada surah ditemui untuk "{query}"
        </p>
      )}
    </div>
  )
}
