/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error, ctx) {
    error.status = error.status || 500
    // if (typeof error.handle === 'function') {
    //   return error.handle(error, ctx);
    // }
    ctx.response.status(error.status).send({
      success: false,
      errors: (Array.isArray(error) ? error : [error]).map((e) => ({
        message: e.message,
        ...(process.env.NODE_ENV === 'development' ? { detail: e.stack } : {}),
        code: e.code,
      })),
    })
  }
}
