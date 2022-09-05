import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Role from 'App/Models/Role'
import { UserFactory } from 'Database/factories'

test.group('Roles controller', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can list role', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei1@gmail.com',
      password: 'secret',
    }).create()
    const response1 = await client.post('/login').form({ email: user.email, password: 'secret' })
    const response = await client
      .get('api-gateway/roles/index')
      .bearerToken(response1.body().payload.token)
    response.assertStatus(200)

    expect(response.body().payload.length).toBe(7)
  })

  test('it can list permissions', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei2@gmail.com',
      password: 'secret',
    }).create()
    const response1 = await client.post('/login').form({ email: user.email, password: 'secret' })
    const response = await client
      .get('api-gateway/roles/permissions')
      .bearerToken(response1.body().payload.token)
    response.assertStatus(200)

    expect(response.body().payload.length).toBe(12)
  })

  test('it can store role', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei3@gmail.com',
      password: 'secret',
    }).create()
    const response1 = await client.post('/login').form({ email: user.email, password: 'secret' })
    const response = await client
      .post('api-gateway/roles/store')
      .bearerToken(response1.body().payload.token)
      .form({ name: 'admin', description: 'admin', permissions: [{ id: 1 }, { id: 2 }, { id: 3 }] })
    response.assertStatus(200)
    expect(response.body()).toStrictEqual({
      message: 'created successful.',
      status: true,
      payload: {
        name: 'admin',
        description: 'admin',
        created_at: response.body().payload.created_at,
        updated_at: response.body().payload.updated_at,
        id: response.body().payload.id,
      },
    })
  })

  test('it can update role', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei5@gmail.com',
      password: 'secret',
    }).create()
    const response1 = await client.post('/login').form({ email: user.email, password: 'secret' })
    const role = await Role.first()
    const response = await client
      .put('api-gateway/roles/update/' + role?.id)
      .bearerToken(response1.body().payload.token)
      .form({ name: 'admin', description: 'admin', permissions: [{ id: 1 }, { id: 2 }, { id: 3 }] })
    response.assertStatus(200)
    expect(response.body()).toStrictEqual({
      message: 'updated successful.',
      status: true,
      payload: {
        name: 'admin',
        description: 'admin',
        created_at: response.body().payload.created_at,
        updated_at: response.body().payload.updated_at,
        id: response.body().payload.id,
      },
    })
  })

  test('it can show role', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei6@gmail.com',
      password: 'secret',
    }).create()
    const response1 = await client.post('/login').form({ email: user.email, password: 'secret' })
    const role = await Role.first()
    const response = await client
      .get('api-gateway/roles/show/' + role?.id)
      .bearerToken(response1.body().payload.token)
    response.assertStatus(200)
    expect(response.body()).toStrictEqual({
      message: 'fetched successful.',
      status: true,
      payload: {
        name: role?.name,
        description: role?.description,
        created_at: response.body().payload.created_at,
        updated_at: response.body().payload.updated_at,
        id: role?.id,
      },
    })
  })

  test('it can delete role', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei8@gmail.com',
      password: 'secret',
    }).create()
    const response1 = await client.post('/login').form({ email: user.email, password: 'secret' })
    const role = await Role.first()
    const response = await client
      .delete('api-gateway/roles/delete/' + role?.id)
      .bearerToken(response1.body().payload.token)
    response.assertStatus(200)
    expect(response.body()).toStrictEqual({
      message: 'deleted successful.',
      status: true,
      payload: {
        name: role?.name,
        description: role?.description,
        created_at: response.body().payload.created_at,
        updated_at: response.body().payload.updated_at,
        id: role?.id,
      },
    })
  })
})
