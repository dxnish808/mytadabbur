import { Link } from '@tanstack/react-router'
import { useAuth } from '@clerk/clerk-react'
import {
  BookOpen,
  PenLine,
  BarChart3,
  CheckSquare,
  BookMarked,
  Settings,
} from 'lucide-react'
import ClerkHeader from '../integrations/clerk/header-user.tsx'
import ThemeToggle from './ThemeToggle'
import { MobileNav } from './layout/MobileNav'

const navItems = [
  { to: '/', label: 'Utama', icon: BookOpen },
  { to: '/journal', label: 'Jurnal', icon: PenLine },
  { to: '/tracker', label: 'Penjejak', icon: CheckSquare },
  { to: '/quran', label: 'Al-Quran', icon: BookMarked },
  { to: '/stats', label: 'Statistik', icon: BarChart3 },
  { to: '/settings', label: 'Tetapan', icon: Settings },
] as const

export default function Header() {
  const { isSignedIn } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <div className="relative mx-auto flex h-14 max-w-6xl items-center gap-3">
        {/* Mobile hamburger (only when signed in) */}
        <MobileNav />

        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-[var(--foreground)] no-underline"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,var(--lagoon),var(--palm))]" />
          <span className="text-base font-bold tracking-tight">
            MyTadabbur
          </span>
        </Link>

        {/* Center nav (desktop only, signed in only) */}
        {isSignedIn && (
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === '/' }}
                className="whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium text-[var(--muted-foreground)] no-underline transition hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                activeProps={{
                  className:
                    'whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium no-underline bg-[var(--accent)] text-[var(--foreground)]',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <ClerkHeader />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
