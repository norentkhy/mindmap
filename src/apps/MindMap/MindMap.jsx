import React, { createContext } from 'react';
import { Tabs } from './Tabs/Tabs';

export function MindMap() {
  return (
    <MainProvider>
      <Tabs context={MainContext} />
      <Actions />
      <MainView />
    </MainProvider>
  );
}

function Actions() {
  return <div aria-label="actions"></div>;
}

function MainView() {
  return <div aria-label="main view"></div>;
}

const MainContext = createContext();

function MainProvider({ children }) {
  const viewModel = {};
  return (
    <MainContext.Provider value={viewModel}>{children}</MainContext.Provider>
  );
}
