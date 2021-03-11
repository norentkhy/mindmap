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

  test('selectTab', () => {
    const initialState = { tabs };
    const wrapper = ({ children }) => (
      <TabsProvider initialState={initialState}>{children}</TabsProvider>
    );
    const { result } = renderHook(() => useContext(TabsContext), { wrapper });

    tabs.forEach(({ id }) => {
      act(() => result.current.selectTab(id));

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

  test('addNewTab', () => {
    const initialState = { tabs: [] };
    const wrapper = ({ children }) => (
      <TabsProvider initialState={initialState}>{children}</TabsProvider>
    );
    const { result } = renderHook(() => useContext(TabsContext), { wrapper });

    [0, 1, 2].forEach((i) => {
      act(() => result.current.addNewTab());
      expect(result.current.state.tabs.length).toBe(i + 1);

      const selectedTab = result.current.state.tabs[i];
      const notSelectedTabs = result.current.state.tabs.filter(
        (tab, index) => index !== i
      );
      expect(selectedTab.id).not.toBeFalsy();
      expect(selectedTab.selected).toBe(true);
      notSelectedTabs.forEach((tab) => expect(tab.selected).toBe(false));
    });

    expectIdsToBeUnique();

    function expectIdsToBeUnique() {
      const ids = result.current.state.tabs.map((tab) => tab.id);
      const setIds = new Set(ids);
      expect(ids.length).toBe(setIds.size);
    }
  });

  test('renameTab', () => {
    const initialState = { tabs };
    const wrapper = ({ children }) => (
      <TabsProvider initialState={initialState}>{children}</TabsProvider>
    );
    const { result } = renderHook(() => useContext(TabsContext), { wrapper });

    const idTarget = tabs[0].id;
    const newTitle = 'renamed title';
    act(() => result.current.renameTab({ id: idTarget, newTitle }));

    const tabTarget = result.current.state.tabs.find(
      (tab) => tab.id === idTarget
    );
    expect(tabTarget.title).toBe(newTitle);
  });
});
