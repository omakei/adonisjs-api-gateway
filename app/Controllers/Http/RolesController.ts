import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import Cache from '@ioc:Adonis/Addons/Cache'

export default class RolesController {
  public async index(ctx: HttpContextContract) {
    await ctx.bouncer.authorize('hasRoleOrPermission' as never, {
      roles: ['admin'],
      permission: 'roles.view',
    })

    const roles = await Cache.remember('roles', 60000, async () => {
      return (await Role.all()).map((role) => role.serialize())
    })

    return ctx.response.sendApiResponse({
      message: 'fetched successful.',
      status: true,
      payload: roles,
    })
  }

  public async store({ request, response, bouncer }: HttpContextContract) {
    await bouncer.authorize('hasRoleOrPermission' as never, {
      roles: ['admin'],
      permission: 'roles.create',
    })

    const validations = schema.create({
      name: schema.string([rules.required()]),
      description: schema.string(),
      permissions: schema.array().members(
        schema.object().members({
          id: schema.number([rules.exists({ table: 'permissions', column: 'id' })]),
        })
      ),
    })

    const payload = await request.validate({ schema: validations })
    const role = await Role.create({ name: payload.name, description: payload.description })
    await role
      .related('permissions')
      .attach([...payload.permissions.map((permission) => permission.id)])
    return response.sendApiResponse({
      message: 'created successful.',
      status: true,
      payload: role,
    })
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    await bouncer.authorize('hasRoleOrPermission' as never, {
      roles: ['admin'],
      permission: 'roles.update',
    })

    const validations = schema.create({
      name: schema.string([rules.required()]),
      description: schema.string(),
      permissions: schema.array().members(
        schema.object().members({
          id: schema.number([rules.exists({ table: 'permissions', column: 'id' })]),
        })
      ),
    })

    const payload = await request.validate({ schema: validations })
    const role = await Role.create({ name: payload.name, description: payload.description })
    await role
      .related('permissions')
      .attach([...payload.permissions.map((permission) => permission.id)])
    return response.sendApiResponse({
      message: 'updated successful.',
      status: true,
      payload: role,
    })
  }

  public async show({ request, response, bouncer }: HttpContextContract) {
    await bouncer.authorize('hasRoleOrPermission' as never, {
      roles: ['admin'],
      permission: 'roles.view',
    })

    const role = await Role.findOrFail(request.param('id'))

    return response.sendApiResponse({
      message: 'fetched successful.',
      status: true,
      payload: role.serialize(),
    })
  }

  public async delete({ request, response, bouncer }: HttpContextContract) {
    await bouncer.authorize('hasRoleOrPermission' as never, {
      roles: ['admin'],
      permission: 'roles.delete',
    })

    const role = await Role.findOrFail(request.param('id'))
    role.delete()
    return response.sendApiResponse({
      message: 'deleted successful.',
      status: true,
      payload: role.serialize(),
    })
  }

  public async permissions({ response, bouncer }: HttpContextContract) {
    await bouncer.authorize('hasRoleOrPermission' as never, {
      roles: ['admin'],
      permission: 'roles.delete',
    })

    const permissions = await Permission.all()
    return response.sendApiResponse({
      message: 'fetched successful.',
      status: true,
      payload: permissions.map((permission) => permission.serialize()),
    })
  }
}
