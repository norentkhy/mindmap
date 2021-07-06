import React, { useState } from 'react'
import ReceiveView from './Receive/ReceiveView'
import SendView from './Send/SendView'

export default function App() {
  const { viewMode, toggleViewMode } = useViewToggle()
  return (
    <div>
      <div>
        <div>Current View: {viewMode}</div>
        <button onClick={toggleViewMode}>Toggle View</button>
      </div>
      <div>
        {viewMode === SEND && <SendView />}
        {viewMode === RECEIVE && <ReceiveView />}
      </div>
    </div>
  )
}

function useViewToggle() {
  const [viewMode, setViewMode] = useState(SEND)
  return { viewMode, toggleViewMode: () => setViewMode(swapViewMode) }
}

function swapViewMode(str) {
  if (str === RECEIVE) return SEND
  return RECEIVE
}

const SEND = 'SEND'
const RECEIVE = 'RECEIVE'
