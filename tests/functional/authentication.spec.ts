import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import { mockCustomerService } from '../test_helpers/mock'
import sinon from 'sinon'
import SchemaValidator from 'App/Action/SchemaValidator'

test.group('Authentication ', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can login user', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei96@gmail.com',
      password: 'secret',
      isActive: true,
    }).create()
    const response = await client.post('/login').form({ email: user.email, password: 'secret' })
    response.assertStatus(200)
    expect(response.body()).toStrictEqual({
      message: 'authenticated',
      status: true,
      payload: {
        type: 'bearer',
        token: response.body().payload.token,
        refreshToken: response.body().payload.refreshToken,
        expires_at: response.body().payload.expires_at,
      },
    })
  })

  test('it can not login user if has a worng password', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei96@gmail.com',
      password: 'secret',
      isActive: true,
    }).create()
    const response = await client.post('/login').form({ email: user.email, password: 'password' })
    response.assertStatus(401)
    expect(response.body()).toStrictEqual({
      message: 'Invalid credentials',
      status: false,
      errors: [{ message: 'Invalid credentials', field: 'Authentication', rule: 'Authentication' }],
    })
  })

  test('it can not login user if has a worng email', async ({ client, expect }) => {
    await UserFactory.merge({
      email: 'omakei96@gmail.com',
      password: 'secret',
      isActive: true,
    }).create()
    const response = await client
      .post('/login')
      .form({ email: 'omakei@golang.org', password: 'password' })
    response.assertStatus(200)
    expect(response.body()).toStrictEqual({
      message: 'Invalid credentials',
      status: false,
      errors: [{ message: 'Invalid credentials', field: 'Authentication', rule: 'Authentication' }],
    })
  })

  test('it can not login user if has inactive account', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei96@gmail.com',
      password: 'secret',
      isActive: false,
    }).create()
    const response = await client.post('/login').form({ email: user.email, password: 'secret' })
    response.assertStatus(401)
    expect(response.body()).toStrictEqual({
      message: 'Invalid credentials',
      status: false,
      errors: [{ message: 'Invalid credentials', field: 'Authentication', rule: 'Authentication' }],
    })
  })

  test('it can refresh loged in user token', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei96@gmail.com',
      password: 'secret',
    }).create()
    const response = await client.post('/login').form({ email: user.email, password: 'secret' })

    const response2 = await client
      .post('/refresh')
      .bearerToken(response.body().payload.token)
      .form({ refresh_token: response.body().payload.refreshToken })
    response.assertStatus(200)
    expect(response2.body()).toStrictEqual({
      message: 'authenticated',
      status: true,
      payload: {
        type: 'bearer',
        token: response2.body().payload.token,
        refreshToken: response2.body().payload.refreshToken,
        expires_at: response2.body().payload.expires_at,
      },
    })
  })

  test('it can not refresh loged in user token if no token provided', async ({
    client,
    expect,
  }) => {
    const user = await UserFactory.merge({
      email: 'omakei96@gmail.com',
      password: 'secret',
    }).create()
    const response = await client.post('/login').form({ email: user.email, password: 'secret' })

    const response2 = await client
      .post('/refresh')
      .bearerToken(response.body().payload.token)
      .form({ refresh_token: null })
    response.assertStatus(200)
    expect(response2.body()).toStrictEqual({
      message: 'Invalid credentials',
      status: false,
      errors: [
        {
          message: 'Invalid credentials',
          field: 'Authentication',
          rule: 'Authentication',
        },
      ],
    })
  })

  test('it can not refresh loged in user token if invalid token provided', async ({
    client,
    expect,
  }) => {
    const user = await UserFactory.merge({
      email: 'omakei96@gmail.com',
      password: 'secret',
    }).create()
    const response = await client.post('/login').form({ email: user.email, password: 'secret' })

    const response2 = await client
      .post('/refresh')
      .bearerToken(response.body().payload.token)
      .form({ refresh_token: '8028ff82a5e4770fe5bfb2a3aa10323f0597ef70c8925577d6e7ff94b209493f' })
    response.assertStatus(200)
    expect(response2.body()).toStrictEqual({
      message: 'Invalid credentials',
      status: false,
      errors: [
        {
          message: 'Invalid credentials',
          field: 'Authentication',
          rule: 'Authentication',
        },
      ],
    })
  })

  test('it allow authenticated use to send request', async ({ client, expect }) => {
    mockCustomerService()
    const user = await UserFactory.merge({
      email: 'omakei9@gmail.com',
      password: 'secret',
    }).create()
    const response = await client.post('/login').form({ email: user.email, password: 'secret' })

    const response2 = await client
      .get('/customers')
      .header('x-bbtz-url', '/address')
      .bearerToken(response.body().payload.token)
      .form({ refresh_token: response.body().payload.refreshToken })
    // console.log(response2.body())

    response.assertStatus(200)
    expect(response2.body()).toStrictEqual({
      contact: { phone: '+25562593171', address: 'Kilimanjaro Moshi' },
    })
  })

  test('it reject authenticated request with no x-bbtz-url', async ({ client, expect }) => {
    mockCustomerService()
    const user = await UserFactory.merge({
      email: 'omakei93@gmail.com',
      password: 'secret',
    }).create()
    const response = await client.post('/login').form({ email: user.email, password: 'secret' })

    const response2 = await client
      .get('/customers')
      .bearerToken(response.body().payload.token)
      .form({ refresh_token: response.body().payload.refreshToken })
    // console.log(response2.body())

    response.assertStatus(200)
    expect(response2.body()).toStrictEqual({
      message: 'No x-bbtz-url header was passed.',
      status: false,
      errors: [
        { rule: 'check header', field: 'header', message: 'No x-bbtz-url header was passed.' },
      ],
    })
  })

  test('it reject authenticated request with wrong jwt', async ({ client, expect }) => {
    mockCustomerService()
    const user = await UserFactory.merge({
      email: 'omakei93@gmail.com',
      password: 'secret',
    }).create()
    const response = await client.post('/login').form({ email: user.email, password: 'secret' })

    const response2 = await client
      .get('/customers')
      .bearerToken('omakei')
      .form({ refresh_token: response.body().payload.refreshToken })
    // console.log(response2.body())

    response.assertStatus(200)
    expect(response2.body()).toStrictEqual({ message: 'Authentication failed.' })
  })

  test('it can logout user', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei@gmail.com',
      password: 'secret',
    }).create()
    const response = await client.post('/login').form({ email: user.email, password: 'secret' })
    const response2 = await client
      .post('/logout')
      .bearerToken(response.body().payload.token)
      .form({ refresh_token: response.body().payload.refreshToken })

    response.assertStatus(200)
    expect(response2.body()).toStrictEqual({
      message: 'logout successful',
      status: true,
      payload: {
        type: null,
        token: null,
        refreshToken: null,
        expires_at: null,
      },
    })
  })

  test('it can current authenticated user', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei2@gmail.com',
      password: 'secret',
    }).create()
    const response = await client.post('/login').form({ email: user.email, password: 'secret' })
    const response2 = await client.get('/me').bearerToken(response.body().payload.token)

    response.assertStatus(200)
    expect(response2.body()).toStrictEqual({
      message: 'fetched successful.',
      status: true,
      payload: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          is_active: true,
          roles: [],
          permissions: [],
        },
      },
    })
  })

  // test('it throw error if endpoints.json file is incorrect', async ({ client, expect }) => {
  //   const mock = sinon.mock(SchemaValidator.prototype)
  //   mock
  //     .expects('validate')
  //     .once()
  //     .withArgs({
  //       version: 1,
  //       authors: [{ name: 'Michael Omakei', email: 'omakei96@gmail.com', phone: '+255625933171' }],
  //       endpoints: [
  //         {
  //           endpoint: '/customers',
  //           backend: [
  //             {
  //               host: ['http://127.0.0.1:3332'],
  //               url_pattern: '/',
  //               timeout: 2000,
  //             },
  //           ],
  //         },
  //         {
  //           endpoint: '/activation-codes',
  //           backend: [
  //             {
  //               host: ['http://127.0.0.1:3330'],
  //               url_pattern: '/',
  //               timeout: 2000,
  //             },
  //           ],
  //         },
  //       ],
  //     })
  //     .returns([
  //       {
  //         instancePath: '/version',
  //         keyword: 'type',
  //         message: 'must be string',
  //         params: { type: 'string' },
  //         schemaPath: '#/properties/version/type',
  //       },
  //     ])

  //   mockCustomerService()
  //   const user = await UserFactory.merge({
  //     email: 'omakei97@gmail.com',
  //     password: 'secret',
  //   }).create()
  //   const response = await client.post('/login').form({ email: user.email, password: 'secret' })

  //   const response2 = await client
  //     .get('/customers')
  //     .bearerToken('omakei')
  //     .form({ refresh_token: response.body().payload.refreshToken })
  //   console.log(response2.body())
  //   mock.verify()
  //   mock.restore()

  //   response.assertStatus(200)
  //   expect(response2.body()).toStrictEqual({ message: 'Authentication failed.' })
  // })
})
