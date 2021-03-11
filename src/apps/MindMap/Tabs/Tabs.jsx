import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { TabsContext } from './TabsContext'

export function Tabs({ theTabsContext = TabsContext }) {
  const { state, addNewTab } = useContext(theTabsContext)
  const tabsToRender = getTabsToRender(state)

  return (
    <div aria-label="tabs">
      {tabsToRender.map((tab) => (
        <Tab key={tab.id} tab={tab} theTabsContext={theTabsContext} />
      ))}
      <button aria-label="add new tab" onClick={addNewTab}>
        +
      </button>
    </div>
  )
}

function getTabsToRender(state) {
  return state?.tabs || []
}

function Tab({ tab, theTabsContext }) {
  const { renaming } = tab

  if (renaming) return <TabInput tab={tab} theTabsContext={theTabsContext} />
  else return <TabButton tab={tab} theTabsContext={theTabsContext} />
}

function TabInput({ tab: { id, title, renaming }, theTabsContext }) {
  const { finishRenameTab } = useContext(theTabsContext)
  const [newTitle, setNewTitle] = useState(title)
  const inputRef = useRef()

  useEffect(() => inputRef.current?.focus(), [renaming])

  return (
    <input
      ref={inputRef}
      aria-label="renaming this tab"
      value={newTitle}
      onChange={({ target }) => setNewTitle(target.value)}
      onKeyUp={({ key }) =>
        key === 'Enter' && finishRenameTab({ id, newTitle })
      }
      onFocus={({ target }) => target.select()}
    />
  )
}

function TabButton({ tab: { id, title, selected }, theTabsContext }) {
  const { selectTab, initiateRenameTab } = useContext(theTabsContext)

  return (
    <Button
      onClick={() => selectTab(id)}
      onDoubleClick={() => initiateRenameTab(id)}
      selected={selected}
    >
      {title}
    </Button>
  )
}

const Button = styled.button`
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
`
