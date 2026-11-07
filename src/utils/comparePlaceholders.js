import { extractPlaceholders } from './extractPlaceholders'

/**
 * Compares placeholders between old and new prompt text.
 *
 * @param {string} oldText - The old prompt text
 * @param {string} newText - The new prompt text
 * @returns {{
 *   oldPlaceholders: { unique: Array<{name: string, count: number}>, total: number },
 *   newPlaceholders: { unique: Array<{name: string, count: number}>, total: number },
 *   added: Array<{name: string, count: number}>,
 *   removed: Array<{name: string, count: number}>,
 *   unchanged: Array<{name: string, count: number}>,
 *   pairs: Array<{removed: string, added: string}>,
 *   identical: boolean
 * }}
 */
export function comparePlaceholders(oldText, newText) {
  const oldPlaceholders = extractPlaceholders(oldText)
  const newPlaceholders = extractPlaceholders(newText)

  const oldNames = new Set(oldPlaceholders.unique.map((p) => p.name))
  const newNames = new Set(newPlaceholders.unique.map((p) => p.name))

  const added = newPlaceholders.unique.filter((p) => !oldNames.has(p.name))
  const removed = oldPlaceholders.unique.filter((p) => !newNames.has(p.name))
  const unchanged = oldPlaceholders.unique.filter((p) => newNames.has(p.name))

  // Try to pair removed and added placeholders that appear at similar positions
  const pairs = findPlaceholderPairs(oldText, newText, removed, added)

  const identical =
    added.length === 0 &&
    removed.length === 0 &&
    oldPlaceholders.unique.length === newPlaceholders.unique.length

  return {
    oldPlaceholders,
    newPlaceholders,
    added,
    removed,
    unchanged,
    pairs,
    identical,
  }
}

/**
 * Attempts to pair removed placeholders with added ones based on position.
 * If a removed placeholder and an added placeholder appear at roughly the same
 * character offset in their respective texts, they are paired.
 */
function findPlaceholderPairs(oldText, newText, removed, added) {
  if (removed.length === 0 || added.length === 0) return []

  const pairs = []
  const usedAdded = new Set()

  // Find positions of each removed placeholder in old text
  for (const rem of removed) {
    const remPos = findPlaceholderPosition(oldText, rem.name)
    let bestMatch = null
    let bestDistance = Infinity

    for (const add of added) {
      if (usedAdded.has(add.name)) continue
      const addPos = findPlaceholderPosition(newText, add.name)

      // Compare relative positions (as fraction of text length)
      const oldRel = oldText.length > 0 ? remPos / oldText.length : 0
      const newRel = newText.length > 0 ? addPos / newText.length : 0
      const distance = Math.abs(oldRel - newRel)

      if (distance < bestDistance && distance < 0.3) {
        bestDistance = distance
        bestMatch = add
      }
    }

    if (bestMatch) {
      pairs.push({ removed: rem.name, added: bestMatch.name })
      usedAdded.add(bestMatch.name)
    }
  }

  return pairs
}

/**
 * Find the first position of a placeholder in text.
 */
function findPlaceholderPosition(text, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`\\$\\{\\s*${escaped}\\s*\\}`)
  const match = regex.exec(text)
  return match ? match.index : -1
}
