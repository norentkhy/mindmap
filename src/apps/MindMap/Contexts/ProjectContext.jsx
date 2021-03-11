import React, { createContext, useEffect, useReducer } from 'react';
import produce from 'immer';
import { v4 as uuidv4 } from 'uuid';
import { useTime } from '../hooks/useTime';

export const ProjectContext = createContext();

export function ProjectProvider({ children, initialState = { trees: [] } }) {
  const newViewModel = useMainView({ initialState });

  return (
    <ProjectContext.Provider value={newViewModel}>
      {children}
    </ProjectContext.Provider>
  );
}

function useMainView({ initialState }) {
  const [state, dispatch] = useReducer(reduce, initialState);
  const { timeline, insertIntoTimeline, goBack, goForward } = useTime();

  useEffect(() => {
    insertIntoTimeline(state);
  }, [state]);

  return {
    state: timeline.present,
    undo: goBack,
    redo: goForward,
    createRootNode() {
      dispatch({ type: 'CREATE_ROOT_NODE' });
    },
    createChildNode(parentId) {
      dispatch({ type: 'CREATE_CHILD_NODE', payload: parentId });
    },
    initiateEditNode(id) {
      dispatch({ type: 'EDIT_NODE', payload: { id, editing: true } });
    },
    finalizeEditNode(payload) {
      dispatch({ type: 'EDIT_NODE', payload: { ...payload, editing: false } });
    },
    foldNode(id) {
      dispatch({ type: 'TOGGLE_NODE_FOLD', payload: id });
    },
    replaceState(newState) {
      dispatch({ type: 'REPLACE_STATE', payload: newState });
    },
  };

  function reduce(state, action) {
    const transition = stateTransitions[action.type];
    const newState = transition(state, action.payload);

    return newState;
  }
}

const stateTransitions = {
  CREATE_ROOT_NODE(state) {
    return produce(state, (newState) => {
      const node = createNode();
      newState.trees.push(node);
    });
  },
  CREATE_CHILD_NODE(state, parentId) {
    return produce(state, (newState) => {
      const parentNode = getNode({ id: parentId, trees: newState.trees });
      if (!parentNode.children) parentNode.children = [];

      const node = createNode();
      parentNode.children.push(node);
    });
  },
  EDIT_NODE(state, { id, ...modifications }) {
    return produce(state, (newState) => {
      modifyNode({ id, trees: newState.trees, modifications });
    });
  },
  TOGGLE_NODE_FOLD(state, id) {
    return produce(state, (newState) => {
      const node = getNode({ id, trees: newState.trees });
      node.folded = !node.folded;
    });
  },
};

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

function createNode() {
  return { id: uuidv4(), text: '', editing: true };
}
