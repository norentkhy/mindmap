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

describe('views', () => {
  const tabs = [
    { id: uuidv4(), title: 'untitled', selected: true },
    { id: uuidv4(), title: 'untitled-2', selected: false },
    { id: uuidv4(), title: 'untitled-3', selected: false },
  ];

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

  test('renders tabs', () => {
    let idSelect, idRename;
    const selectTab = jest.fn((id) => (idSelect = id));
    const renameTab = jest.fn((id) => (idRename = id));

    render(
      <TabsMockProvider
        modifyViewModel={(viewModel) => ({
          ...viewModel,
          state: {
            tabs,
          },
          selectTab,
          renameTab,
        })}
      >
        <Tabs context={TabsMockContext} />
      </TabsMockProvider>
    );

    tabs.forEach((tab) => {
      const Tab = screen.getByText(tab.title);
      expect(Tab).toBeVisible();

      fireEvent.click(Tab);
      expect(idSelect).toBe(tab.id);

      fireEvent.dblClick(Tab);
      expect(idRename).toBe(tab.id);
    });
  });

  test('tab selection', () => {
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
