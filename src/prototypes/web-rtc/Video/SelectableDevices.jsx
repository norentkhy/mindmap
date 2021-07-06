import React, { useState, useEffect, useRef } from 'react'

export default function SelectableDevices({
  selectVideoInput,
  selectAudioInput,
  selectAudioOutput,
  videoInputDevices,
  audioInputDevices,
  audioOutputDevices,
}) {
  return (
    <div>
      {videoInputDevices && (
        <DeviceSelection
          select={selectVideoInput}
          label="video input"
          devices={videoInputDevices}
        />
      )}
      {audioInputDevices && (
        <DeviceSelection
          select={selectAudioInput}
          label="audio input"
          devices={audioInputDevices}
        />
      )}
      {audioOutputDevices && (
        <DeviceSelection
          label="audio output"
          devices={audioOutputDevices}
          select={selectAudioOutput}
        />
      )}
    </div>
  )
}

function DeviceSelection({ label, devices, select }) {
  const [defaultDevice, actualDevices] = splitDefault(devices)
  const [targetId, setTargetId] = useState('')
  const isFirst = useFirstRender()

  useEffect(() => {
    if (!isFirst && targetId.length && typeof select === 'function')
      select(targetId)
  }, [targetId])

  return (
    <div>
      {`${label}: `}
      {!actualDevices.length && defaultDevice.label}
      {actualDevices.length && (
        <select
          value={targetId}
          onChange={({ target }) => setTargetId(target.value)}
        >
          {actualDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

function splitDefault(devices) {
  if (devices.some((device) => device.deviceId.startsWith('default')))
    return [devices[0], devices.slice(1)]

  return [devices[0], devices]
}

function useFirstRender() {
  const countRef = useRef(0)
  countRef.current++
  return countRef.current === 1
}
