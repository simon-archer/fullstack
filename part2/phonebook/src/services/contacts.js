import axios from 'axios'
const baseUrl = 'http://localhost:3001/people'

const getAll = () => {
    const request = axios.get(baseUrl)
    // const nonExisting = {
    //   name: 10000,
    //   number: 'This contact is not saved to server',
    //   id: 
    // }
    return request.then(response => response.data.concat(/* nonExisting */))
  }

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}
const deleteContact = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const updatedNumber = (id) => {
    const request = axios.put (`${baseUrl}/${id}`)
return request.then(response => response.data)
}

export default { getAll, create, update, deleteContact, updatedNumber }