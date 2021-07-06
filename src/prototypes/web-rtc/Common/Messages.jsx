import React from 'react'
import { useState } from 'react'

export function MessageBox({ sendMessage }) {
  const [message, setMessage] = useState('')
  const sendThisMessage = () => {
    sendMessage(message)
    setMessage('')
  }

  return (
    <>
      <SendMessageBox
        message={message}
        setMessage={setMessage}
        sendThisMessage={sendThisMessage}
      />
      <SendButton sendThisMessage={sendThisMessage} />
    </>
  )
}

function SendMessageBox({ message, setMessage, sendThisMessage }) {
  return (
    <input
      type="text"
      id="sendMessageBox"
      placeholder="Enter a message..."
      autoFocus={true}
      value={message}
      onChange={({ target }) => setMessage(target.value)}
      onKeyUp={(e) => e.key === 'Enter' && sendThisMessage()}
    />
  )
}

function SendButton({ sendThisMessage }) {
  return (
    <button type="button" id="sendButton" onClick={sendThisMessage}>
      Send
    </button>
  )
}

export function Messages({ messages }) {
  return (
    <div className="message" id="message">
      {messages?.map((message) => (
        <Message key={message.timestamp.toJSON()} message={message} />
      ))}
    </div>
  )
}

function Message({ message }) {
  const sourceClassName = getSourceClassName(message.source)
  const [hours, minutes, seconds] = formatTime(message.timestamp)

  return (
    <div key={message.source + message.content}>
      <span className="msg-time">{`${hours}:${minutes}:${seconds}`}</span>
      {' - '}
      <span className={sourceClassName}>{`${message.source}: `}</span>
      {message.content}
    </div>
  )
}

function getSourceClassName(source) {
  if (source === 'Cue') return 'cueMsg'
  if (source === 'Peer') return 'peerMsg'
  if (source === 'Self') return 'selfMsg'
}

function formatTime(dateObj) {
  return ['getHours', 'getMinutes', 'getSeconds']
    .map((method) => dateObj[method]())
    .map(formatToDoubleDigits)
}

function formatToDoubleDigits(t) {
  if (t < 10) return '0' + t
  return t
}

export function ClearMsgsButton() {
  return (
    <button type="button" id="clearMsgsButton">
      Clear Msgs (Local)
    </button>
  )
}
