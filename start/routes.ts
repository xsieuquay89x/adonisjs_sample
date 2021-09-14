/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.group(() => {
    Route.post('/login', 'AuthController.login').as('login')
    Route.post('/forgot-password', 'AuthController.forgotPassword').as('forgotPassword')
    Route.post('/reset-password', 'AuthController.resetPassword').as('resetPassword')
  })
    .prefix('auth')
    .as('auth')

  Route.group(() => {
    Route.post('/logout', 'AuthController.logout').as('logout')
    Route.post('/change-password', 'AuthController.changePassword').as('changePassword')
  })
    .prefix('auth')
    .as('auth')
    .middleware('auth')

  Route.group(() => {
    Route.get('/me', 'UserController.view').as('view')
    Route.put('/me', 'UserController.update').as('update')
  })
    .prefix('me')
    .as('me')

  // FOR ADMIN PAGE
  Route.group(() => {
    Route.group(() => {
      Route.get('/', 'Admin/BrandController.index').as('index')
      Route.post('/', 'Admin/BrandController.add').as('add')
      Route.get('/:id', 'Admin/BrandController.view').as('view')
      Route.put('/:id', 'Admin/BrandController.update').as('update')
      Route.delete('/:id', 'Admin/BrandController.delete').as('delete')
    })
      .prefix('brands')
      .as('brand')

    Route.group(() => {
      Route.get('/', 'Admin/ModelController.index').as('index')
      Route.post('/', 'Admin/ModelController.add').as('add')
      Route.get('/:id', 'Admin/ModelController.view').as('view')
      Route.put('/:id', 'Admin/ModelController.update').as('update')
      Route.delete('/:id', 'Admin/ModelController.delete').as('delete')
    })
      .prefix('models')
      .as('model')

    Route.group(() => {
      Route.get('/', 'Admin/UserController.index').as('index')
      Route.post('/', 'Admin/UserController.add').as('add')
      Route.get('/:id', 'Admin/UserController.view').as('view')
      Route.put('/:id', 'Admin/UserController.update').as('update')
      Route.delete('/:id', 'Admin/UserController.delete').as('delete')
    })
      .prefix('users')
      .as('user')

    Route.group(() => {
      Route.get('/', 'Admin/VehicleController.index').as('index')
      Route.post('/', 'Admin/VehicleController.add').as('add')
      Route.get('/:id', 'Admin/VehicleController.view').as('view')
      Route.put('/:id', 'Admin/VehicleController.update').as('update')
      Route.delete('/:id', 'Admin/VehicleController.delete').as('delete')
    })
      .prefix('vehicles')
      .as('vehicle')

    Route.group(() => {
      Route.get('/', 'Admin/ReservationController.index').as('index')
      Route.get('/:id', 'Admin/ReservationController.view').as('view')
    })
      .prefix('reservations')
      .as('reservation')
  })
    .prefix('admin')
    .as('admin')
  // .middleware('auth')

  Route.post('/upload', 'UploadController.upload').as('upload')
  Route.post('/uploads', 'UploadController.multipleUpload').as('multipleUpload')

  Route.group(() => {
    Route.post('/book', 'ReservationController.create').as('create')
    Route.post('/arranging/:id', 'ReservationController.arranging').as('arranging')
    Route.post('/start/:id', 'ReservationController.starting').as('starting')
    Route.post('/finish/:id', 'ReservationController.finish').as('finish')
    Route.post('/cancel/:id', 'ReservationController.cancel').as('cancel')
  })
    .prefix('reservations')
    .as('reservation')
  //Reservation
}).prefix('/v1')
