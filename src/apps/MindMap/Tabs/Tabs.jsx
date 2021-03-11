import React, { useContext } from 'react';
import styled from 'styled-components';

export function Tabs({ context }) {
  const { state, addNewTab, showTab, renameTab } = useContext(context);

  return (
    <div aria-label="tabs">
      {state?.tabs?.map((tab) => (
        <Tab
          key={tab.id}
          onClick={() => showTab(tab.id)}
          onDoubleClick={() => renameTab(tab.id)}
          selected={tab.selected}
        >
          {tab.title}
        </Tab>
      ))}
      <Tab aria-label="add new tab" onClick={addNewTab}>
        +
      </Tab>
    </div>
  );
}

const Tab = styled.button`
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
`;
