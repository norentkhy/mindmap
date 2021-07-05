import { useContext } from 'react'
import { ModelContext } from 'src/components'

function useModel() {
  return useContext(ModelContext)
}

export default useModel
