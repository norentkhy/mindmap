import React, { useContext, useEffect, useRef, useState } from 'react'

export default function NodeInput({
  node: { id, text, editing },
  theProjectContext,
}) {
  const [newText, setNewText] = useState(text)
  const inputRef = useRef()

  const { finalizeEditNode } = useContext(theProjectContext)

  useEffect(() => {
    editing && inputRef.current?.focus()
  }, [editing])

  return (
    <input
      aria-label="editing node"
      ref={inputRef}
      value={newText}
      onChange={({ target }) => setNewText(target.value)}
      onFocus={({ target }) => target.select()}
      onKeyUp={({ key }) =>
        key === 'Enter' && finalizeEditNode({ id, text: newText })
      }
    />
  )
}
