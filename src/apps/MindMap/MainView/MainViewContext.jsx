import produce from 'immer';
import React, { createContext, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const MainViewContext = createContext();

export function MainViewProvider({
  children,
  initialState = { trees: [], nodes: new Map() },
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const viewModel = {
    state,
    createRootNode: () => dispatch({ type: 'CREATE_ROOT_NODE' }),
    finalizeEditNode: (payload) => {
      dispatch({ type: 'EDIT_NODE', payload: { ...payload, editing: false } });
    },
  };

  return (
    <MainViewContext.Provider value={viewModel}>
      {children}
    </MainViewContext.Provider>
  );

  function reducer(state, action) {
    switch (action.type) {
      case 'CREATE_ROOT_NODE':
        return produce(state, (newState) => {
          const id = uuidv4();
          const node = { id, text: '', editing: true };
          newState.trees.push(node);
        });
      case 'EDIT_NODE':
        return produce(state, (newState) => {
          const { id, ...modifications } = action.payload;
          modifyNode({ id, trees: newState.trees, modifications });
        });
    }
  }
}

function getNode({ id, trees }) {
  if (trees.length === 0) return null;

  const foundNode = trees.find((tree) => tree.id === id);
  if (foundNode) return foundNode;

  return getNode({ id, trees: trees.flatMap((tree) => tree.children) });
}

function modifyNode({ id, trees, modifications }) {
  const node = getNode({ id, trees });
  Object.entries(modifications).forEach(([key, value]) => {
    node[key] = value;
  });
}
