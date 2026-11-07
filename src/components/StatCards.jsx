import { useState } from 'react'

export default function StatCards({
  linesAdded,
  linesRemoved,
  placeholdersAdded,
  placeholdersRemoved,
  placeholdersUnchanged,
}) {
  const [threshold, setThreshold] = useState(3)
  const totalChanged = placeholdersAdded + placeholdersRemoved
  const showWarning = totalChanged > threshold

  const stats = [
    {
      label: 'Lines added',
      value: linesAdded,
      icon: '+',
      color:
        'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Lines removed',
      value: linesRemoved,
      icon: '−',
      color:
        'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
      iconColor: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Placeholders added',
      value: placeholdersAdded,
      icon: '+',
      color:
        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Placeholders removed',
      value: placeholdersRemoved,
      icon: '−',
      color:
        'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      label: 'Placeholders unchanged',
      value: placeholdersUnchanged,
      icon: '=',
      color:
        'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-600',
      iconColor: 'text-gray-500 dark:text-gray-400',
    },
  ]

  return (
    <div className="animate-slide-up">
      {/* Warning banner */}
      {showWarning && (
        <div
          className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 mb-4 p-4 border border-amber-300 dark:border-amber-600 rounded-xl text-amber-800 dark:text-amber-300"
          role="alert"
        >
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="font-medium text-sm">
            ⚠️ Review needed — more than {threshold} placeholder change
            {threshold !== 1 ? 's' : ''} detected ({totalChanged} total).
          </span>
        </div>
      )}

      {/* Stat cards */}
      <div className="gap-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 stagger-children">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border p-4 text-center transition-shadow hover:shadow-md ${stat.color}`}
          >
            <div className="flex justify-center items-center gap-1">
              <span
                className={`text-lg font-bold ${stat.iconColor}`}
                aria-hidden="true"
              >
                {stat.icon}
              </span>
              <span className="font-bold text-2xl">{stat.value}</span>
            </div>
            <div className="opacity-80 mt-1 font-medium text-xs">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Threshold setting */}
      <div className="flex items-center gap-2 mt-4 text-gray-500 dark:text-gray-400 text-xs">
        <label htmlFor="threshold-input">Warn if more than</label>
        <input
          id="threshold-input"
          type="number"
          min="1"
          max="50"
          value={threshold}
          onChange={(e) =>
            setThreshold(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="bg-white dark:bg-dark-surface px-2 py-1 border border-gray-300 dark:border-dark-border rounded-md w-14 dark:text-dark-text text-xs text-center"
          aria-label="Warning threshold for placeholder changes"
        />
        <span>placeholder changes</span>
      </div>
    </div>
  )
}

