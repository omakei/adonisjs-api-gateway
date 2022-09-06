import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'UsersController.register')
  Route.get('/change-user-status/:id', 'UsersController.changeUserStatus')
  Route.put('/update/:id', 'UsersController.update')
  Route.delete('/delete/:id', 'UsersController.delete')
  Route.get('/index', 'UsersController.index')
})
  .prefix('api-gateway/users')
  .middleware('auth:jwt')

Route.group(() => {
  Route.post('/store', 'RolesController.store')
  Route.get('/permissions', 'RolesController.permissions')
  Route.put('/update/:id', 'RolesController.update')
  Route.get('/show/:id', 'RolesController.show')
  Route.delete('/delete/:id', 'RolesController.delete')
  Route.get('/index', 'RolesController.index')
})
  .prefix('api-gateway/roles')
  .middleware('auth:jwt')
