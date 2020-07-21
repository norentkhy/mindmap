import { createRef } from 'react'
import { useRef } from 'react'

export default function useRefs(length) {
  const RefsArray = createRefsArray(length)
  const RefsRef = useRef(RefsArray)
  return RefsRef.current
}

function createRefsArray(length) {
  const initialArray = Array(length).fill(null)
  return initialArray.map(() => createRef())
}
