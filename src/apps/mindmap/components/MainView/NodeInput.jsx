import React, { useEffect, useRef, useState } from 'react'

export default function NodeInput({
  node: {
    text,
    editing,
    focused,
    do: { changeNodeText },
  },
}) {
  const [newText, setNewText] = useState(text)
  const inputRef = useRef()

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  return (
    <input
      aria-label="editing node"
      ref={inputRef}
      value={newText}
      onChange={({ target }) => setNewText(target.value)}
      onFocus={({ target }) => target.select()}
      onKeyUp={({ key }) => key === 'Enter' && changeNodeText(newText)}
    />
  )
}
