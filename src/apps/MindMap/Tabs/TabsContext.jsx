import React, { createContext, useReducer } from 'react';
import produce from 'immer';

export const TabsContext = createContext();
export function TabsProvider({ children, initialState }) {
  const [state, dispatch] = useReducer(handleDispatch, initialState);
  const viewModel = {
    state,
    selectTab: (id) => dispatch({ type: 'SELECT_TAB', payload: id }),
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
    }
  }
}
