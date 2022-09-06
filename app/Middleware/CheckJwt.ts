import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckJwt {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    try {
      await ctx.auth.use('jwt').authenticate()
    } catch (error) {
      ctx.logger.error(error)
      return ctx.response.unauthorized({ message: 'Authentication failed.' })
    }

    ctx.user = await ctx.auth.use('jwt').payload!.user

    await next()
  }
}
