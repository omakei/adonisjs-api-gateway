import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {
  public async index({ response, bouncer }: HttpContextContract) {
    await bouncer.authorize('hasRoleOrPermission' as never, {
      roles: ['admin'],
      permission: 'users.view',
    })

    const users = await User.query().preload('permissions').preload('roles')

    return response.sendApiResponse({
      message: 'user status deleted successful.',
      status: true,
      payload: users.map((user) => user.serialize()),
    })
  }
  public async register({ request, response, logger, bouncer }: HttpContextContract) {
    await bouncer.authorize('hasRoleOrPermission' as never, {
      roles: ['admin'],
      permission: 'users.create',
    })

    const validations = schema.create({
      username: schema.string([
        rules.required(),
        rules.unique({ table: 'users', column: 'username' }),
      ]),
      email: schema.string([rules.required(), rules.unique({ table: 'users', column: 'email' })]),
      country: schema.string.optional(),
      password: schema.string([rules.required()]),
      roles: schema.array().members(
        schema.object().members({
          id: schema.number([rules.exists({ table: 'roles', column: 'id' })]),
        })
      ),
      permissions: schema.array().members(
        schema.object().members({
          id: schema.number([rules.exists({ table: 'permissions', column: 'id' })]),
        })
      ),
    })

    const payload = await request.validate({ schema: validations })

    try {
      const user = await User.create({
        username: payload.username,
        email: payload.email,
        password: payload.password,
        country: payload?.country,
      })

      await user.related('roles').attach([...payload.roles.map((role) => role.id)])
      await user
        .related('permissions')
        .attach([...payload.permissions.map((permission) => permission.id)])

      return response.sendApiResponse({
        message: 'user created successful.',
        status: true,
        payload: user,
      })
    } catch (error) {
      logger.error(error)
      return response.sendApiResponse({
        message: 'failed to create user.',
        status: false,
        errors: [{ field: 'auth', rule: 'authentication', message: 'failed to create user.' }],
      })
    }
  }

  public async changeUserStatus({ request, response, bouncer }: HttpContextContract) {
    await bouncer.authorize('hasRoleOrPermission' as never, {
      roles: ['admin'],
      permission: 'users.update',
    })

    const user = await User.findOrFail(request.param('id'))
    user.isActive = !user.isActive
    user.save()

    return response.sendApiResponse({
      message: 'user status updated successful.',
      status: true,
      payload: user,
    })
  }

  public async update({ request, response, logger, bouncer }: HttpContextContract) {
    await bouncer.authorize('hasRoleOrPermission' as never, {
      roles: ['admin'],
      permission: 'users.update',
    })

    const user = await User.findOrFail(request.param('id'))
    const validations = schema.create({
      username: schema.string([
        rules.required(),
        rules.unique({
          table: 'users',
          column: 'username',
          whereNot: {
            id: user.id,
          },
        }),
      ]),
      email: schema.string([
        rules.required(),
        rules.unique({
          table: 'users',
          column: 'email',
          whereNot: {
            id: user.id,
          },
        }),
      ]),
      country: schema.string.optional(),
      password: schema.string([rules.required()]),
      roles: schema.array().members(
        schema.object().members({
          id: schema.number([rules.exists({ table: 'roles', column: 'id' })]),
        })
      ),
      permissions: schema.array().members(
        schema.object().members({
          id: schema.number([rules.exists({ table: 'permissions', column: 'id' })]),
        })
      ),
    })

    const payload = await request.validate({ schema: validations })

    try {
      user.username = payload.username
      user.email = payload.email
      user.password = payload.password
      //@ts-ignore
      user.country = payload.country
      user.save()

      await user.related('roles').sync([...payload.roles.map((role) => role.id)])
      await user
        .related('permissions')
        .sync([...payload.permissions.map((permission) => permission.id)])

      return response.sendApiResponse({
        message: 'user updated successful.',
        status: true,
        payload: user,
      })
    } catch (error) {
      logger.error(error)
      return response.sendApiResponse({
        message: 'failed to update user.',
        status: false,
        errors: [{ field: 'auth', rule: 'authentication', message: 'failed to update user.' }],
      })
    }
  }

  public async delete({ request, response, bouncer }: HttpContextContract) {
    await bouncer.authorize('hasRoleOrPermission' as never, {
      roles: ['admin'],
      permission: 'users.delete',
    })

    const user = await User.findOrFail(request.param('id'))
    user.delete()

    return response.sendApiResponse({
      message: 'user status deleted successful.',
      status: true,
      payload: user,
    })
  }
}
