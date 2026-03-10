import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, PenLine } from 'lucide-react'
import { surahDetailQuery } from '#/lib/quran/api'
import { getSurahByNumber } from '#/lib/quran/surahs'
import { Bismillah } from '#/components/shared/Bismillah'
import { ArabicText } from '#/components/shared/ArabicText'
import { LoadingSpinner } from '#/components/shared/LoadingSpinner'

export const Route = createFileRoute('/quran/$surahNumber')({
  component: SurahDetailPage,
})

function SurahDetailPage() {
  const { surahNumber } = Route.useParams()
  const num = parseInt(surahNumber, 10)
  const meta = getSurahByNumber(num)

  const { data: surah, isLoading, error } = useQuery(surahDetailQuery(num))

  if (!meta) {
    return (
      <div className="py-16 text-center text-[var(--muted-foreground)]">
        Surah tidak ditemui.
      </div>
    )
  }

  return (
    <div>
      {/* Back */}
      <Link
        to="/quran"
        className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] no-underline hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="size-4" />
        Senarai Surah
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">
              {meta.nameTransliteration}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {meta.nameMalay} · {meta.ayahCount} ayat · {meta.revelationType}
            </p>
          </div>
          <ArabicText className="text-3xl text-[var(--foreground)]" as="span">
            {meta.name}
          </ArabicText>
        </div>
      </div>

      {/* Bismillah — not for At-Tawbah (surah 9) */}
      {num !== 9 && <Bismillah size="md" className="mb-8" />}

      {/* Ayahs */}
      {isLoading ? (
        <LoadingSpinner label="Memuatkan ayat..." className="py-16" />
      ) : error ? (
        <p className="py-12 text-center text-sm text-[var(--destructive)]">
          Gagal memuatkan ayat. Sila cuba semula.
        </p>
      ) : surah ? (
        <div className="space-y-6">
          {surah.ayahs.map((ayah) => (
            <div
              key={ayah.numberInSurah}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              {/* Ayah number + action */}
              <div className="mb-3 flex items-center justify-between">
                <span className="flex size-8 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-bold text-[var(--foreground)]">
                  {ayah.numberInSurah}
                </span>
                <Link
                  to="/journal/new"
                  search={{ surah: num, ayah: ayah.numberInSurah }}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-[var(--muted-foreground)] no-underline transition hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                >
                  <PenLine className="size-3" />
                  Tulis catatan
                </Link>
              </div>

              {/* Arabic text */}
              <ArabicText className="mb-3 text-2xl leading-[2.2]">
                {ayah.text}
              </ArabicText>

              {/* Translation */}
              <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
                {ayah.translation}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
