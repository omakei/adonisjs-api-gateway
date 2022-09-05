import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'

export default {
  uiEnabled: true, //disable or enable swaggerUi route
  uiUrl: 'docs', // url path to swaggerUI
  specEnabled: true, //disable or enable swagger.json route
  specUrl: '/swagger.json',

  middleware: [], // middlewares array, for protect your swagger docs and spec endpoints

  options: {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Adonis API Gateway Docs',
        version: '1.0.0',
        description:
          'This is API Gateway design to enable communication between public internet and private microservices',
        author: 'Michael Omakei',
        contact: {
          email: 'omakei96@gmail.com',
          phone: '+255625933171',
        },
      },
    },

    apis: ['app/**/*.ts', 'docs/swagger/**/*.yml', 'start/routes.ts', 'docs/**/*.yml'],
    basePath: '/',
  },
  mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'RUNTIME',
  specFilePath: 'docs/swagger.json',
} as SwaggerConfig
