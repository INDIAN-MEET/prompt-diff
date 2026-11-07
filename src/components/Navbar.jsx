import { Link, useLocation } from 'react-router-dom'
import { useTheme } from './ThemeToggle'

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const location = useLocation()

  return (
    <nav
      className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-dark-border dark:bg-dark-bg/80"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-gray-900 transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400"
          aria-label="PromptDiff home"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect
              width="28"
              height="28"
              rx="6"
              className="fill-primary-600 dark:fill-primary-500"
            />
            <text
              x="14"
              y="19"
              textAnchor="middle"
              className="fill-white"
              fontSize="14"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {'±'}
            </text>
          </svg>
          PromptDiff
        </Link>

        <div className="flex items-center gap-3">
          {location.pathname !== '/app' && (
            <Link
              to="/app"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700 hover:shadow-md active:scale-95 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              Open App
            </Link>
          )}

          <button
            onClick={toggle}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-dark-surface dark:hover:text-white"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}
