import Axios from 'axios'

function postData(url, data) {
  return Axios.post(url, data)
}

function hasErrorId(axiosError, id) {
  return JSON.stringify(axiosError.response).includes(id)
}

export { postData, hasErrorId }
