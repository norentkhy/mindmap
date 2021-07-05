import { v4 as uuidv4 } from 'uuid'
import { mapObject } from 'src/utils/FunctionalProgramming'
import { Nodes } from '../index'
import actionButtons from './action-buttons'

export default function computeActionPanelToRender(deps) {
  return {
    buttons: {
      navigation: getNavigationButtons(deps),
      context: getContextButtons(deps),
      time: getButtons(deps, ['UNDO', 'REDO']),
    },
  }
}

function getNavigationButtons(deps) {
  return getButtons(deps, [
    'NAVIGATE_LEFT',
    'NAVIGATE_RIGHT',
    'NAVIGATE_UP',
    'NAVIGATE_DOWN',
  ])
}

function getContextButtons(deps) {
  return getButtons(deps, ['CREATE_NODE', 'CREATE_CHILD', 'SUBMIT_TEXT'])
}

function getButtons(deps, names) {
  return names.map((name) => getButton(deps, name))
}

function getButton(deps, name) {
  const { staticProps, bindProps } = buttonProps[name]
  return { ...staticProps, ...bindProps(deps) }
}

const buttonProps = addIdToAllStaticProps(actionButtons)

function addIdToAllStaticProps(propsObj) {
  return mapObject(propsObj, (props) => addIdToStaticProps(props))
}

function addIdToStaticProps(obj) {
  return { ...obj, staticProps: addIdTo(obj.staticProps) }
}

function addIdTo(obj) {
  return { ...obj, id: uuidv4() }
}
