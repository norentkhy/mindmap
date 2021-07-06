import Peer from 'peerjs'

export default {
  createWithSharedPeerServer: createPeerObjectWithSharedPeerServer,
  rejectOthers: rejectOtherConnections
}

function createPeerObjectWithSharedPeerServer() {
  return new Peer(null, {
    debug: 2,
  })
}

function rejectOtherConnections(c, message) {
  return c.on('open', function () {
    c.send(message)
    setTimeout(function () {
      c.close()
    }, 500)
  })
}
