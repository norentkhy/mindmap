import { reduceObject } from '~/utils/FunctionalProgramming'

export default {
  computeCss,
}

function computeCss(style) {
  return reduceObject(
    style,
    '',
    (css, [key, value]) => css + `${key}: ${value};\n`
  )
}

function returnComputeContainerStyle(centerOffset) {
  //later first fix viewmodel problem
}