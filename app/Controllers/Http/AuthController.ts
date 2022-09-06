import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class AuthController {
  public async login({ auth, request, response, logger }: HttpContextContract) {
    const validations = schema.create({
      email: schema.string([rules.required(), rules.exists({ table: 'users', column: 'email' })]),
      password: schema.string([rules.required()]),
    })
    try {
      const payload = await request.validate({ schema: validations })
      const user = await this.getUser(payload.email)
      if (!user?.isActive) {
        return response.status(401).sendApiResponse({
          message: 'Invalid credentials',
          status: false,
          errors: [
            { message: 'Invalid credentials', field: 'Authentication', rule: 'Authentication' },
          ],
        })
      }

      if (!(await Hash.verify(user?.password as string, payload.password))) {
        return response.status(401).sendApiResponse({
          message: 'Invalid credentials',
          status: false,
          errors: [
            { message: 'Invalid credentials', field: 'Authentication', rule: 'Authentication' },
          ],
        })
      }
      const jwt = await auth.use('jwt').login(user as User, {
        payload: await this.jwtPayload(user),
      })

      return response.sendApiResponse({ message: 'authenticated', status: true, payload: jwt })
    } catch (error) {
      logger.error(error)
      return response.sendApiResponse({
        message: 'Invalid credentials',
        status: false,
        errors: [
          { message: 'Invalid credentials', field: 'Authentication', rule: 'Authentication' },
        ],
      })
    }
  }

  public async refresh({ request, auth, response, logger }: HttpContextContract) {
    const validations = schema.create({
      refresh_token: schema.string([rules.required()]),
    })

    const user = await this.getUser(auth.use('jwt').user?.email as string)

    try {
      const payload = await request.validate({ schema: validations })
      const jwt = await auth.use('jwt').loginViaRefreshToken(payload.refresh_token, {
        payload: this.jwtPayload(user as User),
      })
      return response.sendApiResponse({ message: 'authenticated', status: true, payload: jwt })
    } catch (error) {
      logger.error(error)
      return response.sendApiResponse({
        message: 'Invalid credentials',
        status: false,
        errors: [
          { message: 'Invalid credentials', field: 'Authentication', rule: 'Authentication' },
        ],
      })
    }
  }

  public async logout({ auth, response, request }: HttpContextContract) {
    const validations = schema.create({
      refresh_token: schema.string([rules.required()]),
    })
    const payload = await request.validate({ schema: validations })
    await auth.use('jwt').revoke({ refreshToken: payload.refresh_token })
    return response.sendApiResponse({
      message: 'logout successful',
      status: true,
      payload: {
        type: null,
        token: null,
        refreshToken: null,
        expires_at: null,
      },
    })
  }

  private async jwtPayload(user: User) {
    return {
      user: {
        id: user?.id,
        username: user?.username,
        email: user?.email,
        is_active: user?.isActive,
        roles: user?.roles.map((role) => role.serialize()),
        permissions: user?.permissions.map((permission) => permission.serialize()),
      },
    }
  }

  private async getUser(email: string) {
    return await User.query().preload('permissions').preload('roles').where('email', email).first()
  }

  public async me({ auth, response }: HttpContextContract) {
    const user = await this.getUser(auth.use('jwt').user?.email as string)
    response.sendApiResponse({
      message: 'fetched successful.',
      status: true,
      payload: await this.jwtPayload(user as User),
    })
  }
}
