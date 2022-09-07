import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    const roles = await Role.createMany([
      {
        name: 'management members',
        description: 'management members',
      },
      {
        name: 'cs team leader',
        description: 'cs team leader',
      },
      {
        name: 'csm team',
        description: 'csm team',
      },
      {
        name: 'admin',
        description: 'admin system manager',
      },
      {
        name: 'it team',
        description: 'it team',
      },
      {
        name: 'cs team',
        description: 'csm team',
      },
      {
        name: 'guest',
        description: 'guest',
      },
    ])

    const permissions = await Permission.createMany([
      { name: 'users.create' },
      { name: 'users.view' },
      { name: 'users.update' },
      { name: 'users.delete' },

      { name: 'roles.create' },
      { name: 'roles.view' },
      { name: 'roles.update' },
      { name: 'roles.delete' },

      { name: 'cuctomers.create' },
      { name: 'cuctomers.view' },
      { name: 'cuctomers.update' },
      { name: 'cuctomers.delete' },

      { name: 'asserts.create' },
      { name: 'asserts.view' },
      { name: 'asserts.update' },
      { name: 'asserts.delete' },
    ])

    const user = await User.create({
      username: 'Michael Omakei',
      email: 'omakei91@gmail.com',
      password: 'password',
    })

    await user.related('roles').attach([...roles.map((role) => role.id)])
    await user.related('permissions').attach([...permissions.map((permission) => permission.id)])
    // roles.forEach((role) =>
    //   role.related('permissions').attach([...permissions.map((permission) => permission.id)])
    // )
  }
}
