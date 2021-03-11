import React from 'react';
import { Actions } from './Actions/Actions';
import { MainView } from './MainView/MainView';
import { ProjectProvider } from './Contexts/ProjectContext';
import { Tabs } from './Tabs/Tabs';
import { TabsProvider } from './Tabs/TabsContext';

export function MindMap() {
  return (
    <Providers>
      <Tabs />
      <Actions />
      <MainView />
    </Providers>
  );
}

function Providers({ children }) {
  return (
    <ProjectProvider>
      <TabsProvider>{children}</TabsProvider>
    </ProjectProvider>
  );
}
