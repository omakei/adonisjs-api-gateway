import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SchemaValidator from 'App/Action/SchemaValidator'
import endpoints from './../../endpoints.json'

export default class ValidateEndpoint {
  public async handle({ response }: HttpContextContract, next: () => Promise<void>) {
    const validation = new SchemaValidator().validate(endpoints)
    // eslint-disable-next-line eqeqeq
    if (validation != null) {
      return response.badGateway({
        message: 'Invalid endpoint schema file validation.',
        errors: validation,
      })
    }
    await next()
  }
}
