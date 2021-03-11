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
    { id: uuidv4(), title: 'untitled' },
    { id: uuidv4(), title: 'untitled-2' },
    { id: uuidv4(), title: 'untitled-3' },
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
    let idShow, idRename;
    const showTab = jest.fn((id) => (idShow = id));
    const renameTab = jest.fn((id) => (idRename = id));

    render(
      <TabsMockProvider
        modifyViewModel={(viewModel) => ({
          ...viewModel,
          state: {
            tabs,
          },
          showTab,
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
      expect(idShow).toBe(tab.id);

      fireEvent.dblClick(Tab);
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
