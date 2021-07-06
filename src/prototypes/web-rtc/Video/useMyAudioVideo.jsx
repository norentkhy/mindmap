import {
  useListOfMediaDevices,
  getVideoSource,
  getAndSetStream,
  stopCurrentStream,
} from './media-devices'
import { useState, useEffect, useRef } from 'react'

export default function useMyAudioVideo() {
  const [state, setState] = useState({
    myStream: null,
    theirStream: null,
    isMuted: false,
    audio: {
      volume: 0.0,
    },
    selectedDeviceIds: {
      audioInput: null,
      audioOutput: null,
      videoInput: null,
    },
  })
  const myVideoRef = useRef()
  const theirVideoRef = useRef()
  const bound = bindActions(setState, myVideoRef)

  const { audioInput, videoInput } = state.selectedDeviceIds
  const devices = useListOfMediaDevices(state.myStream)

  useEffect(() => getVideoSource(bound.setMediaSource), [])
  useEffect(() => {
    getAndSetStream(audioInput, videoInput, bound.setMediaSource)
  }, [audioInput, videoInput])
  useEffect(() => {
    myVideoRef.current.volume = state.audio.volume
  }, [state.audio.volume])

  const setMyVolume = (v) =>
    setState((s) => ({ ...s, audio: { ...s.audio, volume: v } }))

  const setTheirStream = (theirStream) =>
    setState((s) => ({ ...s, theirStream }))

  useEffect(() => {
    if (state.theirStream && 'srcObject' in theirVideoRef.current)
      theirVideoRef.current.srcObject = state.theirStream
  }, [state.theirStream])

  return {
    state,
    bound,
    myVideoRef,
    theirVideoRef,
    devices,
    setMyVolume,
    setTheirStream,
  }
}

function bindActions(setState, videoRef) {
  return Object.entries(actionSpecification).reduce(
    (boundAction, [actionName, unboundAction]) => {
      boundAction[actionName] = (...args) =>
        unboundAction(...args, { setState, videoRef })
      return boundAction
    },
    {}
  )
}

const actionSpecification = {
  setAudioInput,
  toggleMute,
  setVideoInput,
  setMediaSource,
}

function toggleMute(_, { setState }) {
  setState((state) => ({ ...state, isMuted: !state.isMuted }))
}

function setVideoInput(deviceId, { setState }) {
  setState((state) => ({
    ...state,
    selectedDeviceIds: { ...state.selectedDeviceIds, videoInput: deviceId },
  }))
}

function setAudioInput(deviceId, { setState }) {
  setState((state) => ({
    ...state,
    selectedDeviceIds: { ...state.selectedDeviceIds, audioInput: deviceId },
  }))
}

function setMediaSource(myStream, { videoRef, setState }) {
  stopCurrentStream(videoRef.current.srcObject)
  videoRef.current.srcObject = myStream
  setState((state) => ({ ...state, myStream }))
}
