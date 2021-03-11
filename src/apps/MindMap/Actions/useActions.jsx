import { useContext } from 'react';
import { MainViewContext as defaultContext } from '../MainView/MainViewContext';

export function useActions(
  { MainViewContext = defaultContext } = { MainViewContext: defaultContext }
) {
  const { undo, redo, createRootNode } = useContext(MainViewContext);

  return {
    undoAction: undo,
    redoAction: redo,
    createRootNode,
  };
}
