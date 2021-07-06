export default {
  mutateConnectionSpecsOnOpen: workAroundOnOpenReconnectionMutation,
  mutateConnectionSpecsOnDisconnect:
    workAroundOnDisconnectedReconnectionMutation,
  mutateConnectionSpecsOnClose: destroyConnectionWorkAround,
  closePreviousConnection,
  updateConn,
  resetConn,
}

function workAroundOnOpenReconnectionMutation(ref) {
  if (ref.peer.id === null) {
    console.log('Received null id from peer open')
    ref.peer.id = ref.lastPeerId
  } else {
    ref.lastPeerId = ref.peer.id
  }
}

function workAroundOnDisconnectedReconnectionMutation(ref) {
  ref.peer.id = ref.lastPeerId
  ref.peer._lastServerId = ref.lastPeerId
  ref.peer.reconnect()
}

function destroyConnectionWorkAround(ref) {
  ref.conn = null
}

function closePreviousConnection(ref) {
  if (ref.conn) {
    ref.conn.close()
  }
}

function updateConn(ref, c) {
  ref.conn = c
}

function resetConn(ref) {
  ref.conn = null
}
