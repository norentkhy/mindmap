import styled from 'styled-components'

const EmptyHeightSpan = styled.span`
  &::before {
    content: '\\200b';
  }
`

export default EmptyHeightSpan
