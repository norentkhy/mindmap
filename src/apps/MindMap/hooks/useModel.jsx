import { useContext } from 'react'
import { ModelContext } from '~mindmap/components/Model'

function useModel() {
  return useContext(ModelContext)
}

export default useModel
