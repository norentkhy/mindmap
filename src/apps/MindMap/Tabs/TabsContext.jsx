import React, { createContext, useReducer } from 'react';
import produce from 'immer';
import { v4 as uuidv4 } from 'uuid';

export const TabsContext = createContext();
export function TabsProvider({ children, initialState }) {
  const [state, dispatch] = useReducer(handleDispatch, initialState);
  const viewModel = {
    state,
    selectTab: (id) => dispatch({ type: 'SELECT_TAB', payload: id }),
    addNewTab: () => {
      const id = uuidv4();
      dispatch({ type: 'ADD_NEW_TAB', payload: { id } });
      dispatch({ type: 'SELECT_TAB', payload: id });
    },
    initiateRenameTab: (id) =>
      dispatch({ type: 'SET_TAB_EDIT', payload: { id, value: true } }),
    finishRenameTab: ({ id, newTitle }) => {
      dispatch({ type: 'RENAME_TAB', payload: { id, newTitle } });
      dispatch({ type: 'SET_TAB_EDIT', payload: { id, value: false } });
    },
  };

  return (
    <TabsContext.Provider value={viewModel}>{children}</TabsContext.Provider>
  );

  function handleDispatch(state, action) {
    switch (action.type) {
      case 'SELECT_TAB':
        return produce(state, (newState) => {
          newState.tabs = state.tabs.map((tab) =>
            produce(tab, (newTab) => {
              newTab.selected = tab.id === action.payload;
            })
          );
        });
      case 'ADD_NEW_TAB':
        return produce(state, (newState) => {
          newState.tabs.push({ id: action.payload.id, title: 'untitled' });
        });
      case 'SET_TAB_EDIT':
        return produce(state, (newState) => {
          newState.tabs = state.tabs.map((tab) =>
            tab.id === action.payload.id
              ? { ...tab, renaming: action.payload.value }
              : tab
          );
        });
      case 'RENAME_TAB':
        return produce(state, (newState) => {
          const tabTarget = newState.tabs.find(
            (tab) => tab.id === action.payload.id
          );
          tabTarget.title = action.payload.newTitle;
        });
    }
  }
}
