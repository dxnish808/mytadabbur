import { queryOptions } from '@tanstack/react-query'
import { getSurahByNumber } from './surahs'
import type { Ayah, SurahDetail } from './types'

const API_BASE = 'https://api.alquran.cloud/v1'

// ─── Raw API response types ─────────────────────────────
interface ApiAyah {
  number: number
  numberInSurah: number
  text: string
}

interface ApiSurahResponse {
  code: number
  status: string
  data: {
    number: number
    name: string
    englishName: string
    ayahs: ApiAyah[]
  }
}

// ─── Fetch helpers ───────────────────────────────────────

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

/**
 * Fetch a surah with Arabic text + Malay (Basmeih) translation.
 * Merges both into a single SurahDetail object.
 */
export async function fetchSurahDetail(
  surahNumber: number,
): Promise<SurahDetail> {
  const meta = getSurahByNumber(surahNumber)
  if (!meta) {
    throw new Error(`Surah ${surahNumber} tidak ditemui`)
  }

  const [arabic, malay] = await Promise.all([
    fetchJson<ApiSurahResponse>(`${API_BASE}/surah/${surahNumber}`),
    fetchJson<ApiSurahResponse>(
      `${API_BASE}/surah/${surahNumber}/ms.basmeih`,
    ),
  ])

  const ayahs: Ayah[] = arabic.data.ayahs.map((a, i) => ({
    number: a.number,
    numberInSurah: a.numberInSurah,
    text: a.text,
    translation: malay.data.ayahs[i]?.text ?? '',
  }))

  return {
    ...meta,
    ayahs,
  }
}

// ─── TanStack Query Options ─────────────────────────────

const ONE_DAY = 1000 * 60 * 60 * 24
const ONE_WEEK = ONE_DAY * 7

/**
 * Query options for fetching a single surah (Arabic + terjemahan).
 * Data is static so we cache aggressively.
 */
export const surahDetailQuery = (surahNumber: number) =>
  queryOptions({
    queryKey: ['surah', surahNumber],
    queryFn: () => fetchSurahDetail(surahNumber),
    staleTime: ONE_DAY,
    gcTime: ONE_WEEK,
    enabled: surahNumber >= 1 && surahNumber <= 114,
  })
