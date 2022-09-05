import Ajv from 'ajv'

export default class SchemaValidator {
  public validate(schema: any) {
    const ajv = new Ajv({ allErrors: true })

    const validate = ajv.compile(this.getValidatorSchema())
    const valid = validate(schema)

    if (!valid) {
      return validate.errors
    }

    return null
  }

  private getValidatorSchema() {
    return {
      type: 'object',
      properties: {
        version: { type: 'string', default: 'v1' },
        authors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
              phone: { type: 'string' },
            },
            required: ['name', 'email'],
          },
        },
        endpoints: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              endpoint: { type: 'string' },
              backend: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    host: { type: 'array' },
                    url_pattern: { type: 'string' },
                    timeout: { type: 'number' },
                  },
                  required: ['host', 'url_pattern', 'timeout'],
                },
              },
            },
            required: ['endpoint', 'backend'],
          },
        },
      },
      required: ['version', 'authors', 'endpoints'],
    }
  }
}
