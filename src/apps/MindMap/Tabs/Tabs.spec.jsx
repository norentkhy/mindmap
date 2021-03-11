import React, { createContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './Tabs';
import { v4 as uuidv4 } from 'uuid';

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
