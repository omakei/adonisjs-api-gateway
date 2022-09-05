import { test } from '@japa/runner'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

test.group('Roles and Permissions Validaitions', () => {
  test('it can list roles and user for permission', async ({ expect }) => {
    const permissions = await Permission.query().preload('roles').preload('users')
    permissions.forEach((permission) => expect(permission.roles.length).not.toBe(0))
    permissions.forEach((permission) => expect(permission.users.length).not.toBe(0))
  })

  test('it can list permissions and user for role', async ({ expect }) => {
    const roles = await Role.query().preload('users').preload('permissions')
    roles.forEach((role) => expect(role.users.length).not.toBe(0))
    roles.forEach((role) => expect(role.permissions.length).not.toBe(0))
  })

  test('it can list permissions and roles for user', async ({ expect }) => {
    const users = await User.query().preload('roles').preload('permissions')
    users.forEach((user) => expect(user.roles.length).not.toBe(0))
    users.forEach((user) => expect(user.permissions.length).not.toBe(0))
  })
})
