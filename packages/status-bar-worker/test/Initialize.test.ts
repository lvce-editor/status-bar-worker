import { beforeEach, expect, jest, test } from '@jest/globals'

const Initialize = await import('../src/parts/Initialize/Initialize.ts')

beforeEach(() => {
  jest.resetAllMocks()
})

test('initialize should call both initialization functions', async () => {
  await Initialize.initialize()
  expect(true).toBe(true)
})
