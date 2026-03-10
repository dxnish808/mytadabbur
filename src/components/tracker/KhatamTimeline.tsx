import { useAuth } from '@clerk/clerk-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { Trophy, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import {
  listKhatamCycles,
  completeKhatamCycle,
  getActiveKhatam,
} from '#/server/functions/khatam'
import { Button } from '#/components/ui/button'
import { EmptyState } from '#/components/shared/EmptyState'
import { LoadingSpinner } from '#/components/shared/LoadingSpinner'

export function KhatamTimeline() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()
  const listFn = useServerFn(listKhatamCycles)
  const activeFn = useServerFn(getActiveKhatam)
  const completeFn = useServerFn(completeKhatamCycle)

  const { data: cycles, isLoading } = useQuery({
    queryKey: ['khatam', 'list'],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return listFn({ data: { clerkToken } })
    },
  })

  const { data: active } = useQuery({
    queryKey: ['khatam', 'active'],
    queryFn: async () => {
      const clerkToken = (await getToken()) ?? ''
      return activeFn({ data: { clerkToken } })
    },
  })

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      const clerkToken = (await getToken()) ?? ''
      return completeFn({ data: { clerkToken, id } })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['khatam'] })
    },
  })

  if (isLoading) {
    return <LoadingSpinner label="Memuatkan kitaran..." className="py-12" />
  }

  if (!cycles || cycles.length === 0) {
    return (
      <EmptyState
        icon={<Trophy />}
        title="Tiada kitaran khatam"
        description="Mulakan kitaran khatam pertama anda untuk menjejaki kemajuan."
      />
    )
  }

  return (
    <div className="space-y-3">
      {cycles.map((cycle) => {
        const isActive = !cycle.endDate
        const startDate = new Date(cycle.startDate).toLocaleDateString('ms-MY', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
        const endDate = cycle.endDate
          ? new Date(cycle.endDate).toLocaleDateString('ms-MY', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : null

        return (
          <div
            key={cycle.id}
            className={`rounded-xl border p-4 ${
              isActive
                ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                : 'border-[var(--border)] bg-[var(--card)]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-10 items-center justify-center rounded-full ${
                    isActive
                      ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                      : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                  }`}
                >
                  {isActive ? (
                    <Clock className="size-5" />
                  ) : (
                    <CheckCircle2 className="size-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">
                    {cycle.label || `Khatam #${cycle.cycleNumber}`}
                  </h3>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3" />
                      {startDate}
                    </span>
                    {endDate && (
                      <>
                        <span>→</span>
                        <span>{endDate}</span>
                      </>
                    )}
                    {cycle.totalDays && (
                      <span className="rounded-md bg-[var(--muted)] px-1.5 py-0.5 font-medium">
                        {cycle.totalDays} hari
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {isActive && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm('Tandakan kitaran ini sebagai selesai?')) {
                      completeMutation.mutate(cycle.id)
                    }
                  }}
                  disabled={completeMutation.isPending}
                >
                  <CheckCircle2 className="size-3.5" />
                  Selesai
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
