import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { ApiResponse } from 'Contracts/utilites'
export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const Response = this.app.container.use('Adonis/Core/Response')

    Response.macro('sendApiResponse', function (responseData: ApiResponse<any>) {
      this.ctx!.response.send(responseData)
      return this
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
