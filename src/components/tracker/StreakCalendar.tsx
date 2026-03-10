import { useMemo } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getStreakHistory } from '#/server/functions/streaks'

const DAYS_MS = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab']

function getMonthLabel(date: Date) {
  return date.toLocaleDateString('ms-MY', { month: 'short' })
}

export function StreakCalendar() {
  const { getToken } = useAuth()
  const historyFn = useServerFn(getStreakHistory)

  // Last 6 months
  const { from, to } = useMemo(() => {
    const now = new Date()
    const end = now.toISOString().slice(0, 10)
    const start = new Date(now)
    start.setMonth(start.getMonth() - 6)
    start.setDate(1)
    return { from: start.toISOString().slice(0, 10), to: end }
  }, [])

  const { data: history } = useQuery({
    queryKey: ['streaks', 'history', from, to],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return historyFn({ data: { clerkToken, from, to } })
    },
  })

  // Build date → intensity map
  const dateMap = useMemo(() => {
    const map = new Map<string, number>()
    if (!history) return map
    for (const entry of history) {
      const total = (entry.pagesRead ?? 0) + (entry.minutesSpent ?? 0)
      map.set(entry.date, total)
    }
    return map
  }, [history])

  // Generate weeks grid
  const { weeks, monthLabels } = useMemo(() => {
    const fromDate = new Date(from)
    const toDate = new Date(to)

    // Start from the Sunday of the first week
    const start = new Date(fromDate)
    start.setDate(start.getDate() - start.getDay())

    const weeksArr: Date[][] = []
    const current = new Date(start)

    while (current <= toDate) {
      const week: Date[] = []
      for (let d = 0; d < 7; d++) {
        week.push(new Date(current))
        current.setDate(current.getDate() + 1)
      }
      weeksArr.push(week)
    }

    // Month labels: find first occurrence of each month
    const labels: { label: string; weekIndex: number }[] = []
    let lastMonth = -1
    weeksArr.forEach((week, i) => {
      const firstDay = week[0]!
      if (firstDay.getMonth() !== lastMonth) {
        lastMonth = firstDay.getMonth()
        labels.push({ label: getMonthLabel(firstDay), weekIndex: i })
      }
    })

    return { weeks: weeksArr, monthLabels: labels }
  }, [from, to])

  // Intensity level (0-4)
  const getLevel = (date: Date): number => {
    const key = date.toISOString().slice(0, 10)
    const val = dateMap.get(key)
    if (!val) return 0
    if (val <= 5) return 1
    if (val <= 15) return 2
    if (val <= 30) return 3
    return 4
  }

  const levelColors = [
    'bg-[var(--muted)]',
    'bg-[var(--primary)]/25',
    'bg-[var(--primary)]/50',
    'bg-[var(--primary)]/75',
    'bg-[var(--primary)]',
  ]

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-0.5">
          {/* Month labels row */}
          <div className="flex gap-0.5 pl-8">
            {weeks.map((_, i) => {
              const label = monthLabels.find((m) => m.weekIndex === i)
              return (
                <div
                  key={i}
                  className="h-3 w-3 text-[8px] leading-3 text-[var(--muted-foreground)]"
                >
                  {label?.label ?? ''}
                </div>
              )
            })}
          </div>

          {/* Day rows */}
          {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => (
            <div key={dayOfWeek} className="flex items-center gap-0.5">
              <span className="w-7 text-right text-[9px] text-[var(--muted-foreground)]">
                {dayOfWeek % 2 === 1 ? DAYS_MS[dayOfWeek] : ''}
              </span>
              {weeks.map((week, wi) => {
                const day = week[dayOfWeek]!
                const dateStr = day.toISOString().slice(0, 10)
                const level = getLevel(day)
                const isFuture = dateStr > today
                const beforeRange = dateStr < from

                return (
                  <div
                    key={wi}
                    className={`size-3 rounded-sm ${
                      isFuture || beforeRange
                        ? 'bg-transparent'
                        : levelColors[level]
                    }`}
                    title={
                      isFuture || beforeRange
                        ? undefined
                        : `${dateStr}: ${dateMap.get(dateStr) ?? 0}`
                    }
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-end gap-1 text-[9px] text-[var(--muted-foreground)]">
        <span>Kurang</span>
        {levelColors.map((color, i) => (
          <div key={i} className={`size-3 rounded-sm ${color}`} />
        ))}
        <span>Lebih</span>
      </div>
    </div>
  )
}
