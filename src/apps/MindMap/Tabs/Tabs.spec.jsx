import React, { createContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './Tabs';
import { v4 as uuidv4 } from 'uuid';
import produce from 'immer';
import userEvent from '@testing-library/user-event';

test('overlap with MindMap.spec', () => {
  render(
    <TabsMockProvider>
      <Tabs context={TabsMockContext} />
    </TabsMockProvider>
  );
  screen.getByLabelText(/^tabs$/i);
});

const tabs = [
  { id: uuidv4(), title: 'untitled', selected: true },
  { id: uuidv4(), title: 'untitled-2', selected: false },
  { id: uuidv4(), title: 'untitled-3', selected: false },
];

describe('views', () => {
  test('add new tab', () => {
    const addNewTab = jest.fn();
    render(
      <TabsMockProvider
        modifyViewModel={(viewModel) => ({ ...viewModel, addNewTab })}
      >
        <Tabs context={TabsMockContext} />
      </TabsMockProvider>
    );

    fireEvent.click(screen.getByLabelText(/^add new tab$/i));
    expect(addNewTab).toHaveBeenCalled();
  });

  test('render of tabs in state', () => {
    render(
      <TabsMockProvider
        modifyViewModel={(viewModel) => ({
          ...viewModel,
          state: {
            tabs,
          },
        })}
      >
        <Tabs context={TabsMockContext} />
      </TabsMockProvider>
    );

    tabs.forEach((tab) => {
      expect(screen.getByText(tab.title)).toBeVisible();
    });
  });
});

describe('tab selection', () => {
  test('function call to view model', () => {
    let idSelect;
    const selectTab = jest.fn((id) => (idSelect = id));

    render(
      <TabsMockProvider
        modifyViewModel={(viewModel) => ({
          ...viewModel,
          state: {
            tabs,
          },
          selectTab,
        })}
      >
        <Tabs context={TabsMockContext} />
      </TabsMockProvider>
    );

    tabs.forEach((tab) => {
      fireEvent.click(screen.getByText(tab.title));
      expect(idSelect).toBe(tab.id);
    });
  });

  test('state result from view model', () => {
    render(
      <TabsMockProvider
        modifyViewModel={(viewModel) => ({ ...viewModel, state: { tabs } })}
      >
        <Tabs context={TabsMockContext} />
      </TabsMockProvider>
    );

    tabs.forEach((tab) => {
      const Tab = screen.getByText(tab.title);
      expect(Tab).toHaveStyle(
        `font-weight: ${tab.selected ? 'bold' : 'normal'}`
      );
    });
  });
});

describe('tab renaming', () => {
  test('function call to view model', () => {
    let idRename;
    const initiateRenameTab = jest.fn((id) => (idRename = id));

    render(
      <TabsMockProvider
        modifyViewModel={(viewModel) => ({
          ...viewModel,
          state: {
            tabs,
          },
          initiateRenameTab,
        })}
      >
        <Tabs context={TabsMockContext} />
      </TabsMockProvider>
    );

    tabs.forEach((tab) => {
      fireEvent.dblClick(screen.getByText(tab.title));
      expect(idRename).toBe(tab.id);
    });
  });

  test('result from rename initiation', () => {
    const tabTarget = tabs[2];
    const tabsWithOneRenaming = produce(tabs, (newTabs) => {
      newTabs.find((tab) => tab.id === tabTarget.id).renaming = true;
    });
    const finishRenameTab = jest.fn();

    render(
      <TabsMockProvider
        modifyViewModel={(viewModel) => ({
          ...viewModel,
          state: {
            tabs: tabsWithOneRenaming,
          },
          finishRenameTab,
        })}
      >
        <Tabs context={TabsMockContext} />
      </TabsMockProvider>
    );

    expect(screen.queryByText(tabTarget.title)).toBeNull();

    const nonTargetTabs = tabsWithOneRenaming.filter(
      (tab) => tab.id !== tabTarget.id
    );
    nonTargetTabs.forEach((tab) =>
      expect(screen.getByText(tab.title)).toBeVisible()
    );

    const TabRename = screen.getByLabelText('renaming this tab');
    expect(TabRename).toHaveFocus();
    expect(getInputSelection(TabRename)).toBe(tabTarget.title);

    const someNewTitle = 'some new title';
    userEvent.type(TabRename, someNewTitle);
    userEvent.type(TabRename, '{enter}');

    expect(finishRenameTab).toHaveBeenCalled();
    expect(finishRenameTab.mock.calls[0]).toEqual([
      {
        id: tabTarget.id,
        newTitle: someNewTitle,
      },
    ]);
  });
});

const TabsMockContext = createContext();

function TabsMockProvider({ children, modifyViewModel = (x) => x }) {
  const viewModel = {};
  const modifiedViewModel = modifyViewModel(viewModel);

  return (
    <TabsMockContext.Provider value={modifiedViewModel}>
      {children}
    </TabsMockContext.Provider>
  );
}

function getInputSelection(Element) {
  const { value, selectionStart, selectionEnd } = Element;
  return value.substring(selectionStart, selectionEnd);
}
