import { useContext } from 'react'
import { ModelContext } from '~mindmap/components'

function useModel() {
  return useContext(ModelContext)
}

export default useModel
