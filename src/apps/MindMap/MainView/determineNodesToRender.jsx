export default function determineNodesToRender(stateOrNode) {
  const shouldRender = !stateOrNode?.folded
  const candidateNodes = stateOrNode?.children || stateOrNode?.trees
  return (shouldRender && candidateNodes) || []
}
