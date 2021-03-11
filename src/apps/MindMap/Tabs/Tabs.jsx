import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

export function Tabs({ context }) {
  const {
    state,
    addNewTab,
    selectTab,
    initiateRenameTab,
    finishRenameTab,
  } = useContext(context);

  return (
    <div aria-label="tabs">
      {state?.tabs?.map((tab) => (
        <Tab
          key={tab.id}
          selectThisTab={() => selectTab(tab.id)}
          initiateRenameThisTab={() => initiateRenameTab(tab.id)}
          finishRenameThisTab={(newTitle) =>
            finishRenameTab({ id: tab.id, newTitle })
          }
          selected={tab.selected}
          renaming={tab.renaming}
          title={tab.title}
        />
      ))}
      <TabButton aria-label="add new tab" onClick={addNewTab}>
        +
      </TabButton>
    </div>
  );
}

function Tab({
  selectThisTab,
  initiateRenameThisTab,
  finishRenameThisTab,
  selected,
  title,
  renaming,
}) {
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef();

  useEffect(() => inputRef.current?.focus(), [renaming]);

  if (renaming)
    return (
      <input
        ref={inputRef}
        aria-label="renaming this tab"
        value={newTitle}
        onChange={({ target }) => setNewTitle(target.value)}
        onKeyUp={({ key }) => key === 'Enter' && finishRenameThisTab(newTitle)}
        onFocus={({ target }) => target.select()}
      />
    );
  else
    return (
      <TabButton
        onClick={selectThisTab}
        onDoubleClick={initiateRenameThisTab}
        selected={selected}
      >
        {title}
      </TabButton>
    );
}

const TabButton = styled.button`
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
`;
