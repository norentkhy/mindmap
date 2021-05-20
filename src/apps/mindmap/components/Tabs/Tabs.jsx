import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

export function Tabs({ tabs, createTab }) {
  return (
    <TabsBar aria-label="tabs">
      {tabs.map((tab) => (
        <Tab key={tab.id} tab={tab} />
      ))}
      <button aria-label="add new tab" onClick={createTab}>
        +
      </button>
    </TabsBar>
  )
}

function Tab({ tab }) {
  if (tab.renaming) return <TabInput tab={tab} />
  else return <TabButton tab={tab} />
}

function TabInput({ tab }) {
  const { title, renaming } = tab
  const [newTitle, setNewTitle] = useState(title)
  const inputRef = useRef()

  useEffect(() => inputRef.current?.focus(), [renaming])

  return (
    <input
      ref={inputRef}
      aria-label="renaming this tab"
      value={newTitle}
      onChange={({ target }) => setNewTitle(target.value)}
      onKeyUp={({ key }) => {
        key === 'Enter' && tab.do.rename(newTitle)
      }}
      onFocus={({ target }) => target.select()}
    />
  )
}

function TabButton({ tab }) {
  const { id, title, selected } = tab

  return (
    <Button
      data-id={id}
      onClick={() => tab.do.select()}
      onDoubleClick={() => tab.do.editName()}
      selected={selected}
    >
      {title}
    </Button>
  )
}

const Button = styled.button`
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
`

const TabsBar = styled.div`
  display: flex;
  flex-direction: row;
`
