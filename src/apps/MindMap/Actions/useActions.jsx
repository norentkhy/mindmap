import { useContext } from 'react';
import { ProjectContext } from '../Contexts/ProjectContext';

export function useActions(
  { theProjectContext = ProjectContext } = { theProjectContext: ProjectContext }
) {
  const { undo, redo, createRootNode } = useContext(theProjectContext);

  return {
    undoAction: undo,
    redoAction: redo,
    createRootNode,
  };
}
