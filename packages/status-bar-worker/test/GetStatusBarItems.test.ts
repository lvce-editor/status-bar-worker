import { expect, test } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostActivationEvent from '../src/parts/ExtensionHostActivationEvent/ExtensionHostActivationEvent.ts'
import * as ExtensionHostCommandType from '../src/parts/ExtensionHostCommandType/ExtensionHostCommandType.ts'
import * as GetStatusBarItems from '../src/parts/GetStatusBarItems/GetStatusBarItems.ts'

test('getStatusBarItems should return empty array when showItems is false', async () => {
  const result = await GetStatusBarItems.getStatusBarItems(false)
  expect(result).toEqual([])
})

test('getStatusBarItems should return transformed items when showItems is true', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
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

  const result = await GetStatusBarItems.getStatusBarItems(true)

  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])
  expect(result).toEqual([
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
})

test('getStatusBarItems should return empty array when no items are returned', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [],
  })

  const result = await GetStatusBarItems.getStatusBarItems(true)

  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result).toEqual([
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

test('getStatusBarItems should handle null items', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => null,
  })

  const result = await GetStatusBarItems.getStatusBarItems(true)

  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result).toEqual([
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

test('getStatusBarItems should handle undefined items', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => undefined,
  })

  const result = await GetStatusBarItems.getStatusBarItems(true)

  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result).toEqual([
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

test('getStatusBarItems should default missing fields to empty strings', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [
      {
        id: 'item1',
      },
      {
        text: 'Item 2',
      },
    ],
  })

  const result = await GetStatusBarItems.getStatusBarItems(true)

  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result).toEqual([
    {
      command: '',
      icon: '',
      name: 'item1',
      text: '',
      tooltip: '',
    },
    {
      command: '',
      icon: '',
      name: '',
      text: 'Item 2',
      tooltip: '',
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

test('getStatusBarItems should handle multiple items', async () => {
  const mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })

  const mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    [ExtensionHostCommandType.GetStatusBarItems]: async () => [
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
    ],
  })

  const result = await GetStatusBarItems.getStatusBarItems(true)

  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnSourceControl],
    ['ExtensionHostManagement.activateByEvent', ExtensionHostActivationEvent.OnStatusBarItem],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([[ExtensionHostCommandType.GetStatusBarItems]])

  expect(result).toEqual([
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
