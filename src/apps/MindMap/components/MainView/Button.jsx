import styled from 'styled-components'

const Button = styled.button`
  margin: 10px 20px;
  position: absolute;
  ${styleDimensions}
`

function styleDimensions({ node: { desiredDimensions: { left, top } = {} } }) {
  const marginVertical = 10
  const marginHorizontal = 20

  const cssRules = [
    `margin: ${marginVertical}px ${marginHorizontal}px;`,
    left ? `left: ${left - marginHorizontal}px;` : 'left: auto;',
    top ? `top: ${top - marginVertical}px;` : 'top: auto;',
  ]

  return cssRules.reduce((css, cssRule) => css + cssRule, '')
}

export default Button
