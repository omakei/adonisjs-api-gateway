import Route from '@ioc:Adonis/Core/Route'

Route.post('/login', 'AuthController.login')

Route.post('/refresh', 'AuthController.refresh').middleware('check_jwt')

Route.post('/logout', 'AuthController.logout').middleware('check_jwt')

Route.get('/me', 'AuthController.me').middleware('check_jwt')
