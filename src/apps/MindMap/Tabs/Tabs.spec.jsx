import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './Tabs';
import { v4 as uuidv4 } from 'uuid';
import userEvent from '@testing-library/user-event';
import { getInputSelection } from '../utils/getInputSelection';
import { TabsProvider } from './TabsContext';
import { createMockContextProvider } from '../utils/createMockContextProvider';

describe('rendered as intended', () => {
  test('overlap with MindMap.spec', () => {
    renderAsIntended();
    expect(queryByLabelText(/^tabs$/i)).toBeVisible();
  });

  function renderAsIntended() {
    render(
      <TabsProvider>
        <Tabs />
      </TabsProvider>
    );
  }
});

describe('rendered with mocks', () => {
  const tabs = [
    { id: createUuid(), title: 'untitled', selected: true },
    { id: createUuid(), title: 'untitled-2', selected: false },
    { id: createUuid(), title: 'untitled-3', selected: false },
  ];

  describe('views', () => {
    test('add new tab', () => {
      const addNewTab = createMockFn();
      renderWithMock({ addNewTab });

      ui.createNewTab();
      expect(addNewTab).toHaveBeenCalled();
    });

    test('render of tabs in state', () => {
      renderWithMock({ state: { tabs } });

      tabs.forEach((tab) => {
        expect(queryTab(tab)).toBeVisible();
      });
    });
  });

  describe('tab selection', () => {
    test('function call to view model', () => {
      const selectTab = createMockFn();
      renderWithMock({ state: { tabs }, selectTab });

      tabs.forEach(({ title, id }, i) => {
        fireEvent.click(queryTab({ title }));
        expect(selectTab).toHaveBeenCalledTimes(i + 1);
        expect(selectTab.mock.calls[i]).toEqual([id]);
      });
    });

    test('state result from view model', () => {
      renderWithMock({ state: { tabs } });

      tabs.forEach((tab) => {
        const Tab = queryTab(tab);
        expect(Tab).toHaveStyle(
          `font-weight: ${tab.selected ? 'bold' : 'normal'}`
        );
      });
    });
  });

  describe('tab renaming', () => {
    test('function call to view model', () => {
      const initiateRenameTab = createMockFn();
      renderWithMock({ state: { tabs }, initiateRenameTab });

      tabs.forEach((tab, i) => {
        fireEvent.dblClick(queryTab(tab));
        expect(initiateRenameTab).toHaveBeenCalledTimes(i + 1);
        expect(initiateRenameTab.mock.calls[i]).toEqual([tab.id]);
      });
    });

    test('result from rename initiation', () => {
      const {
        tabTarget,
        nonTargetTabs,
        finishRenameTab,
      } = renderWithTabInRenameMode();

      expect(queryTab(tabTarget)).toBeNull();

      nonTargetTabs.forEach((tab) => expect(queryTab(tab)).toBeVisible());

      const Focus = getFocus();
      expect(getInputSelection(Focus)).toBe(tabTarget.title);

      const someNewTitle = 'some new title';
      ui.typeAndPressEnter(someNewTitle);

      expect(finishRenameTab).toBeCalledTimes(1);
      expect(getArgsOfLastCall(finishRenameTab)).toEqual([
        {
          id: tabTarget.id,
          newTitle: someNewTitle,
        },
      ]);

      function renderWithTabInRenameMode() {
        const {
          tabTarget,
          nonTargetTabs,
          state,
        } = createSituationWithOneRenaming();

        const finishRenameTab = createMockFn();
        renderWithMock({ state, finishRenameTab });

        return {
          tabTarget,
          nonTargetTabs,
          finishRenameTab,
        };

        function createSituationWithOneRenaming() {
          const tabTarget = tabs[2];
          const tabsWithOneRenaming = tabs.map((tab) => ({
            ...tab,
            renaming: tab.id === tabTarget.id,
          }));
          const nonTargetTabs = tabsWithOneRenaming.filter(
            (tab) => tab.id !== tabTarget.id
          );

          const state = { tabs: tabsWithOneRenaming };

          return { tabTarget, nonTargetTabs, state };
        }
      }
    });
  });

  function renderWithMock(modifications) {
    const [MockContext, MockProvider] = createMockContextProvider({
      modifications,
    });

    render(
      <MockProvider viewModelModifications={modifications}>
        <Tabs theTabsContext={MockContext} />
      </MockProvider>
    );
  }
});

function createUuid() {
  return uuidv4();
}

function queryTab({ title }) {
  return screen.queryByText(title);
}

const ui = {
  selectNode({ text }) {
    const Target = queryNode({ text });
    userEvent.click(Target);
  },
  foldSelectedNode() {
    const Target = getFocus();
    userEvent.type(Target, 'f');
  },
  createChildNodeOfSelectedNode() {
    const Target = getFocus();
    userEvent.type(Target, 'c');
  },
  createRootNode() {
    fireEvent.doubleClick(screen.getByLabelText('main view'));
  },
  typeAndPressEnter(text) {
    const Target = getFocus();
    userEvent.type(Target, `${text}{enter}`);
  },
  editSelectedNode() {
    const Target = getFocus();
    userEvent.type(Target, '{enter}');
  },
  createNewTab() {
    const NewTabButton = queryByLabelText(/^add new tab$/i);
    fireEvent.click(NewTabButton);
  },
};

function queryByLabelText(stringOrRegExp) {
  return screen.queryByLabelText(stringOrRegExp);
}

function getFocus() {
  return document.activeElement || document.body;
}

function createMockFn(...args) {
  return jest.fn(...args);
}

function getArgsOfLastCall(mockFn) {
  const argsOfCalls = getArgsOfCalls(mockFn);
  return argsOfCalls[argsOfCalls.length - 1];
}

function getArgsOfCalls(mockFn) {
  return mockFn.mock.calls;
}
