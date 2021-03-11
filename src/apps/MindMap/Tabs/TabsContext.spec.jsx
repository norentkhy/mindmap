import React, { useContext } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { TabsProvider, TabsContext } from './TabsContext';

describe('overlap with Tabs.spec', () => {
  const tabs = [
    { id: uuidv4(), title: 'untitled' },
    { id: uuidv4(), title: 'untitled-2' },
    { id: uuidv4(), title: 'untitled-3' },
  ];

  test('showTab', () => {
    const initialState = { tabs };
    const wrapper = ({ children }) => (
      <TabsProvider initialState={initialState}>{children}</TabsProvider>
    );
    const { result } = renderHook(() => useContext(TabsContext), { wrapper });

    tabs.forEach(({ id }) => {
      act(() => result.current.showTab(id));

      const targettedTab = result.current.state.tabs.find(
        (tab) => tab.id === id
      );
      expect(targettedTab.selected).toBe(true);

      const nonTargettedTabs = result.current.state.tabs.filter(
        (tab) => tab.id !== id
      );
      nonTargettedTabs.forEach((tab) => {
        expect(tab.selected).toBe(false);
      });
    });
  });
});
