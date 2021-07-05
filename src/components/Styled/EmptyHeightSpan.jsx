import styled from 'styled-components'

const EmptyHeightDiv = styled.div`
  white-space: pre-line;

  &::before {
    content: '\\200b';
  }
`

export default EmptyHeightDiv
