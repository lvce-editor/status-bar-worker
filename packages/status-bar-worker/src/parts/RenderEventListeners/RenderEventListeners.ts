import { EventExpression } from '@lvce-editor/constants'
import type { DomEventListener } from '../DomEventListener/DomEventListener.ts'
import * as DomEventListenersFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'

export const renderEventListeners = (): readonly DomEventListener[] => {
  return [
    {
      name: DomEventListenersFunctions.HandleWheel,
      params: ['handleWheel', EventExpression.DeltaMode, EventExpression.DeltaY],
      passive: true,
    },
    {
      name: DomEventListenersFunctions.HandleFocus,
      params: ['handleFocus'],
    },
    {
      name: DomEventListenersFunctions.HandleClickAt,
      params: ['handleClickAt', EventExpression.ClientX, EventExpression.ClientY, EventExpression.TargetName],
    },
    {
      name: DomEventListenersFunctions.HandleMouseOverAt,
      params: ['handleMouseOverAt', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleMouseOver,
      params: ['handleMouseOver', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleMouseOutAt,
      params: ['handleMouseOutAt', EventExpression.ClientX, EventExpression.ClientY],
    },
    {
      name: DomEventListenersFunctions.HandleInput,
      params: ['handleInput', EventExpression.TargetValue],
    },
    {
      name: DomEventListenersFunctions.HandleContextMenu,
      params: ['handleContextMenu', EventExpression.Button, EventExpression.ClientX, EventExpression.ClientY],
      preventDefault: true,
    },
    {
      name: DomEventListenersFunctions.HandleWheel,
      params: ['handleWheel', EventExpression.DeltaMode, EventExpression.DeltaY],
      passive: true,
    },
    {
      name: DomEventListenersFunctions.HandleClickAction,
      params: ['handleActionClick', EventExpression.TargetName],
    },
  ]
}
