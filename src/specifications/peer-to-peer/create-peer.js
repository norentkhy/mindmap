import PeerJs from 'peerjs'

export default function createPeer({ Peer = PeerJs }) {
  const peer = new Peer()
  return new Promise((resolve) =>
    peer.on('open', (id) =>
      resolve({
        id,
        setCallHandler: (callHandler, localStreamObj) =>
          setupCallHandler(callHandler, { peer, localStreamObj }),
        call: (id, localStreamObj, timeout) =>
          call(id, { peer, localStreamObj, timeout }),
        setConnectionRequestHandler: (requestHandler) =>
          setConnectionRequestHandler(requestHandler, { peer }),
        createConnection: (id) => createPeerConnection(id, { peer }),
      })
    )
  )
}

function createPeerConnection(targetId, { peer }) {
  const connection = peer.connect(targetId)
  return new Promise((resolve, reject) => {
    connection.on('error', (error) => reject(error))
    connection.on('open', () => {
      connection.on('disconnected', () => peer.reconnect())
      resolve({
        sendMessage: (message) => sendMessage(message, { connection }),
        setMessageHandler: (handleMessage) =>
          setMessageHandler(handleMessage, { connection }),
      })
    })
  })
}

function setConnectionRequestHandler(handleRequest, { peer }) {
  peer.on('connection', handleRequest)
}

function setMessageHandler(handleMessage, { connection }) {
  connection.on('data', handleMessage)
}

function sendMessage(message, { connection }) {
  connection.send(message)
}

function call(theirId, { peer, localStreamObj, timeout = 5000 }) {
  return new Promise(resolveIfNotTimedOut)

  function resolveIfNotTimedOut(resolve, reject) {
    const call = peer.call(theirId, localStreamObj)
    const t = setTimeout(() => reject({ type: 'response-timeout' }), timeout)
    call.on('stream', (...args) => {
      window.clearTimeout(t)
      resolve(...args)
    })
  }
}

function setupCallHandler(handleCall, { peer, localStreamObj }) {
  peer.on('call', (call) => {
    const answerCall = () => call.answer(localStreamObj)
    handleCall(answerCall)
  })
}
