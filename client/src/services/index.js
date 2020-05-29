import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: 'http://localhost:8990',
    headers: {
      'Content-Type': 'application/json',
    }
  })
}