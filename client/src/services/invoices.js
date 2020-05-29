import api from '@/services/index'

export default {
  update (userId, payload) {
    return api().post('/invoices/' + userId + '/update', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    })
  }
}