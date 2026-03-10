import { cn } from '#/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeClasses = {
  sm: 'size-4 border-2',
  md: 'size-8 border-3',
  lg: 'size-12 border-4',
} as const

export function LoadingSpinner({
  className,
  size = 'md',
  label,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3', className)}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-[var(--muted)] border-t-[var(--primary)]',
          sizeClasses[size],
        )}
        role="status"
        aria-label={label ?? 'Memuatkan...'}
      />
      {label && (
        <p className="text-sm text-[var(--muted-foreground)]">{label}</p>
      )}
    </div>
  )
}
