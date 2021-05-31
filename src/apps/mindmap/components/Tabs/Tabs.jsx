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
  const { name, renaming } = tab
  const [newName, setNewName] = useState(name)
  const inputRef = useRef()

  useEffect(() => inputRef.current?.focus(), [renaming])

  return (
    <input
      ref={inputRef}
      aria-label="renaming this tab"
      value={newName}
      onChange={({ target }) => setNewName(target.value)}
      onKeyUp={({ key }) => {
        key === 'Enter' && tab.do.rename(newName)
      }}
      onFocus={({ target }) => target.select()}
    />
  )
}

function TabButton({ tab }) {
  const { id, name, selected } = tab

  return (
    <Button
      data-id={id}
      onClick={() => tab.do.select()}
      onDoubleClick={() => tab.do.editName()}
      selected={selected}
    >
      {name}
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
