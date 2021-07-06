import useReceiveState, { KEY } from './useReceiveState'
import useMyAudioVideo from '../Video/useMyAudioVideo'
import CommonPeer from '../common-peer'
import WorkAround from '../workaround'
import { useRef, useEffect } from 'react'

export default function useReceive() {
  const ref = useRef({
    lastPeerId: null,
    peer: null,
    peerId: null,
    conn: null,
    myStream: null,
    theirStream: null,
  })
  const [state, updateState] = useReceiveState()

  const myAudioVideoModel = useMyAudioVideo()

  useEffect(() => {
    ref.current.myStream = myAudioVideoModel.state.myStream
  }, [myAudioVideoModel.state.myStream])

  useEffect(() => initReceive(ref.current, updateState), [])

  return {
    state,
    myAudioVideoModel,
    sendMessage: (message) =>
      sendMessage(message, ref.current, (message) =>
        updateState(MESSAGE_FROM_SELF, message)
      ),
  }
}

function initReceive(ref, updateState) {
  ref.peer = CommonPeer.createWithSharedPeerServer()
  setupReceiverResponse(ref, updateState, () =>
    setupResponseToState(ref, updateState)
  )
}

function setupResponseToState(ref, updateState) {
  ref.conn.on('data', (data) => mapDataToState(data, updateState))
  ref.conn.on('close', () => {
    updateState(CONNECTION_RESET)
    WorkAround.resetConn(ref)
  })
}

function mapDataToState(data, updateState) {
  const signals = ['Go', 'Fade', 'Off', 'Reset']
  if (signals.includes(data)) return updateState(CUE, data)
  return updateState(MESSAGE_FROM_PEER, data)
}

function setupReceiverResponse(ref, updateState, setupBussinessRules) {
  ref.peer.on('connection', (c) => {
    if (ref.conn && ref.conn.open)
      CommonPeer.rejectOthers(c, 'Already connected to another client')

    WorkAround.updateConn(ref, c)
    updateState(CONNECTION_ESTABLISHED)
    setupBussinessRules()
  })

  ref.peer.on('open', (id) => {
    WorkAround.mutateConnectionSpecsOnOpen(ref)
    updateState(CONNECTION_ID, id)
  })
  ref.peer.on('disconnected', () => {
    updateState(CONNECTION_LOST)
    WorkAround.mutateConnectionSpecsOnDisconnect(ref)
  })
  ref.peer.on('close', () => {
    WorkAround.mutateConnectionSpecsOnClose(ref)
    updateState(CONNECTION_DESTROYED)
  })
  ref.peer.on('error', reportError)

  ref.peer.on('call', (thisCall) => {
    console.log(ref)
    thisCall.answer(ref.myStream)
    thisCall.on('stream', console.log)
  })
}

function reportError(err) {
  console.log(err)
  alert('' + err)
}

function sendMessage(message, { conn }, callbackMessage) {
  if (conn && conn.open) {
    conn.send(message)
    callbackMessage(message)
    console.log('Sent: ' + message)
  } else {
    console.log('Connection is closed')
  }
}

const {
  CONNECTION_ID,
  CONNECTION_LOST,
  CONNECTION_RESET,
  CONNECTION_DESTROYED,
  CONNECTION_ESTABLISHED,

  CUE,
  MESSAGE_FROM_PEER,
  MESSAGE_FROM_SELF,
} = KEY
