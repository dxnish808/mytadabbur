interface ProgressRingProps {
  value: number
  total: number
  size?: number
  strokeWidth?: number
  className?: string
}

export function ProgressRing({
  value,
  total,
  size = 80,
  strokeWidth = 6,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percent = total > 0 ? value / total : 0
  const offset = circumference * (1 - percent)

  return (
    <div className={className}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-lg font-bold text-[var(--foreground)]">
          {value}
        </span>
        <span className="text-[10px] text-[var(--muted-foreground)]">
          / {total}
        </span>
      </div>
    </div>
  )
}
