import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProjectContext } from '../Contexts/ProjectContext';

export function MainView({ theProjectContext = ProjectContext }) {
  const { state, createRootNode } = useContext(theProjectContext);
  const nodesToRender = determineNodesToRender(state);

  return (
    <div aria-label="main view" onDoubleClick={createRootNode}>
      {nodesToRender?.map((node) => (
        <NodeFamily
          familyHead={node}
          key={node.id}
          theProjectContext={theProjectContext}
        />
      ))}
    </div>
  );
}

function NodeFamily({ familyHead, theProjectContext }) {
  const nodesToRender = determineNodesToRender(familyHead);

  return (
    <div>
      <Node
        node={familyHead}
        key={familyHead.id}
        theProjectContext={theProjectContext}
      />
      {nodesToRender?.map((node) => (
        <NodeFamily
          familyHead={node}
          key={node.id}
          theProjectContext={theProjectContext}
        />
      ))}
    </div>
  );
}

function determineNodesToRender(stateOrNode) {
  const shouldRender = !stateOrNode?.folded;
  const candidateNodes = stateOrNode?.children || stateOrNode?.trees;
  return (shouldRender && candidateNodes) || [];
}

function Node({ node: { editing, id, text }, theProjectContext }) {
  const {
    finalizeEditNode,
    createChildNode,
    foldNode,
    initiateEditNode,
  } = useContext(theProjectContext);
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
        onFocus={({ target }) => target.select()}
        onKeyUp={({ key }) =>
          key === 'Enter' && finalizeEditNode({ id, text: newText })
        }
      />
    );
}
