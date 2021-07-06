import { useState, useEffect } from 'react'

export function useListOfMediaDevices(stream) {
  const [devices, setDevices] = useState({})

  useEffect(() => getDevices(setDevices), [stream])
  useEffect(() => {
    navigator.mediaDevices.ondevicechange = () => getDevices(setDevices)
  }, [setDevices])

  return devices
}

export function getVideoSource(callback) {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(callback)
    .catch(console.error)
}

function getDevices(callback) {
  navigator.mediaDevices
    .enumerateDevices()
    .catch(console.error)
    .then(sortDevicesByKind)
    .then(callback)
}

function sortDevicesByKind(devices) {
  return devices.reduce(
    (sortedDevices, device) => {
      const deviceGroup = sortedDevices[camelCase(device.kind)]
      deviceGroup.push(device)
      return sortedDevices
    },
    { audioInput: [], audioOutput: [], videoInput: [] }
  )

  function camelCase(str) {
    return str.replace('input', 'Input').replace('output', 'Output')
  }
}

export function getAndSetStream(audioInputId, videoInputId, callback) {
  navigator.mediaDevices
    .getUserMedia({
      audio: { deviceId: audioInputId || 'default' },
      video: { deviceId: videoInputId || 'default' },
    })
    .then(callback)
}

export function stopCurrentStream(stream) {
  if (stream) stopMediaTracks(stream)
}

export function stopMediaTracks(stream) {
  stream.getTracks().forEach((track) => {
    track.stop()
  })
}

export function attachAudioOutput(sinkId, Element) {
  if (typeof Element.sinkId !== 'undefined')
    Element.setSinkId(sinkId)
      .then(() => console.log('switched audio: ', sinkId))
      .catch(console.error)
}
