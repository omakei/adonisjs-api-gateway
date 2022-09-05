# adonis-api-gateway

API gateway for build with adonisjs this is of making life easy for microservices and nodejs enthusiast.

## Build

The stack

- Adonis framework
- TypeScript language

## Installation Requirements

- Node JS version 14.0.0 or above.
- Database (PostgreSQL).
- API client (such as [Postman](https://www.postman.com/), [Insomnia](https://insomnia.rest/)).

## Installation

- Clone the project from github.

  ```bash
  git clone https://github.com/baridibaridi-com/adonis-api-gateway.git
  ```

- Run npm install command to install all dependencies.

  ```bash
  npm install
  ```

- Create a `.env` file and paste in the the following contents in the created `.env` file.

  ```properties
    PORT=3333
    HOST=0.0.0.0
    NODE_ENV=development
    APP_KEY=
    DRIVE_DISK=local

    # Database connection
    # ~~~
    DB_CONNECTION=pg
    PG_HOST=localhost
    PG_PORT=5432
    PG_USER=
    PG_PASSWORD=
    PG_DB_NAME=
  ```

- Craate APP_KEY by running this command

  ```bash
    node ace key:generate
  ```

- Create database connection to postgreSQL by filling out `database user`, `password` and `database name` in the `.env` file.

- Perform database migration to create database schema in postgreSQL database.

  ```properties
  node ace migration:run
  ```

- Migrate initial data to the database required to run and test the API.

  ```properties
  node ace db:seed
  ```

- Serve the API. Run the following command.

  ```properties
  node ace serve --watch
  ```

## Endpoints file

you must define your microservices urls in the `endpoints.json` file which is located on the roor directory of the project.

```json
{
  /**
   *
   * Version for the endpoints file currently its at verision 1 so please v1 as the default valie
   *  default value "v1"
   *
   */
  "version": "v1",
  /**
   *
   * The "authors" key is the array of object containg author name , email and phone
   * mandatory filed are "name", "email", "phone"
   *
   */
  "authors": [
    { "name": "Michael Omakei", "email": "omakei96@gmail.com", "phone": "+255625933171" } // authors name
  ],
  /**
   * The "endpoint" key contains the list of all backend services
   * the service object must have "endpoint" key which contain the endpoint which the
   * public will use to access the backend service
   * The "backend" key contain the object which defiends array of hosts, url_pattern and timeout for calling
   * that backend service(s)
   *
   */
  "endpoints": [
    {
      "endpoint": "/customers",
      "backend": [
        {
          "host": ["http://127.0.0.1:3332"],
          "url_pattern": "/",
          "timeout": 2000
        }
      ]
    },
    {
      "endpoint": "/activation-codes",
      "backend": [
        {
          "host": ["http://127.0.0.1:3330"],
          "url_pattern": "/",
          "timeout": 2000
        }
      ]
    }
  ]
}
```

## Usage

## User Management

### Register user

You can use this endpoint to register user who want to access backend services

```js
    const response = await axios.post('http://127.0.0.1:3333/api-gateway/users/register').form({
      username: 'omakei',
      email: 'omakei96@gmail.com',
      password: 'secret',
      country: 'TZ',
      roles: [{ id: 1 }, { id: 2 }, { id: 3 }],
      permissions: [{ id: 1 }, { id: 2 }, { id: 3 }],
    })

    //Respose stracture

    {
      message: 'user created successful.',
      status: true,
      payload: {
        username: 'omakei',
        email: 'omakei96@gmail.com',
        country: 'TZ',
        created_at: '2022-08-20 11:11:11',
        updated_at: '2022-08-20 11:11:11',
        id: 1,
      },
    }
```

### Change user status

You can use this endpoint to status of the user who want to access backend services

```js
     const response = await axios.get('http://127.0.0.1:3333/api-gateway/users/change-user-status/2')


    // response stracture
    {
      message: 'user status updated successful.',
      status: true,
      payload: {
        username: user.username,
        country: null,
        is_active: false,
        remember_me_token: null,
        email: 'omakei@gmail.com',
        created_at: '2022-08-20 11:11:11',
        updated_at: '2022-08-20 11:11:11',
        id: 2,
      },
    }
```

### Update user

You can use this endpoint to update user who want to access backend services

```js
    const response = await axios.put('http://127.0.0.1:3333/api-gateway/users/update/2').form({
      username: 'omakei',
      email: 'omakei96@gmail.com',
      password: 'secret',
      country: 'TZ',
      roles: [{ id: 1 }, { id: 2 }, { id: 3 }],
      permissions: [{ id: 1 }, { id: 2 }, { id: 3 }],
    })


    //response stracture
    {
      message: 'user updated successful.',
      status: true,
      payload: {
        username: 'omakei',
        email: 'omakei96@gmail.com',
        country: 'TZ',
        is_active: true,
        remember_me_token: null,
        created_at: '2022-08-20 11:11:11',
        updated_at: '2022-08-20 11:11:11',
        id: 2,
      },
    }
```

### Delete user

You can use this endpoint to delete user who want to access backend services

```js
    const response = await axios.delete('http://127.0.0.1:3333/api-gateway/users/delete/2').form({
      username: 'omakei',
      email: 'omakei96@gmail.com',
      password: 'secret',
      country: 'TZ',
      roles: [{ id: 1 }, { id: 2 }, { id: 3 }],
      permissions: [{ id: 1 }, { id: 2 }, { id: 3 }],
    })


    //response stracture
    {
      message: 'user deleted successful.',
      status: true,
      payload: {
        username: 'omakei',
        email: 'omakei96@gmail.com',
        country: 'TZ',
        is_active: true,
        remember_me_token: null,
        created_at: '2022-08-20 11:11:11',
        updated_at: '2022-08-20 11:11:11',
        id: 2,
      },
    }
```

## Authentication

### Login the user

You can use this endpoint to login the user who want to access backend services

```js
    const response = await axios.post('http://127.0.0.1:3333/login').form({ email: 'omakei96@gmail.com', password: 'secret' })

    //response stracture
    {
      message: 'authenticated',
      status: true,
      payload: {
        type: 'bearer',
        token: eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiTWljaGFlbCBPbWFrxfSwiaWF0IjoxNjYyMTE3MDEzLCJleHAiOjE2NjIxMjA2MTN9.zWDXeGqUK3DroLXt3wUuh_ISNw14b12M9nrzh_jDnbxA4MlQDln0Dv5k6rpyIz045X4cD8dVp9LqxudkdMwgFKdhI,
        refreshToken: '8028ff82a5e4770fe5bfb2a3aa10323f0597ef70c8925577d6e7ff94b209493f',
        expires_at: '2022-08-20 11:11:11',
      },
    }

    //Error response stracture
    {
      message: 'Invalid credentials',
      status: false,
      errors: [
        {
          message: 'Invalid credentials',
          field: 'Authentication',
          rule: 'Authentication',
        },
      ],
    }
```

### Refresh JWT token

You can use this endpoint to refresh token of the user who want to access backend services

```js
    const response = await axios.post('http://127.0.0.1:3333/refresh')
        .header('Authorization', 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiTWljaGFlbCBPbWFrxfSwiaWF0IjoxNjYyMTE3MDEzLCJleHAiOjE2NjIxMjA2MTN9.zWDXeGqUK3DroLXt3wUuh_ISNw14b12M9nrzh_jDnbxA4MlQDln0Dv5k6rpyIz045X4cD8dVp9LqxudkdMwgFKdhI')
        .form({ refresh_token: '8028ff82a5e4770fe5bfb2a3aa10323f0597ef70c8925577d6e7ff94b209493f' })

    //response stracture
    {
      message: 'authenticated',
      status: true,
      payload: {
        type: 'bearer',
        token: eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiTWljaGFlbCBPbWFrxfSwiaWF0IjoxNjYyMTE3MDEzLCJleHAiOjE2NjIxMjA2MTN9.zWDXeGqUK3DroLXt3wUuh_ISNw14b12M9nrzh_jDnbxA4MlQDln0Dv5k6rpyIz045X4cD8dVp9LqxudkdMwgFKdhI,
        refreshToken: '8028ff82a5e4770fe5bfb2a3aa10323f0597ef70c8925577d6e7ff94b209493f',
        expires_at: '2022-08-20 11:11:11',
      },
    }

    //Error response stracture
    {
      message: 'Invalid credentials',
      status: false,
      errors: [
        {
          message: 'Invalid credentials',
          field: 'Authentication',
          rule: 'Authentication',
        },
      ],
    }
```

### Send request to backend services

You can send request to backend services base on the endpoint defined on `endpoints.json` file
for each backend request must contain a _`x-bbtz-url`_ which defines the uri at microservice side to call

For example if i want to call customers microservice's `address url` and get the response as defined at this microservice.

```js
    const response = await axios.get('http://127.0.0.1:3333/customers')
        .header('x-bbtz-url', '/address')
        .header('Authorization', 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiTWljaGFlbCBPbWFrxfSwiaWF0IjoxNjYyMTE3MDEzLCJleHAiOjE2NjIxMjA2MTN9.zWDXeGqUK3DroLXt3wUuh_ISNw14b12M9nrzh_jDnbxA4MlQDln0Dv5k6rpyIz045X4cD8dVp9LqxudkdMwgFKdhI')

    //response stracture
    {
      contact: { phone: '+25562593171', address: 'Kilimanjaro Moshi' },
    }

    //error response stracture
    {
      message: 'No x-bbtz-url header was passed.',
      status: false,
      errors: [
        { rule: 'check header', field: 'header', message: 'No x-bbtz-url header was passed.' },
      ],
    }

    //or if jwt is wrong

    { message: 'Authentication failed.' }

```

### Get the current authenticated user

You can use this endpoint to logout the user who want to access backend services

```js
     const response2 = await axios
        .get('http://127.0.0.1:3333/me')
        .header('Authorization', 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiTWljaGFlbCBPbWFrxfSwiaWF0IjoxNjYyMTE3MDEzLCJleHAiOjE2NjIxMjA2MTN9.zWDXeGqUK3DroLXt3wUuh_ISNw14b12M9nrzh_jDnbxA4MlQDln0Dv5k6rpyIz045X4cD8dVp9LqxudkdMwgFKdhI')

    //response stracture
   {
      message: 'fetched successful.',
      status: true,
      payload: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          is_active: true,
          roles: [
            {
                id: 1,
                name: 'admin',
                description: 'admin',
                created_at: '2022-08-20 11:11:11',
                updated_at: '2022-08-20 11:11:11'
            },
            {
                id: 1,
                name: 'admin',
                description: 'admin',
                created_at: '2022-08-20 11:11:11',
                updated_at: '2022-08-20 11:11:11'
            }
        ],
          permissions: [
            {
                id: 1,
                name: 'cs_team.create',
                description: 'admin',
                created_at: '2022-08-20 11:11:11',
                updated_at: '2022-08-20 11:11:11'
            },
            {
                id: 1,
                name: 'cs_team.read',
                description: 'admin',
                created_at: '2022-08-20 11:11:11',
                updated_at: '2022-08-20 11:11:11'
            }
          ],
        },
      },
    }

    //Error response stracture
    {
      message: 'Invalid credentials',
      status: false,
      errors: [
        {
          message: 'Invalid credentials',
          field: 'Authentication',
          rule: 'Authentication',
        },
      ],
    }
```

### Logout the user

You can use this endpoint to logout the user who want to access backend services

```js
     const response2 = await axios
        .post('http://127.0.0.1:3333/logout')
        .header('Authorization', 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiTWljaGFlbCBPbWFrxfSwiaWF0IjoxNjYyMTE3MDEzLCJleHAiOjE2NjIxMjA2MTN9.zWDXeGqUK3DroLXt3wUuh_ISNw14b12M9nrzh_jDnbxA4MlQDln0Dv5k6rpyIz045X4cD8dVp9LqxudkdMwgFKdhI')
        .form({ refresh_token: '8028ff82a5e4770fe5bfb2a3aa10323f0597ef70c8925577d6e7ff94b209493f' })

    //response stracture
    {
      message: 'logout successful',
      status: true,
      payload: {
        type: null,
        token: null,
        refreshToken: null,
        expires_at: null,
      },
    }

    //Error response stracture
    {
      message: 'Invalid credentials',
      status: false,
      errors: [
        {
          message: 'Invalid credentials',
          field: 'Authentication',
          rule: 'Authentication',
        },
      ],
    }
```

## Roles Management

### List Role

You can use this endpoint to list role

```js
     const response2 = await axios
        .get('http://127.0.0.1:3333/api-gateway/roles/index')
        .header('Authorization', 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiTWljaGFlbCBPbWFrxfSwiaWF0IjoxNjYyMTE3MDEzLCJleHAiOjE2NjIxMjA2MTN9.zWDXeGqUK3DroLXt3wUuh_ISNw14b12M9nrzh_jDnbxA4MlQDln0Dv5k6rpyIz045X4cD8dVp9LqxudkdMwgFKdhI')

    //response stracture
   {
      message: 'fetched successful.',
      status: true,
      payload: [
            {
                id: 1,
                name: 'admin',
                description: 'admin',
                created_at: '2022-08-20 11:11:11',
                updated_at: '2022-08-20 11:11:11'
            },
            {
                id: 1,
                name: 'admin',
                description: 'admin',
                created_at: '2022-08-20 11:11:11',
                updated_at: '2022-08-20 11:11:11'
            }
        ],
    }


    //Error response stracture
    {
      message: 'Invalid credentials',
      status: false,
      errors: [
        {
          message: 'Invalid credentials',
          field: 'Authentication',
          rule: 'Authentication',
        },
      ],
    }
```

### List Permissions

You can use this endpoint to list permissions

```js
     const response2 = await axios
        .get('http://127.0.0.1:3333/api-gateway/roles/permissions')
        .header('Authorization', 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiTWljaGFlbCBPbWFrxfSwiaWF0IjoxNjYyMTE3MDEzLCJleHAiOjE2NjIxMjA2MTN9.zWDXeGqUK3DroLXt3wUuh_ISNw14b12M9nrzh_jDnbxA4MlQDln0Dv5k6rpyIz045X4cD8dVp9LqxudkdMwgFKdhI')

    //response stracture
   {
      message: 'fetched successful.',
      status: true,
      payload:  [
            {
                id: 1,
                name: 'cs_team.create',
                description: 'admin',
                created_at: '2022-08-20 11:11:11',
                updated_at: '2022-08-20 11:11:11'
            },
            {
                id: 1,
                name: 'cs_team.read',
                description: 'admin',
                created_at: '2022-08-20 11:11:11',
                updated_at: '2022-08-20 11:11:11'
            }
          ]
    }


    //Error response stracture
    {
      message: 'Invalid credentials',
      status: false,
      errors: [
        {
          message: 'Invalid credentials',
          field: 'Authentication',
          rule: 'Authentication',
        },
      ],
    }
```

### Create Role

You can use this endpoint to create role

```js
     const response2 = await axios
        .post('http://127.0.0.1:3333/api-gateway/roles/store')
        .header('Authorization', 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiTWljaGFlbCBPbWFrxfSwiaWF0IjoxNjYyMTE3MDEzLCJleHAiOjE2NjIxMjA2MTN9.zWDXeGqUK3DroLXt3wUuh_ISNw14b12M9nrzh_jDnbxA4MlQDln0Dv5k6rpyIz045X4cD8dVp9LqxudkdMwgFKdhI')
        .form({ name: 'admin', description: 'admin', permissions: [{ id: 1 }, { id: 2 }, { id: 3 }] })

    //response stracture
    {
      message: 'fetched successful.',
      status: true,
      payload: {
        name: 'admin',
        description: 'admin',
        created_at: '2022-08-20 11:11:11',
        updated_at: '2022-08-20 11:11:11',
        id:1,
      },
    }


    //Error response stracture
    {
      message: 'Invalid credentials',
      status: false,
      errors: [
        {
          message: 'Invalid credentials',
          field: 'Authentication',
          rule: 'Authentication',
        },
      ],
    }
```

### Update Role

You can use this endpoint to update role

```js
     const response2 = await axios
        .put('http://127.0.0.1:3333/api-gateway/roles/update/1')
        .header('Authorization', 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiTWljaGFlbCBPbWFrxfSwiaWF0IjoxNjYyMTE3MDEzLCJleHAiOjE2NjIxMjA2MTN9.zWDXeGqUK3DroLXt3wUuh_ISNw14b12M9nrzh_jDnbxA4MlQDln0Dv5k6rpyIz045X4cD8dVp9LqxudkdMwgFKdhI')
        .form({ name: 'omakei is admin', description: 'admin', permissions: [{ id: 1 }, { id: 2 }, { id: 3 }] })

    //response stracture
    {
      message: 'updated successful.',
      status: true,
      payload: {
        name: 'omakei is admin',
        description: 'admin',
        created_at: '2022-08-20 11:11:11',
        updated_at: '2022-08-20 11:11:11',
        id:1,
      },
    }


    //Error response stracture
    {
      message: 'Invalid credentials',
      status: false,
      errors: [
        {
          message: 'Invalid credentials',
          field: 'Authentication',
          rule: 'Authentication',
        },
      ],
    }
```

### Show Role

You can use this endpoint to show role

```js
     const response2 = await axios
        .get('http://127.0.0.1:3333/api-gateway/roles/show/1')
        .header('Authorization', 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiTWljaGFlbCBPbWFrxfSwiaWF0IjoxNjYyMTE3MDEzLCJleHAiOjE2NjIxMjA2MTN9.zWDXeGqUK3DroLXt3wUuh_ISNw14b12M9nrzh_jDnbxA4MlQDln0Dv5k6rpyIz045X4cD8dVp9LqxudkdMwgFKdhI')

    //response stracture
    {
      message: 'fetched successful.',
      status: true,
      payload: {
        name: 'omakei is admin',
        description: 'admin',
        created_at: '2022-08-20 11:11:11',
        updated_at: '2022-08-20 11:11:11',
        id:1,
      },
    }


    //Error response stracture
    {
      message: 'Invalid credentials',
      status: false,
      errors: [
        {
          message: 'Invalid credentials',
          field: 'Authentication',
          rule: 'Authentication',
        },
      ],
    }
```

### Delete Role

You can use this endpoint to show role

```js
     const response2 = await axios
        .delete('http://127.0.0.1:3333/api-gateway/roles/delete/1')
        .header('Authorization', 'Bearer eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjp7InVzZXIiOnsiaWQiOjEsInVzZXJuYW1lIjoiTWljaGFlbCBPbWFrxfSwiaWF0IjoxNjYyMTE3MDEzLCJleHAiOjE2NjIxMjA2MTN9.zWDXeGqUK3DroLXt3wUuh_ISNw14b12M9nrzh_jDnbxA4MlQDln0Dv5k6rpyIz045X4cD8dVp9LqxudkdMwgFKdhI')

    //response stracture
    {
      message: 'deleted successful.',
      status: true,
      payload: {
        name: 'omakei is admin',
        description: 'admin',
        created_at: '2022-08-20 11:11:11',
        updated_at: '2022-08-20 11:11:11',
        id:1,
      },
    }


    //Error response stracture
    {
      message: 'Invalid credentials',
      status: false,
      errors: [
        {
          message: 'Invalid credentials',
          field: 'Authentication',
          rule: 'Authentication',
        },
      ],
    }
```

## Testing

```bash
    composer test
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](https://github.com/omakei/.github/blob/main/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [omakei](https://github.com/omakei)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
