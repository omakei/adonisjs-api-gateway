import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckJwt {
  public async handle(
    { auth, response, logger, user }: HttpContextContract,
    next: () => Promise<void>
  ) {
    try {
      await auth.use('jwt').authenticate()
    } catch (error) {
      logger.error(error)
      return response.unauthorized({ message: 'Authentication failed.' })
    }

    user = await auth.use('jwt').payload!.user
    console.log(user)
    logger.info('Decoded user', user.id)
    await next()
  }
}
