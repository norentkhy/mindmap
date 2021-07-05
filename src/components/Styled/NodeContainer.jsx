import styled from 'styled-components'

const NodeContainer = styled.button`
  position: var(--position);
  left: var(--left);
  top: var(--top);

  &[data-transparent=true] {
    color: transparent;
    background-color: transparent;
    border-color: transparent;
  }
`

export default NodeContainer
