import { test } from '@japa/runner'
import SchemaValidator from 'App/Action/SchemaValidator'

test.group('Validation action', () => {
  test('it can validated api schema provided', async ({ expect }) => {
    const validated = new SchemaValidator().validate({
      version: 1,
      authors: [{ name: 'Michael Omakei', email: 'omakei96@gmail.com', phone: '+255625933171' }],
      endpoints: [
        {
          endpoint: '/customers',
          backend: [
            {
              host: ['http://127.0.0.1:3332'],
              url_pattern: '/',
              timeout: 2000,
            },
          ],
        },
        {
          endpoint: '/activation-codes',
          backend: [
            {
              host: ['http://127.0.0.1:3330'],
              url_pattern: '/',
              timeout: 2000,
            },
          ],
        },
      ],
    })

    expect(validated).toStrictEqual([
      {
        instancePath: '/version',
        keyword: 'type',
        message: 'must be string',
        params: { type: 'string' },
        schemaPath: '#/properties/version/type',
      },
    ])
  })
})
