import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckBbtzHeader {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // eslint-disable-next-line eqeqeq
    if (request.header('x-bbtz-url') == null) {
      return response.sendApiResponse({
        message: 'No x-bbtz-url header was passed.',
        status: false,
        errors: [
          { rule: 'check header', field: 'header', message: 'No x-bbtz-url header was passed.' },
        ],
      })
    }

    await next()
  }
}
