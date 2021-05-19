import testNodeCreation from '~mindmap/specifications/node-creation/integration.cypress'
import testNodeFolding from '~mindmap/specifications/node-folding/integration.cypress'
import testTabs from '~mindmap/specifications/tabs/integration.cypress'
import testUndoRedo from '~mindmap/specifications/undo-redo/integration.cypress'

describe('node creation', () => {
  testNodeCreation(describe, beforeEach, it, cy)
})

describe('node folding', () => {
  testNodeFolding(describe, it, cy)
})

describe('tabs', () => {
  testTabs(describe, beforeEach, it, cy)
})

describe('undo redo nodes', () => {
  testUndoRedo(describe, beforeEach, it, cy)
})
