import { expect, test } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import type { StatusBarState } from '../src/parts/StatusBarState/StatusBarState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ExtensionHostCommandType from '../src/parts/ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as LoadContent from '../src/parts/LoadContent/LoadContent.ts'

test('loadContent should load status bar items when preference is true', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'statusBar.itemsVisible') {
        return true
      }
      return undefined
    },
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [
      {
        command: 'test.command',
        icon: 'test-icon',
        id: 'test.item',
        text: 'Test Item',
        tooltip: 'Test Tooltip',
      },
    ],
  })

  const state: StatusBarState = { ...createDefaultState(), uid: 1 }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations).toEqual([
    {
      method: 'Preferences.get',
      args: ['statusBar.itemsVisible'],
    },
    {
      method: 'ExtensionHostManagement.activateByEvent',
      args: [ExtensionHostActivationEvent.OnStatusBarItem],
    },
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([
    {
      method: ExtensionHostCommandType.GetStatusBarItems,
      args: [],
    },
  ])

  expect(result.statusBarItemsLeft).toEqual([
    {
      command: 'test.command',
      icon: 'test-icon',
      name: 'test.item',
      text: 'Test Item',
      tooltip: 'Test Tooltip',
    },
    {
      command: '',
      icon: '',
      name: 'Notifications',
      text: 'Notifications',
      tooltip: '',
    },
    {
      command: '',
      icon: '',
      name: 'Problems',
      text: 'Problems',
      tooltip: '',
    },
  ])
  expect(result.uid).toBe(1)
  expect(result.statusBarItemsRight).toEqual([])
})

test('loadContent should return empty array when preference is false', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'statusBar.itemsVisible') {
        return false
      }
      return undefined
    },
  })

  const state: StatusBarState = { ...createDefaultState(), uid: 2 }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations).toEqual([
    {
      method: 'Preferences.get',
      args: ['statusBar.itemsVisible'],
    },
  ])

  expect(result.statusBarItemsLeft).toEqual([])
  expect(result.uid).toBe(2)
  expect(result.statusBarItemsRight).toEqual([])
})

test('loadContent should return empty array when preference is undefined', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => undefined,
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [],
  })

  const state: StatusBarState = { ...createDefaultState(), uid: 3 }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations).toEqual([
    {
      method: 'Preferences.get',
      args: ['statusBar.itemsVisible'],
    },
    {
      method: 'ExtensionHostManagement.activateByEvent',
      args: [ExtensionHostActivationEvent.OnStatusBarItem],
    },
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([
    {
      method: ExtensionHostCommandType.GetStatusBarItems,
      args: [],
    },
  ])

  expect(result.statusBarItemsLeft).toEqual([
    {
      command: '',
      icon: '',
      name: 'Notifications',
      text: 'Notifications',
      tooltip: '',
    },
    {
      command: '',
      icon: '',
      name: 'Problems',
      text: 'Problems',
      tooltip: '',
    },
  ])
  expect(result.uid).toBe(3)
  expect(result.statusBarItemsRight).toEqual([])
})

test('loadContent should preserve existing state properties', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'Preferences.get': async () => {},
      'ExtensionHostManagement.activateByEvent': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'getPreference' || method === 'Preferences.get') {
        return false
      }
      throw new Error(`unexpected method ${method}`)
    },
  })

  const state: StatusBarState & { disposed?: boolean } = {
    ...createDefaultState(),
    disposed: true,
    uid: 4,
  }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations.length).toBeGreaterThan(0)

  expect(result.uid).toBe(4)
  expect(result.disposed).toBe(true)
  expect(result.statusBarItemsLeft).toEqual([])
})

test('loadContent should handle multiple status bar items', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    commandMap: {
      'Preferences.get': async () => {},
      'ExtensionHostManagement.activateByEvent': async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === 'getPreference' || method === 'Preferences.get') {
        return true
      }
      if (method === 'activateByEvent' || method === 'ExtensionHostManagement.activateByEvent') {
        return undefined
      }
      throw new Error(`unexpected method ${method}`)
    },
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    commandMap: {
      [ExtensionHostCommandType.GetStatusBarItems]: async () => {},
    },
    invoke: (method: string, ...args: ReadonlyArray<any>) => {
      if (method === ExtensionHostCommandType.GetStatusBarItems) {
        return [
          {
            command: 'command1',
            icon: 'icon1',
            id: 'item1',
            text: 'Item 1',
            tooltip: 'Tooltip 1',
          },
          {
            command: 'command2',
            icon: 'icon2',
            id: 'item2',
            text: 'Item 2',
            tooltip: 'Tooltip 2',
          },
        ]
      }
      throw new Error(`unexpected method ${method}`)
    },
  })

  const state: StatusBarState = { ...createDefaultState(), uid: 5 }
  const result = await LoadContent.loadContent(state)

  expect(mockRendererRpc.invocations.length).toBeGreaterThan(0)
  expect(mockExtensionHostRpc.invocations.length).toBeGreaterThan(0)

  expect(result.statusBarItemsLeft).toEqual([
    {
      command: 'command1',
      icon: 'icon1',
      name: 'item1',
      text: 'Item 1',
      tooltip: 'Tooltip 1',
    },
    {
      command: 'command2',
      icon: 'icon2',
      name: 'item2',
      text: 'Item 2',
      tooltip: 'Tooltip 2',
    },
    {
      command: '',
      icon: '',
      name: 'Notifications',
      text: 'Notifications',
      tooltip: '',
    },
    {
      command: '',
      icon: '',
      name: 'Problems',
      text: 'Problems',
      tooltip: '',
    },
  ])
})
