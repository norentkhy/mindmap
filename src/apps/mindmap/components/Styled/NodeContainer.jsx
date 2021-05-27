import { Style } from '~mindmap/data-structures'
import styled from 'styled-components'

const NodeContainer = styled.button`
  ${({ position }) => Style.computeCss(position)}
`

export default NodeContainer
