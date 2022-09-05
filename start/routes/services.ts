import axios from 'axios'
import Route from '@ioc:Adonis/Core/Route'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import endpoints from './../../endpoints.json'
import axiosRetry from 'axios-retry'

Route.group(async () => {
  endpoints.endpoints.forEach((endpoint) => {
    Route.any(endpoint.endpoint, async ({ response, request, logger }: HttpContextContract) => {
      const url = (endpoint.backend[0].host + request.header('x-bbtz-url')!) as string
      axiosRetry(axios, { retries: 5 })
      return await axios({
        method: request.method(),
        url: url,
        // eslint-disable-next-line eqeqeq
        data: request.raw() != null ? request.raw() : request.body(),
        timeout: Number(endpoint.backend[0].timeout),
        validateStatus: (status) => status < 501,
        headers: { Authorization: request.header('authorization') as string },
      })
        .then((data) => response.send(data.data))
        .catch((error) => {
          logger.error(error)
          response.send(error.message)
        })
    })
      .middleware('check_jwt')
      .middleware('check_bbtz_header')
  })
})
