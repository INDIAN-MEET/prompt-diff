import { describe, it, expect } from 'vitest'
import {
  extractPlaceholders,
  getPlaceholderNames,
} from '../extractPlaceholders'

describe('extractPlaceholders', () => {
  it('returns empty result for null/undefined/empty input', () => {
    expect(extractPlaceholders(null)).toEqual({ unique: [], total: 0 })
    expect(extractPlaceholders(undefined)).toEqual({ unique: [], total: 0 })
    expect(extractPlaceholders('')).toEqual({ unique: [], total: 0 })
  })

  it('returns empty result for text with no placeholders', () => {
    const result = extractPlaceholders('Hello world, no placeholders here.')
    expect(result.unique).toHaveLength(0)
    expect(result.total).toBe(0)
  })

  it('extracts a single placeholder', () => {
    const result = extractPlaceholders('Hello ${userName}!')
    expect(result.unique).toHaveLength(1)
    expect(result.unique[0]).toEqual({ name: 'userName', count: 1 })
    expect(result.total).toBe(1)
  })

  it('extracts multiple different placeholders', () => {
    const result = extractPlaceholders(
      'Hello ${userName}, order ${orderId} is ready.'
    )
    expect(result.unique).toHaveLength(2)
    expect(result.unique.map((p) => p.name)).toContain('userName')
    expect(result.unique.map((p) => p.name)).toContain('orderId')
    expect(result.total).toBe(2)
  })

  it('counts duplicate placeholders', () => {
    const result = extractPlaceholders(
      '${name} and ${name} and ${name}'
    )
    expect(result.unique).toHaveLength(1)
    expect(result.unique[0]).toEqual({ name: 'name', count: 3 })
    expect(result.total).toBe(3)
  })

  it('trims whitespace inside placeholders', () => {
    const result = extractPlaceholders(
      '${ variable } and ${  variable  } and ${variable}'
    )
    expect(result.unique).toHaveLength(1)
    expect(result.unique[0].name).toBe('variable')
    expect(result.unique[0].count).toBe(3)
  })

  it('supports dotted names', () => {
    const result = extractPlaceholders('Hello ${user.name}, ${user.email}')
    expect(result.unique.map((p) => p.name)).toContain('user.name')
    expect(result.unique.map((p) => p.name)).toContain('user.email')
  })

  it('supports bracket notation', () => {
    const result = extractPlaceholders('Item: ${items[0]}, ${items[1]}')
    expect(result.unique.map((p) => p.name)).toContain('items[0]')
    expect(result.unique.map((p) => p.name)).toContain('items[1]')
  })

  it('supports simple expressions', () => {
    const result = extractPlaceholders('Result: ${ a + b }')
    expect(result.unique).toHaveLength(1)
    expect(result.unique[0].name).toBe('a + b')
  })

  it('ignores escaped placeholders', () => {
    const result = extractPlaceholders(
      'Show \\${notAPlaceholder} but ${realOne}'
    )
    expect(result.unique).toHaveLength(1)
    expect(result.unique[0].name).toBe('realOne')
  })

  it('handles multiline text', () => {
    const text = `Hello \${userName},
Your order \${orderId} is ready.
Delivery on \${deliveryDate}.`
    const result = extractPlaceholders(text)
    expect(result.unique).toHaveLength(3)
    expect(result.total).toBe(3)
  })

  it('handles placeholders at start and end of text', () => {
    const result = extractPlaceholders('${start} middle ${end}')
    expect(result.unique).toHaveLength(2)
  })
})

describe('getPlaceholderNames', () => {
  it('returns an array of just the names', () => {
    const names = getPlaceholderNames('${a} ${b} ${a}')
    expect(names).toEqual(['a', 'b'])
  })

  it('returns empty array for no placeholders', () => {
    expect(getPlaceholderNames('no placeholders')).toEqual([])
  })
})
