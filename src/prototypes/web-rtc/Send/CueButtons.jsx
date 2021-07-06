import React from 'react'

export function Off({ sendCue }) {
  return (
    <button
      onClick={sendCue}
      type="button"
      className="control-button"
      id="offButton"
    >
      Off
    </button>
  )
}

export function Fade({ sendCue }) {
  return (
    <button
      onClick={sendCue}
      type="button"
      className="control-button"
      id="fadeButton"
    >
      Fade
    </button>
  )
}

export function Go({ sendCue }) {
  return (
    <button
      onClick={sendCue}
      type="button"
      className="control-button"
      id="goButton"
    >
      Go
    </button>
  )
}

export function Standby({ sendCue }) {
  return (
    <button
      onClick={sendCue}
      type="button"
      className="control-button"
      id="resetButton"
    >
      Reset
    </button>
  )
}
