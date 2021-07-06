import useReceive from './useReceive'
import { Off, Fade, Go, Standby } from './Cues'
import { Messages, ClearMsgsButton, MessageBox } from '../Common/Messages'
import { AudioVideo } from '../Video/Video'
import React from 'react'

export default function ReceiveView() {
  const { state, sendMessage, myAudioVideoModel } = useReceive()

  return (
    <Layout
      ReceiverId={<ReceiverId id={state.connectionId} />}
      MessageBox={<MessageBox sendMessage={sendMessage} />}
      ClearMsgsButton={<ClearMsgsButton />}
      Message={<Messages messages={state.messages} />}
      Status={<Status status={state.status} />}
      Standby={<Standby isActive={state.lastCue === 'Reset'} />}
      Go={<Go isActive={state.lastCue === 'Go'} />}
      Fade={<Fade isActive={state.lastCue === 'Fade'} />}
      Off={<Off isActive={state.lastCue === 'Off'} />}
      MyVideo={<AudioVideo myAudioVideoModel={myAudioVideoModel} />}
    />
  )
}

function Layout(props) {
  const { ReceiverId, MessageBox, ClearMsgsButton } = props
  const { Status, Message, Standby, Go, Fade, Off } = props
  const { MyVideo } = props

  return (
    <>
      <table className="display">
        <tbody>
          <tr>
            <td className="title">Status:</td>
            <td className="title">Messages:</td>
          </tr>
          <tr>
            <td>{ReceiverId}</td>
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
            {Standby}
            {Go}
          </tr>
          <tr>
            {Fade}
            {Off}
          </tr>
        </tbody>
      </table>
      <div>{MyVideo}</div>
    </>
  )
}

function ReceiverId({ id }) {
  return (
    <>
      <div
        id="receiver-id"
        style={{ fontWeight: 'bold' }}
        title="Copy this ID to the input on send.html."
      >
        ID: {id}
      </div>
      <button
        onClick={() => {
          navigator.clipboard.writeText(id)
        }}
      >
        copy to clipboard
      </button>
    </>
  )
}

function Status({ status }) {
  return (
    <div id="status" className="status">
      {status}
    </div>
  )
}
