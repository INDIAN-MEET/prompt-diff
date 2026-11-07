import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '📊',
    title: 'Side-by-side diff',
    desc: 'GitHub-style split view with line numbers and word-level highlighting.',
  },
  {
    icon: '🔍',
    title: 'Placeholder detection',
    desc: 'Automatically finds all ${...} template placeholders in your prompts.',
  },
  {
    icon: '📈',
    title: 'Old vs new count',
    desc: 'See how many unique placeholders exist in each version at a glance.',
  },
  {
    icon: '🏷️',
    title: 'Change tracking',
    desc: 'Instantly see which placeholders were added, removed, or stayed the same.',
  },
  {
    icon: '🔢',
    title: 'Change counter',
    desc: 'Line and placeholder change statistics with configurable warning threshold.',
  },
  {
    icon: '🔒',
    title: 'Private & secure',
    desc: 'Nothing leaves your browser. Your prompts are never uploaded or stored.',
  },
  {
    icon: '🆓',
    title: 'Free, no login',
    desc: 'No account, no signup, no tracking. Just paste and compare.',
  },
]

const FAQ = [
  {
    q: 'Is PromptDiff free?',
    a: 'Yes, 100% free. No hidden costs, no premium tier.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. There is no login, no signup, no account needed. Just open and use.',
  },
  {
    q: 'Is my data stored anywhere?',
    a: 'No. Everything runs entirely in your browser. Your prompts never leave your device — nothing is sent to any server.',
  },
  {
    q: 'What kind of placeholders does it detect?',
    a: 'JavaScript template literal placeholders like ${variableName}, ${user.name}, ${items[0]}, and even expressions like ${a + b}.',
  },
]

function DiffPreview() {
  return (
    <div
      className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-xl border border-gray-200 shadow-lg dark:border-dark-border"
      aria-hidden="true"
    >
      <div className="flex border-b border-gray-200 bg-gray-50 text-[10px] font-semibold dark:border-gray-700 dark:bg-gray-800 sm:text-xs">
        <div className="w-1/2 border-r border-gray-200 px-3 py-1.5 text-red-600 dark:border-gray-700 dark:text-red-400">
          − Old Prompt
        </div>
        <div className="w-1/2 px-3 py-1.5 text-green-600 dark:text-green-400">
          + New Prompt
        </div>
      </div>
      <div className="text-[10px] sm:text-xs">
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          <div className="w-1/2 border-r border-gray-200 bg-diff-removed-bg p-2 font-mono dark:border-gray-700 dark:bg-dark-diff-removed-bg dark:text-dark-diff-removed-text">
            <span className="text-gray-400">1 </span>Hello{' '}
            <code className="rounded bg-red-200 px-0.5 dark:bg-red-800">
              {'${userName}'}
            </code>
            ,
          </div>
          <div className="w-1/2 bg-diff-added-bg p-2 font-mono dark:bg-dark-diff-added-bg dark:text-dark-diff-added-text">
            <span className="text-gray-400">1 </span>Hello{' '}
            <code className="rounded bg-green-200 px-0.5 dark:bg-green-800">
              {'${customerName}'}
            </code>
            ,
          </div>
        </div>
        <div className="flex border-b border-gray-100 dark:border-gray-800">
          <div className="w-1/2 border-r border-gray-200 p-2 font-mono text-gray-600 dark:border-gray-700 dark:text-gray-400">
            <span className="text-gray-400">2 </span>your order{' '}
            <code className="rounded border border-blue-200 bg-blue-50 px-0.5 text-blue-700 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {'${orderId}'}
            </code>{' '}
            is ready.
          </div>
          <div className="w-1/2 p-2 font-mono text-gray-600 dark:text-gray-400">
            <span className="text-gray-400">2 </span>your order{' '}
            <code className="rounded border border-blue-200 bg-blue-50 px-0.5 text-blue-700 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {'${orderId}'}
            </code>{' '}
            is ready.
          </div>
        </div>
        <div className="flex">
          <div className="w-1/2 border-r border-gray-200 p-2 dark:border-gray-700">
            &nbsp;
          </div>
          <div className="w-1/2 bg-diff-added-bg p-2 font-mono dark:bg-dark-diff-added-bg dark:text-dark-diff-added-text">
            <span className="text-gray-400">3 </span>Delivery on{' '}
            <code className="rounded bg-green-200 px-0.5 dark:bg-green-800">
              {'${deliveryDate}'}
            </code>
            .
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pt-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/20" />
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary-100/30 blur-3xl dark:bg-primary-900/10" />
        </div>

        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              See exactly what changed
              <br />
              in your prompt.{' '}
              <span className="bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent dark:from-primary-400 dark:to-blue-400">
                Instantly.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Paste your old and new prompt. Get a GitHub-style comparison and a
              placeholder report.{' '}
              <strong className="text-gray-900 dark:text-white">Free.</strong>{' '}
              <strong className="text-gray-900 dark:text-white">No login.</strong>
            </p>

            <div className="mt-8">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-xl hover:shadow-primary-600/30 active:scale-95 dark:bg-primary-500 dark:shadow-primary-500/25 dark:hover:bg-primary-600"
              >
                Try it now, it&apos;s free
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Animated preview */}
          <DiffPreview />
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-gray-100 bg-gray-50/50 px-4 py-16 dark:border-dark-border dark:bg-dark-surface/50 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            How it works
          </h2>
          <div className="stagger-children grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Paste old prompt',
                desc: 'Paste the original version of your prompt into the left box.',
                icon: '📝',
              },
              {
                step: '2',
                title: 'Paste new prompt',
                desc: 'Paste the updated version into the right box.',
                icon: '✏️',
              },
              {
                step: '3',
                title: 'See changes & report',
                desc: 'Get a visual diff and a detailed placeholder change report.',
                icon: '✅',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md dark:border-dark-border dark:bg-dark-surface"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-2xl dark:bg-primary-900/40">
                  {item.icon}
                </div>
                <div className="mb-1 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  Step {item.step}
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 sm:px-6" id="features">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Features
          </h2>
          <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-dark-border dark:bg-dark-surface"
              >
                <div className="mb-3 text-2xl">{feature.icon}</div>
                <h3 className="mb-1 font-bold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="border-t border-gray-100 bg-gray-50/50 px-4 py-16 dark:border-dark-border dark:bg-dark-surface/50 sm:px-6"
        id="faq"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-gray-900 dark:text-white">
            FAQ
          </h2>
          <div className="space-y-4">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-gray-200 bg-white shadow-sm dark:border-dark-border dark:bg-dark-surface"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900 transition-colors hover:text-primary-600 dark:text-white dark:hover:text-primary-400">
                  {item.q}
                  <svg
                    className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
