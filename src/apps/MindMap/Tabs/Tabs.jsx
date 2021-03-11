import React, { useContext } from 'react';

export function Tabs({ context }) {
  const { state, addNewTab, showTab, renameTab } = useContext(context);

  return (
    <div aria-label="tabs">
      {state?.tabs?.map((tab) => (
        <button
          key={tab.id}
          onClick={() => showTab(tab.id)}
          onDoubleClick={() => renameTab(tab.id)}
        >
          {tab.title}
        </button>
      ))}
      <button aria-label="add new tab" onClick={addNewTab}>
        +
      </button>
    </div>
  );
}
