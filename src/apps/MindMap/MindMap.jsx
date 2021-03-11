import React, { createContext } from 'react';
import { MainView } from './MainView/MainView';
import { MainViewContext, MainViewProvider } from './MainView/MainViewContext';
import { Tabs } from './Tabs/Tabs';
import { TabsContext, TabsProvider } from './Tabs/TabsContext';

export function MindMap() {
  return (
    <MainProvider>
      <Tabs context={TabsContext} />
      <Actions />
      <MainView context={MainViewContext} />
    </MainProvider>
  );
}

function Actions() {
  return <div aria-label="actions"></div>;
}

const MainContext = createContext();

function MainProvider({ children }) {
  const viewModel = {};
  return (
    <MainContext.Provider value={viewModel}>
      <MainViewProvider>
        <TabsProvider>{children}</TabsProvider>
      </MainViewProvider>
    </MainContext.Provider>
  );
}
