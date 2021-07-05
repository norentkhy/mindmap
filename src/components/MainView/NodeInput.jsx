import { EmptyHeightDiv } from '../Styled'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

export default function NewNodeInput({
  node: {
    text,
    editing,
    focused,
    do: { changeNodeText },
  },
  size,
}) {
  const [newText, setNewText] = useState(text)
  const inputRef = useRef()

  useEffect(() => {
    if (focused && editing) inputRef.current?.focus()
  }, [focused, editing, inputRef.current])

  return (
    <>
      <EmptyHeightDiv>{newText}</EmptyHeightDiv>
      <Input
        aria-label="editing node"
        ref={inputRef}
        value={newText}
        onChange={({ target }) => setNewText(target.value)}
        onFocus={({ target }) => target.select()}
        onKeyDown={(e) => {
          e.stopPropagation()
          if (!e.shiftKey && e.key === 'Enter') e.preventDefault()
        }}
        onKeyUp={(event) => {
          const { key, shiftKey } = event
          event.stopPropagation()
          if (shiftKey) {
            if (key === 'Enter') setNewText((text) => text + '\u200b')
            return
          }
          if (key === 'Enter') changeNodeText(sanitizeText(newText))
        }}
        style={{ '--width': size.width + 'px', '--height': size.height + 'px' }}
      />
    </>
  )
}

function sanitizeText(text) {
  return text.trimRight(2).split('\u200b').join('')
}

const Input = styled.textarea`
  resize: none;
  font: inherit;
  position: absolute;
  left: -2px;
  top: -2px;
  width: var(--width);
  height: var(--height);
  text-align: center;
`
