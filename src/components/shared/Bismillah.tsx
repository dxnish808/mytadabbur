import { cn } from '#/lib/utils'

interface BismillahProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
} as const

export function Bismillah({ className, size = 'md' }: BismillahProps) {
  return (
    <p
      className={cn(
        'text-center font-[var(--font-arabic)] leading-relaxed text-[var(--foreground)]',
        sizeClasses[size],
        className,
      )}
      lang="ar"
      dir="rtl"
    >
      بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
    </p>
  )
}
