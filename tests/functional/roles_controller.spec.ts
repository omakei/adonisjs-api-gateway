import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Role from 'App/Models/Role'

test.group('Roles controller', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can list role', async ({ client, expect }) => {
    const response = await client.get('api-gateway/roles/index')
    response.assertStatus(200)

    expect(response.body().payload.length).toBe(7)
  })

  test('it can list permissions', async ({ client, expect }) => {
    const response = await client.get('api-gateway/roles/permissions')
    response.assertStatus(200)

    expect(response.body().payload.length).toBe(12)
  })

  test('it can store role', async ({ client, expect }) => {
    const response = await client
      .post('api-gateway/roles/store')
      .form({ name: 'admin', description: 'admin', permissions: [{ id: 1 }, { id: 2 }, { id: 3 }] })
    response.assertStatus(200)
    expect(response.body()).toStrictEqual({
      message: 'fetched successful.',
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
    const role = await Role.first()
    const response = await client
      .put('api-gateway/roles/update/' + role?.id)
      .form({ name: 'admin', description: 'admin', permissions: [{ id: 1 }, { id: 2 }, { id: 3 }] })
    response.assertStatus(200)
    expect(response.body()).toStrictEqual({
      message: 'fetched successful.',
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
    const role = await Role.first()
    const response = await client.get('api-gateway/roles/show/' + role?.id)
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
    const role = await Role.first()
    const response = await client.delete('api-gateway/roles/delete/' + role?.id)
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
