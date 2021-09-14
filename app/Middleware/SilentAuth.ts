import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserToken from 'App/Models/UserToken'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SilentAuthMiddleware {
  /**
   * Handle request
   */
  public async handle({ request, auth }: HttpContextContract, next: () => Promise<void>) {
    /**
     * Check if user is logged-in or not. If yes, then `ctx.auth.user` will be
     * set to the instance of the currently logged in user.
     */
    if (await auth.check()) {
      const providerToken = auth.use('api').token
      const token = await UserToken.findBy('token', providerToken?.tokenHash)
      if (token) {
        token.merge({ ip: request.ip(), agent: request.header('User-Agent', '') })
        await token.save()
      }
    }
    await next()
  }
}
