import React, { useContext, useEffect, useRef, useState } from 'react';

export function MainView({ context, features = { nodeCreation: true } }) {
  const { nodeCreation } = features;
  const { state, createRootNode } = useContext(context);

  return (
    <div
      aria-label="main view"
      onDoubleClick={nodeCreation ? createRootNode : () => {}}
    >
      {state?.trees?.map((tree, i) => (
        <Node node={tree} key={tree.id} context={context} />
      ))}
    </div>
  );
}

function Node({ node: { editing, id, text }, context }) {
  const { finalizeEditNode } = useContext(context);
  const [newText, setNewText] = useState(text);
  const inputRef = useRef();

  useEffect(() => {
    editing && inputRef.current?.focus();
  }, [editing]);

  if (!editing) return <button>{text}</button>;
  else
    return (
      <input
        aria-label="editing node"
        ref={inputRef}
        value={newText}
        onChange={({ target }) => setNewText(target.value)}
        onKeyUp={({ key }) =>
          key === 'Enter' && finalizeEditNode({ id, text: newText })
        }
        onFocus={({ target }) => target.select()}
      />
    );
}
