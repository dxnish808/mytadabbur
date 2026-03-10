import { cn } from '#/lib/utils'

interface ArabicTextProps {
  children: React.ReactNode
  className?: string
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3'
}

export function ArabicText({
  children,
  className,
  as: Tag = 'p',
}: ArabicTextProps) {
  return (
    <Tag
      className={cn(
        'font-[var(--font-arabic)] leading-[2] text-[var(--foreground)]',
        className,
      )}
      lang="ar"
      dir="rtl"
    >
      {children}
    </Tag>
  )
}
