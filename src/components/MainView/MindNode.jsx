import { MindNodeLayout } from '../Layout'
import React, { useEffect, useRef, useState } from 'react'

export default function MindNode({ node, parentRef }) {
  const { editing, focused, text } = node

  const [currentText, setCurrentText] = useState(text)
  const { containerRef, inputRef } = useNodeRefs()
  useElementFocus(focused, editing, containerRef, inputRef)

  const handleResize = node.do?.registerSize
  const useSizeObserver = node.use?.sizeObserver
  const changeNodeText = node.do?.changeNodeText

  return (
    <MindNodeLayout
      Content={currentText}
      editing={editing}
      centerOffset={node.centerOffset}
      handleResize={handleResize}
      containerProps={{
        ref: containerRef,
        ...(!editing && {
          draggable: true,
          onDragStart: (e) => {
            e.dataTransfer.effectAllowed = 'move'
            node.do.handleDragStart(e, parentRef.current)
          },
          onClick: () => node.do.select?.(),
          onDoubleClick: (e) => {
            e.stopPropagation()
            node.do.startToEdit()
          },
          onKeyUp: ({ key }) => {
            key === 'Enter' && node.do.startToEdit()
            key === 'c' && node.do.createChild()
            key === 'f' && node.do.toggleFold()
          },
        }),
      }}
      inputProps={{
        ref: inputRef,
        value: currentText,
        onChange: ({ target }) => setCurrentText(target.value),
        onFocus: ({ target }) => target.select(),
        onKeyDown: preventDefaultEnter,
        onKeyUp: mapInputKeyUpHandlers(
          () => setCurrentText(addEmptySpace),
          () => changeNodeText(sanitizeText(currentText))
        ),
      }}
      useSizeObserver={useSizeObserver}
    />
  )
}

function addEmptySpace(string) {
  return string + '\u200b'
}

function preventDefaultEnter(event) {
  event.stopPropagation()
  if (!event.shiftKey && event.key === 'Enter') return event.preventDefault()
}

function mapInputKeyUpHandlers(workAroundNewLine, submitCurrentText) {
  return handleKeyUp

  function handleKeyUp(event) {
    event.stopPropagation()
    if (event.key === 'Enter') {
      if (event.shiftKey) return workAroundNewLine()
      return submitCurrentText()
    }
  }
}

function sanitizeText(text) {
  return text.trimRight(2).split('\u200b').join('')
}

function useNodeRefs() {
  const containerRef = useRef()
  const inputRef = useRef()
  return { containerRef, inputRef }
}

function useElementFocus(focused, editing, containerRef, inputRef) {
  return useEffect(() => {
    if (focused && !editing) containerRef.current?.focus()
    if (focused && editing) inputRef.current?.focus()
  }, [focused, editing, containerRef.current, inputRef.current])
}
