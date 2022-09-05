import nock from 'nock'

export function mockCustomerService() {
  return nock('http://127.0.0.1:3332')
    .get('/address')
    .reply(200, () => {
      return {
        contact: { phone: '+25562593171', address: 'Kilimanjaro Moshi' },
      }
    })
}
