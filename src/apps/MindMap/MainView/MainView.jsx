import React, { useContext, useEffect, useRef, useState } from 'react';

export function MainView({ context }) {
  const { state, createRootNode } = useContext(context);

  return (
    <div aria-label="main view" onDoubleClick={createRootNode}>
      {state?.trees?.map((tree, i) => (
        <Tree tree={tree} key={tree.id} context={context} />
      ))}
    </div>
  );
}

function Tree({ tree, context }) {
  return (
    <div>
      <Node node={tree} key={tree.id} context={context} />
      {!tree.folded &&
        tree?.children?.map((childTree) => (
          <Tree
            tree={childTree}
            key={childTree.id}
            context={context}
            parentId={tree.id}
          />
        ))}
    </div>
  );
}

function Node({ node: { editing, id, text }, context }) {
  const {
    finalizeEditNode,
    createChildNode,
    foldNode,
    initiateEditNode,
  } = useContext(context);
  const [newText, setNewText] = useState(text);
  const inputRef = useRef();

  useEffect(() => {
    editing && inputRef.current?.focus();
  }, [editing]);

  if (!editing)
    return (
      <button
        onKeyUp={({ key }) => {
          key === 'Enter' && initiateEditNode(id);
          key === 'c' && createChildNode(id);
          key === 'f' && foldNode(id);
        }}
      >
        {text}
      </button>
    );
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
