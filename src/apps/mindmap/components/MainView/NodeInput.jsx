import { EmptyHeightSpan } from '../Styled'
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
      <EmptyHeightSpan>{newText}</EmptyHeightSpan>
      <Input
        aria-label="editing node"
        ref={inputRef}
        value={newText}
        onChange={({ target }) => setNewText(target.value)}
        onFocus={({ target }) => target.select()}
        onKeyUp={({ key }) => key === 'Enter' && changeNodeText(newText)}
        style={{ '--width': size.width + 'px', '--height': size.height + 'px' }}
      />
    </>
  )
}

const Input = styled.input`
  position: absolute;
  left: -2px;
  top: -2px;
  width: var(--width);
  height: var(--height);
  text-align: center;
  caret-color: transparent;
`
