import createPeer from './create-peer'
import { createMockFn } from 'src/test-utils/dependencies'
import { mapObject } from 'src/utils/FunctionalProgramming'

test('create a peer node', async () => {
  const id = 'some id'
  const PeerResponse = createPeerResponseWithId(id)
  const peer = await createPeer({ Peer: PeerResponse })
  expect(peer.id).toBe(id)

  function createPeerResponseWithId(id) {
    return wrapAsMockConstructor({
      on: (key, callback) =>
        key === 'open' && setTimeout(() => callback(id), 1),
    })
  }
})

describe('send connection request', () => {
  test('peer available', async () => {
    const id = 'id of accepting peer'
    const PeerResponse = createPeerResponseThatAcceptsConnectionRequest()
    const { createConnection } = await createPeer({ Peer: PeerResponse })
    const connection = await createConnection(id)
    expect(connection).toMatchObject({})

    function createPeerResponseThatAcceptsConnectionRequest() {
      return wrapAsMockConstructor({
        on: (key, callback) =>
          key === 'open' && delay(() => callback('local id')),
        connect: (_id) => ({
          on: (key, callback) => key === 'open' && delay(callback),
        }),
      })
    }
  })

  test('peer unavailable', async () => {
    expect.assertions(1)
    const id = 'id of unavailable peer'
    const errorType = 'peer-unavailable'
    const PeerResponse =
      createPeerResponseThatThrowsOnConnectionRequest(errorType)
    const { createConnection } = await createPeer({ Peer: PeerResponse })
    await expect(createConnection(id)).rejects.toMatchObject({
      type: errorType,
    })

    function createPeerResponseThatThrowsOnConnectionRequest(errorType) {
      return wrapAsMockConstructor({
        on: (key, callback) => key === 'open' && delay(() => callback(id)),
        connect: (_id) => ({
          on: (key, callback) =>
            key === 'error' &&
            delay(() => callback(createPeerJsResponseError(errorType))),
        }),
      })
    }
  })

  test('attempt to reconnect when disconnected', async () => {
    const id = 'id of some peer'
    const { PeerResponse, reconnection, reconnect } =
      createResponseThatAwaitsReconnection()
    const { createConnection } = await createPeer({ Peer: PeerResponse })
    createConnection(id)
    await reconnection
    expect(reconnect).toBeCalledTimes(1)

    function createResponseThatAwaitsReconnection() {
      const [reconnect, reconnection] = createMockAsyncFn()
      const PeerResponse = wrapAsMockConstructor({
        on: (key, callback) => key === 'open' && delay(() => callback(id)),
        connect: (_id) => ({
          on: (key, callback) => {
            key === 'open' && delay(callback)
            key === 'disconnected' && delay(callback)
          },
        }),
        reconnect,
      })

      return { PeerResponse, reconnection, reconnect }
    }
  })
})

test('handle connection request', async () => {
  let requestConnection
  const PeerResponse = createResponseThatRequestsConnection()
  const { setConnectionRequestHandler } = await createPeer({
    Peer: PeerResponse,
  })
  const handleConnectionRequest = createMockFn()
  setConnectionRequestHandler(handleConnectionRequest)

  expect(handleConnectionRequest).toBeCalledTimes(0)
  requestConnection()
  expect(handleConnectionRequest).toBeCalledTimes(1)

  function createResponseThatRequestsConnection() {
    return wrapAsMockConstructor({
      on: (key, callback) => {
        key === 'open' && delay(() => callback('id of connection receiver'))
        if (key === 'connection') requestConnection = callback
      },
    })
  }
})

test('handle messages', async () => {
  const id = 'id of message receiver'
  let receiveMessage
  const PeerResponse = createPeerThatReceivesMessage()
  const { createConnection } = await createPeer({ Peer: PeerResponse })
  const { setMessageHandler } = await createConnection(id)
  const handleMessage = createMockFn()
  setMessageHandler(handleMessage)

  expect(handleMessage).toBeCalledTimes(0)

  receiveMessage('hi')
  expect(handleMessage).nthCalledWith(1, 'hi')

  receiveMessage({ some: 'thing' })
  expect(handleMessage).nthCalledWith(2, { some: 'thing' })

  function createPeerThatReceivesMessage() {
    return wrapAsMockConstructor({
      on: (key, callback) => key === 'open' && delay(() => callback(id)),
      connect: (_id) => ({
        on: (key, callback) => {
          key === 'open' && delay(callback)
          key === 'data' && (receiveMessage = callback)
        },
      }),
    })
  }
})

test('send messages', async () => {
  const id = 'id of message receiver'
  const receiveSentMessage = createMockFn()

  const PeerResponse =
    createPeerResponseThatReceivesMessages(receiveSentMessage)
  const { createConnection } = await createPeer({ Peer: PeerResponse })
  const { sendMessage } = await createConnection(id)

  sendMessage('hi')
  expect(receiveSentMessage).nthCalledWith(1, 'hi')

  sendMessage({ some: 'thing' })
  expect(receiveSentMessage).nthCalledWith(2, { some: 'thing' })

  function createPeerResponseThatReceivesMessages(receiveSentMessage) {
    return wrapAsMockConstructor({
      on: (key, callback) => key === 'open' && delay(() => callback(id)),
      connect: (_id) => ({
        on: (key, callback) => {
          key === 'open' && delay(callback)
        },
        send: receiveSentMessage,
      }),
    })
  }
})

describe('calls', () => {
  test('sending a call request: call accepted', async () => {
    const remoteId = 'id of message receiver'
    const remoteStreamObj = { this: 'represents their stream' }
    const localStreamObj = { this: 'represents my stream' }

    const PeerResponse = createPeerResponseThatAcceptsCalls(remoteStreamObj)
    const { call } = await createPeer({ Peer: PeerResponse })
    const streamObj = await call(remoteId, localStreamObj)
    expect(streamObj).toEqual(remoteStreamObj)

    function createPeerResponseThatAcceptsCalls(remoteStreamObj) {
      return wrapAsMockConstructor({
        on: (key, callback) => key === 'open' && delay(() => callback('my id')),
        call: (_theirId, _myStream) => ({
          on: (key, callback) =>
            key === 'stream' && delay(() => callback(remoteStreamObj)),
        }),
      })
    }
  })

  test('sending a call request: call timed out', async () => {
    expect.assertions(1)
    const remoteId = 'id of message receiver'
    const localStreamObj = { this: 'represents a local stream' }
    const PeerResponse = createPeerResponseThatDoesNotRespondToCall()
    const { call } = await createPeer({ Peer: PeerResponse })
    await expect(call(remoteId, localStreamObj, 20)).rejects.toEqual({
      type: 'response-timeout',
    })

    function createPeerResponseThatDoesNotRespondToCall() {
      return wrapAsMockConstructor({
        on: (key, callback) => key === 'open' && delay(() => callback('my id')),
        call: (_theirId, _myStream) => ({ on: () => {} }),
      })
    }
  })

  test('handle receiving a call request', async () => {
    let requestCall
    const remoteStreamObj = { this: 'represents their stream' }
    const localStreamObj = { this: 'represents my stream' }
    const handleCallAnswer = createMockFn()

    const PeerResponse = createPeerResponseThatRequestsCall()
    const { setCallHandler } = await createPeer({ Peer: PeerResponse })

    let answerCall
    const handleCall = createMockFn((x) => (answerCall = x))
    setCallHandler(handleCall, localStreamObj)

    requestCall()
    expect(handleCall).toBeCalledTimes(1)

    answerCall()
    expect(handleCallAnswer).nthCalledWith(1, localStreamObj)

    function createPeerResponseThatRequestsCall() {
      return wrapAsMockConstructor({
        on: (key, callback) => {
          key === 'open' && delay(() => callback('my id'))
          key === 'call' &&
            (requestCall = () => callback({ answer: handleCallAnswer }))
        },
        call: (_theirId, _myStream) => ({
          on: (key, callback) => key === 'stream' && callback(remoteStreamObj),
        }),
      })
    }
  })
})

function delay(callback) {
  setTimeout(callback, 1)
}

function createMockAsyncFn(fn = () => {}) {
  let mockFn
  const promise = new Promise((resolve) => {
    mockFn = createMockFn((...args) => resolve(fn(...args)))
  })
  return [mockFn, promise]
}

function wrapAsMockConstructor(obj) {
  return constructMock

  function constructMock() {
    return mapObject(obj, (x) => {
      if (x instanceof Function) return createMockFn(x)
      return x
    })
  }
}

const peerJSResponseErrors = {
  ['browser-incompatible']:
    "The client's browser does not support some or all WebRTC features that you are trying to use.",
  ['disconnected']:
    "You've already disconnected this peer from the server and can no longer make any new connections on it.",
  ['invalid-id']:
    'The ID passed into the Peer constructor contains illegal characters.',
  ['invalid-key']:
    'The API key passed into the Peer constructor contains illegal characters or is not in the system (cloud server only).',
  ['network']:
    'Lost or cannot establish a connection to the signalling server.',
  ['peer-unavailable']: "The peer you're trying to connect to does not exist.",
  ['ssl-unavailable']:
    'Peer is being used securely, but the cloud server does not support SSL. Use a custom PeerServer.',
  ['server-error']: 'Unable to reach the server.',
  ['socket-error']: 'An error from the underlying socket.',
  ['socket-closed']: 'The underlying socket closed unexpectedly.',
  ['unavailable-id']:
    'The ID passed into the Peer constructor is already taken.',
  ['webrtc']: 'Native WebRTC errors.',
}

function createPeerJsResponseError(key) {
  return {
    type: key,
    message: peerJSResponseErrors[key],
  }
}
