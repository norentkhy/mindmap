import { useEffect } from 'react'

function useOnEffect(x1, x2) {
  useEffect(x2, x1)
}

export default useOnEffect
