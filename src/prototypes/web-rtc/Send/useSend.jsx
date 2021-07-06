import useSendState, { KEY } from './useSendState'
import useMyAudioVideo from '../Video/useMyAudioVideo'
import CommonPeer from '../common-peer'
import WorkAround from '../workaround'
import { useRef, useEffect } from 'react'

export default function useSend() {
  const ref = useRef({
    lastPeerId: null,
    peer: null,
    peerId: null,
    conn: null,
    state: null,
    theirId: null,
    myStream: null,
    theirStream: null,
  })
  const [state, updateState] = useSendState()

  const myAudioVideoModel = useMyAudioVideo()

  useEffect(() => {
    ref.current.myStream = myAudioVideoModel.state.myStream
  }, [myAudioVideoModel.state.myStream])

  useEffect(() => initSend(ref.current, updateState), [])

  return {
    state,
    myAudioVideoModel,
    connectToId: (id) => {
      ref.current.theirId = id
      connectToId(id, ref.current, updateState)
    },
    call: () => {
      console.log(`calling id: ${ref.current.theirId}`)
      console.log(ref)
      const thisCall = ref.current.peer.call(
        ref.current.theirId,
        ref.current.myStream
      )
      thisCall.on('stream', myAudioVideoModel.setTheirStream)
    },
    sendCue: (type) =>
      sendCue(type, ref.current, (type) => updateState(CUE, type)),
    sendMessage: (message) =>
      sendMessage(message, ref.current, (message) =>
        updateState(MESSAGE_FROM_SELF, message)
      ),
  }
}

function initSend(ref, updateState) {
  ref.peer = CommonPeer.createWithSharedPeerServer()
  setupSenderResponse(ref, updateState)
}

function setupSenderResponse(ref, updateState) {
  ref.peer.on('connection', (c) => {
    CommonPeer.rejectOthers(c, 'Already connected to another client')
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
}

function reportError(err) {
  console.log(err)
  alert('' + err)
}

function connectToId(id, ref, updateState) {
  WorkAround.closePreviousConnection(ref)
  connectWithPeer(id, ref)

  ref.conn.on('open', () => {
    updateState(CONNECTION_ESTABLISHED)
    sendCommandsInUrlParams(ref)
  })
  ref.conn.on('data', (data) => updateState(MESSAGE_FROM_PEER, data))
  ref.conn.on('close', () => updateState(CONNECTION_DESTROYED))
}

function connectWithPeer(id, ref) {
  ref.conn = ref.peer.connect(id, { reliable: true })
}

function sendMessage(message, { conn }, callbackMessage) {
  sendIfConnectionOpen(() => {
    conn.send(message)
    callbackMessage(message)
    console.log('Sent: ' + message)
  }, conn)
}

function sendCue(type, { conn }, callback) {
  sendIfConnectionOpen(() => {
    conn.send(type)
    callback(type)
    console.log(type + ' signal sent')
  }, conn)
}

function sendIfConnectionOpen(callback, conn) {
  if (conn && conn.open) {
    callback()
  } else {
    console.log('Connection is closed')
  }
}

function sendCommandsInUrlParams(ref) {
  var command = getUrlParam('command')
  if (command) ref.conn.send(command)
}

function getUrlParam(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  var regexS = '[\\?&]' + name + '=([^&#]*)'
  var regex = new RegExp(regexS)
  var results = regex.exec(window.location.href)
  if (results == null) return null
  else return results[1]
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
