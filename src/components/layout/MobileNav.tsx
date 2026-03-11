import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useAuth } from '@clerk/clerk-react'
import {
  BookOpen,
  PenLine,
  BarChart3,
  CheckSquare,
  Settings,
  BookMarked,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '#/lib/utils'

const navItems = [
  { to: '/', label: 'Utama', icon: BookOpen },
  { to: '/journal', label: 'Jurnal', icon: PenLine },
  { to: '/tracker', label: 'Penjejak', icon: CheckSquare },
  { to: '/quran', label: 'Al-Quran', icon: BookMarked },
  { to: '/stats', label: 'Statistik', icon: BarChart3 },
  { to: '/settings', label: 'Tetapan', icon: Settings },
] as const

export function MobileNav() {
  const { isSignedIn } = useAuth()
  const [open, setOpen] = useState(false)

  if (!isSignedIn) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-[var(--foreground)] transition hover:bg-[var(--accent)] md:hidden"
        aria-label="Buka menu"
      >
        <Menu className="size-5" />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Panel */}
          <nav
            className={cn(
              'absolute inset-y-0 left-0 w-72 border-r border-[var(--sidebar-border)] bg-[var(--sidebar-background)] p-4 shadow-xl',
              'animate-in slide-in-from-left duration-200',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="text-lg font-bold text-[var(--foreground)]">
                MyTadabbur
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-[var(--muted-foreground)] transition hover:bg-[var(--accent)]"
                aria-label="Tutup menu"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  activeOptions={{ exact: item.to === '/' }}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--sidebar-foreground)] no-underline transition hover:bg-[var(--sidebar-accent)]"
                  activeProps={{
                    className:
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium no-underline bg-[var(--sidebar-accent)] text-[var(--sidebar-primary)]',
                  }}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
