import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getComponentDom } from '../src/parts/GetComponentDom/GetComponentDom.ts'
import { getComponentState } from '../src/parts/GetComponentState/GetComponentState.ts'
import { setComponentState } from '../src/parts/SetComponentState/SetComponentState.ts'
import * as StatusBarStates from '../src/parts/StatusBarStates/StatusBarStates.ts'

test('gets and sets the live component state', async () => {
  const uid = 101
  const oldState = { ...createDefaultState(), uid, warningCount: 0 }
  const newState = { ...oldState, warningCount: 7 }
  StatusBarStates.set(uid, oldState, oldState)

  expect(getComponentState(uid)).toBe(oldState)
  await setComponentState(uid, newState)

  expect(StatusBarStates.get(uid)).toEqual({ newState, oldState, scheduledState: newState })
})

test('rejects an invalid live component state', async () => {
  const uid = 102
  const state = { ...createDefaultState(), uid }
  StatusBarStates.set(uid, state, state)

  await expect(setComponentState(uid, { ...state, uid: 103 })).rejects.toThrow('Status Bar state uid must remain 102')
  await expect(setComponentState(uid, [] as unknown)).rejects.toThrow('Status Bar state must be an object')
})

test('inspects the current virtual DOM without advancing rendered state', () => {
  const uid = 104
  const oldState = { ...createDefaultState(), uid }
  const newState = { ...oldState, initial: false }
  StatusBarStates.set(uid, oldState, newState)
  const before = StatusBarStates.get(uid)
  const dom = getComponentDom(uid)

  expect(Array.isArray(dom)).toBe(true)
  expect(dom.length).toBeGreaterThan(0)
  expect(dom[0]).toEqual(expect.objectContaining({ childCount: expect.any(Number), type: expect.any(Number) }))
  expect(StatusBarStates.get(uid)).toEqual(before)
  expect(StatusBarStates.get(uid).oldState).toBe(oldState)
  expect(StatusBarStates.get(uid).newState).toBe(newState)
})
