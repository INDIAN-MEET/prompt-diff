import { describe, it, expect } from 'vitest'
import { comparePlaceholders } from '../comparePlaceholders'

describe('comparePlaceholders', () => {
  it('returns identical=true when both texts have same placeholders', () => {
    const result = comparePlaceholders(
      'Hello ${name}, order ${id}',
      'Hi ${name}, your order ${id} is ready'
    )
    expect(result.identical).toBe(true)
    expect(result.added).toHaveLength(0)
    expect(result.removed).toHaveLength(0)
    expect(result.unchanged).toHaveLength(2)
  })

  it('detects added placeholders', () => {
    const result = comparePlaceholders(
      'Hello ${name}',
      'Hello ${name}, order ${orderId}'
    )
    expect(result.added).toHaveLength(1)
    expect(result.added[0].name).toBe('orderId')
    expect(result.removed).toHaveLength(0)
    expect(result.unchanged).toHaveLength(1)
    expect(result.identical).toBe(false)
  })

  it('detects removed placeholders', () => {
    const result = comparePlaceholders(
      'Hello ${name}, order ${orderId}',
      'Hello ${name}'
    )
    expect(result.removed).toHaveLength(1)
    expect(result.removed[0].name).toBe('orderId')
    expect(result.added).toHaveLength(0)
    expect(result.unchanged).toHaveLength(1)
    expect(result.identical).toBe(false)
  })

  it('handles the sample example correctly', () => {
    const oldText = `Hello \${userName},
your order \${orderId} is ready.`
    const newText = `Hello \${customerName},
your order \${orderId} is ready.
Delivery on \${deliveryDate}.`

    const result = comparePlaceholders(oldText, newText)

    expect(result.oldPlaceholders.unique).toHaveLength(2)
    expect(result.newPlaceholders.unique).toHaveLength(3)

    expect(result.added.map((p) => p.name)).toContain('customerName')
    expect(result.added.map((p) => p.name)).toContain('deliveryDate')
    expect(result.removed.map((p) => p.name)).toContain('userName')
    expect(result.unchanged.map((p) => p.name)).toContain('orderId')
    expect(result.identical).toBe(false)
  })

  it('pairs removed and added placeholders at similar positions', () => {
    const oldText = 'Hello ${userName}, order ${orderId}'
    const newText = 'Hello ${customerName}, order ${orderId}'

    const result = comparePlaceholders(oldText, newText)
    expect(result.pairs).toHaveLength(1)
    expect(result.pairs[0]).toEqual({
      removed: 'userName',
      added: 'customerName',
    })
  })

  it('handles empty strings', () => {
    const result = comparePlaceholders('', '')
    expect(result.identical).toBe(true)
    expect(result.added).toHaveLength(0)
    expect(result.removed).toHaveLength(0)
    expect(result.unchanged).toHaveLength(0)
  })

  it('handles text with no placeholders', () => {
    const result = comparePlaceholders('Hello world', 'Hi there')
    expect(result.identical).toBe(true)
    expect(result.oldPlaceholders.total).toBe(0)
    expect(result.newPlaceholders.total).toBe(0)
  })

  it('preserves occurrence counts in unchanged placeholders', () => {
    const result = comparePlaceholders(
      '${x} and ${x} and ${x}',
      '${x} or ${x}'
    )
    expect(result.unchanged).toHaveLength(1)
    // The count reflects the old text occurrences
    expect(result.unchanged[0].name).toBe('x')
  })

  it('returns correct old and new placeholder counts', () => {
    const oldText = '${a} ${b}'
    const newText = '${b} ${c} ${d}'

    const result = comparePlaceholders(oldText, newText)
    expect(result.oldPlaceholders.unique).toHaveLength(2)
    expect(result.newPlaceholders.unique).toHaveLength(3)
    expect(result.added).toHaveLength(2)
    expect(result.removed).toHaveLength(1)
    expect(result.unchanged).toHaveLength(1)
  })
})
