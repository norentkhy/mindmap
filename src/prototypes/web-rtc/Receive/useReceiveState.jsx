import { useState } from 'react'

const CONNECTION_ID = 'CONNECTION_ID'
const CONNECTION_LOST = 'CONNECTION_LOST'
const CONNECTION_RESET = 'CONNECTION_RESET'
const CONNECTION_DESTROYED = 'CONNECTION_DESTROYED'
const CONNECTION_ESTABLISHED = 'CONNECTION_ESTABLISHED'

const CUE = 'CUE'
const MESSAGE_FROM_PEER = 'MESSAGE_FROM_PEER'
const MESSAGE_FROM_SELF = 'MESSAGE_FROM_SELF'

export default function useReceiveState() {
  const [state, setState] = useState({ messages: [], lastCue: 'Reset' })
  return [state, (key, data) => updateState(key, data, setState)]
}

function updateState(key, data, setState) {
  const thisStateTransition = transitionState[key](data)
  setState(thisStateTransition)
}

const transitionState = {
  [CUE]: (data) => (state) => ({
    ...state,
    lastCue: data,
    messages: addMessage('Cue', data, state.messages),
  }),
  [MESSAGE_FROM_PEER]: (data) => (state) => ({
    ...state,
    messages: addMessage('Peer', data, state.messages),
  }),
  [MESSAGE_FROM_SELF]: (data) => (state) => ({
    ...state,
    messages: addMessage('Self', data, state.messages),
  }),
  [CONNECTION_ID]: (id) => (state) => ({ ...state, connectionId: id }),
  [CONNECTION_LOST]: () => (state) => ({
    ...state,
    status: 'Connection lost. Please reconnect',
  }),
  [CONNECTION_RESET]: () => (state) => ({
    ...state,
    status: 'Connection reset\nAwaiting connection...',
  }),
  [CONNECTION_DESTROYED]: () => (state) => ({
    ...state,
    status: 'Connection destroyed. Please refresh',
  }),
  [CONNECTION_ESTABLISHED]: () => (state) => ({
    ...state,
    status: 'Connected',
  }),
}

function addMessage(source, content, messages) {
  const timestamp = new Date()
  return [{ source, content, timestamp }, ...messages]
}

export const KEY = {
  CONNECTION_ID,
  CONNECTION_LOST,
  CONNECTION_RESET,
  CONNECTION_DESTROYED,
  CONNECTION_ESTABLISHED,

  CUE,
  MESSAGE_FROM_PEER,
  MESSAGE_FROM_SELF,
}
