import React from 'react'

export function Off({ isActive }) {
  const className = `display-box  ${isActive ? 'off' : 'hidden'}`
  return (
    <td className={className} id="off">
      <h2>All Off</h2>
    </td>
  )
}

export function Fade({ isActive }) {
  const className = `display-box  ${isActive ? 'fade' : 'hidden'}`
  return (
    <td className={className} id="fade">
      <h2>Fade</h2>
    </td>
  )
}

export function Go({ isActive }) {
  const className = `display-box  ${isActive ? 'go' : 'hidden'}`
  return (
    <td className={className} id="go">
      <h2>Go</h2>
    </td>
  )
}

export function Standby({ isActive }) {
  const className = `display-box  ${isActive ? 'standby' : 'hidden'}`
  return (
    <td className={className} id="standby">
      <h2>Standby</h2>
    </td>
  )
}
