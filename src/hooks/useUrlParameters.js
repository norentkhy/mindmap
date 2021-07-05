import { useLocation } from '@reach/router'
import parseUrlQuery from 'src/utils/parseUrlQuery'

function useUrlParameters() {
  const { search } = useLocation()
  return parseUrlQuery(search)
}

export default useUrlParameters
