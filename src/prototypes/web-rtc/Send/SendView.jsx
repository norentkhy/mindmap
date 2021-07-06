import useSend from './useSend'
import { Off, Fade, Go, Standby } from './CueButtons'
import { Messages, ClearMsgsButton, MessageBox } from '../Common/Messages'
import { AudioVideo } from '../Video/Video'
import React, { useState } from 'react'

export default function SendView() {
  const { state, call, connectToId, sendMessage, sendCue, myAudioVideoModel } =
    useSend()

  return (
    <Layout
      ConnectToId={<ConnectToId connectToId={connectToId} />}
      MessageBox={<MessageBox sendMessage={sendMessage} />}
      ClearMsgsButton={<ClearMsgsButton />}
      Message={<Messages messages={state.messages} />}
      Status={<Status status={state.status} />}
      Standby={<Standby sendCue={() => sendCue('Reset')} />}
      Go={<Go sendCue={() => sendCue('Go')} />}
      Fade={<Fade sendCue={() => sendCue('Fade')} />}
      Off={<Off sendCue={() => sendCue('Off')} />}
      CallButton={<button onClick={call}>Call</button>}
      MyVideo={<AudioVideo myAudioVideoModel={myAudioVideoModel} />}
    />
  )
}

function Layout(props) {
  const { ConnectToId, MessageBox, ClearMsgsButton } = props
  const { Status, Message, Standby, Go, Fade, Off } = props
  const { MyVideo, CallButton } = props

  return (
    <>
      <h1>Peer-to-Peer Cue System --- Sender</h1>
      <table className="control">
        <tbody>
          <tr>
            <td className="title">Status:</td>
            <td className="title">Messages:</td>
          </tr>
          <tr>
            <td>{ConnectToId}</td>
            <td>
              {MessageBox}
              {ClearMsgsButton}
            </td>
          </tr>
          <tr>
            <td>{Status}</td>
            <td>{Message}</td>
          </tr>
          <tr>
            <td>{Standby}</td>
            <td>{Go}</td>
          </tr>
          <tr>
            <td>{Fade}</td>
            <td>{Off}</td>
          </tr>
        </tbody>
      </table>
      <div>
        {CallButton}
        <div>{MyVideo}</div>
      </div>
    </>
  )
}

function ConnectToId({ connectToId }) {
  const [id, setId] = useState('')
  return (
    <>
      <span style={{ fontWeight: 'bold' }}>ID: </span>
      <input
        type="text"
        id="receiver-id"
        title="Input the ID from receive.html"
        value={id}
        onChange={({ target }) => setId(target.value)}
      />
      <button id="connect-button" onClick={() => connectToId(id)}>
        Connect
      </button>
      <button onClick={() => connectToClipboardId(setId, connectToId)}>
        Connect from clipboard
      </button>
    </>
  )
}

function connectToClipboardId(setId, connectToId) {
  return navigator.clipboard
    .readText()
    .then((text) => {
      setId(text)
      connectToId(text)
    })
    .catch(console.error)
}

function Status({ status }) {
  return (
    <div id="status" className="status">
      {status}
    </div>
  )
}
