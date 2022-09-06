import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import { UserFactory } from 'Database/factories'

test.group('User controller', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can list user', async ({ client, expect }) => {
    const users = await UserFactory.createMany(5)
    const permissions = await Permission.all()
    users.forEach(async (user) => {
      await user.related('roles').attach([(await Role.first())?.id as number])
      await user.related('permissions').attach([...permissions.map((permission) => permission.id)])
    })
    const response1 = await client
      .post('/login')
      .form({ email: users[0].email, password: 'secret' })
    const response = await client
      .get('api-gateway/users/index')
      .bearerToken(response1.body().payload.token)
    response.assertStatus(200)

    expect(response.body().payload.length).toBe(6)
    expect(response.body().payload[0].roles.length).not.toBe(0)
    expect(response.body().payload[0].permissions.length).not.toBe(0)
  })

  test('it can register user', async ({ client, expect }) => {
    const user = await User.first()
    const response1 = await client.post('/login').form({ email: user?.email, password: 'password' })
    const response = await client
      .post('api-gateway/users/register')
      .bearerToken(response1.body().payload.token)
      .form({
        username: 'omakei',
        email: 'omakei96@gmail.com',
        password: 'secret',
        country: 'TZ',
        roles: [{ id: 1 }, { id: 2 }, { id: 3 }],
        permissions: [{ id: 1 }, { id: 2 }, { id: 3 }],
      })
    response.assertStatus(200)
    expect(response.body()).toStrictEqual({
      message: 'user created successful.',
      status: true,
      payload: {
        username: 'omakei',
        email: 'omakei96@gmail.com',
        country: 'TZ',
        created_at: response.body().payload.created_at,
        updated_at: response.body().payload.updated_at,
        id: response.body().payload.id,
      },
    })
  })

  test('it can change user status', async ({ client, expect }) => {
    const user = await User.first()
    const response1 = await client.post('/login').form({ email: user?.email, password: 'password' })
    const response = await client
      .get('api-gateway/users/change-user-status/' + user?.id)
      .bearerToken(response1.body().payload.token)
    response.assertStatus(200)
    expect(response.body()).toStrictEqual({
      message: 'user status updated successful.',
      status: true,
      payload: {
        username: user?.username,
        country: null,
        is_active: false,
        remember_me_token: null,
        email: user?.email,
        created_at: response.body().payload.created_at,
        updated_at: response.body().payload.updated_at,
        id: response.body().payload.id,
      },
    })
  })

  test('it can update user', async ({ client, expect }) => {
    const user = await User.first()
    const response1 = await client.post('/login').form({ email: user?.email, password: 'password' })
    const response = await client
      .put('api-gateway/users/update/' + user?.id)
      .bearerToken(response1.body().payload.token)
      .form({
        username: 'omakei',
        email: 'omakei96@gmail.com',
        password: 'secret',
        country: 'TZ',
        roles: [{ id: 1 }, { id: 2 }, { id: 3 }],
        permissions: [{ id: 1 }, { id: 2 }, { id: 3 }],
      })
    response.assertStatus(200)
    expect(response.body()).toStrictEqual({
      message: 'user updated successful.',
      status: true,
      payload: {
        username: 'omakei',
        email: 'omakei96@gmail.com',
        country: 'TZ',
        is_active: true,
        remember_me_token: null,
        created_at: response.body().payload.created_at,
        updated_at: response.body().payload.updated_at,
        id: response.body().payload.id,
      },
    })
  })

  test('it can delete user', async ({ client, expect }) => {
    const user = await UserFactory.merge({
      email: 'omakei1@gmail.com',
      password: 'password',
    }).create()

    const response1 = await client.post('/login').form({ email: user?.email, password: 'password' })
    const permissions = await Permission.all()
    await user.related('permissions').attach([...permissions.map((permission) => permission.id)])

    const response = await client
      .delete('api-gateway/users/delete/' + user?.id)
      .bearerToken(response1.body().payload.token)
    response.assertStatus(200)
    expect(response.body()).toStrictEqual({
      message: 'user status deleted successful.',
      status: true,
      payload: {
        username: user?.username,
        country: null,
        is_active: true,
        remember_me_token: null,
        email: user?.email,
        created_at: response.body().payload.created_at,
        updated_at: response.body().payload.updated_at,
        id: response.body().payload.id,
      },
    })
  })
})
