import SelectableDevices from './SelectableDevices'
import { attachAudioOutput } from './media-devices'
import React from 'react'

export function AudioVideo({ myAudioVideoModel }) {
  const { state, bound, myVideoRef, theirVideoRef, devices, setMyVolume } =
    myAudioVideoModel

  return (
    <div>
      <div>
        <SelectableDevices
          selectVideoInput={bound.setVideoInput}
          selectAudioInput={bound.setAudioInput}
          selectAudioOutput={(id) => attachAudioOutput(id, myVideoRef.current)}
          videoInputDevices={devices.videoInput}
          audioInputDevices={devices.audioInput}
          audioOutputDevices={devices.audioOutput}
        />
        <button onClick={bound.toggleMute}>
          {state.isMuted ? 'Unmute Output' : 'Mute Output'}
        </button>
        <AudioVolumeSlider value={state.audio.volume} setValue={setMyVolume} />
      </div>

      <video
        ref={myVideoRef}
        autoPlay
        srcobject={state.stream}
        muted={state.isMuted}
      />

      <video ref={theirVideoRef} autoPlay />
    </div>
  )
}

function AudioVolumeSlider({ steps = 100, setValue, value }) {
  return (
    <input
      type="range"
      min="0"
      max={steps}
      value={value * steps}
      onChange={({ target }) => setValue(target.value / steps)}
    />
  )
}
