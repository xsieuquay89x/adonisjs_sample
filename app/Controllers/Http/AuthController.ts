import Faker from 'faker'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'
import AuthException from 'App/Exceptions/AuthException'
import User from 'App/Models/User'
import UserToken from 'App/Models/UserToken'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const username = request.input('username')
    const password = request.input('password')

    const token = await auth.use('api').attempt(username, password, { expiresIn: '30 days' })
    return response.ok({ success: true, data: token.toJSON() })
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').logout()
  }

  public async forgotPassword({ request, response }: HttpContextContract) {
    const username = request.input('username')

    const user = await User.findBy('username', username)
    if (!user) {
      throw AuthException.userNotFound(username)
    }
    user.merge({
      resetPasswordToken: await Hash.use('sha256').make(
        JSON.stringify({ date: new Date(), rand: Math.random() })
      ),
      resetPasswordRequired: false,
    })
    user.save()

    if (process.env.NODE_ENV === 'development') {
      return response.ok({
        success: true,
        data: user.serialize({ fields: ['reset_password_token'] }),
      })
    }

    return response.noContent()
  }

  public async resetPassword({ request, response }: HttpContextContract) {
    const username = request.input('username')
    const resetPasswordtoken = request.input('resetPasswordToken')

    const user = await User.query()
      .where('username', username)
      .andWhere('reset_password_token', resetPasswordtoken)
      .first()
    if (!user) {
      throw AuthException.resetTokenInvalid(username, resetPasswordtoken)
    }

    const newPassword = Faker.internet.password(8, false, /[a-zA-Z0-9]/)

    user.merge({
      password: newPassword,
      resetPasswordToken: '',
      resetPasswordRequired: true,
    })

    await Database.transaction(async (tx) => {
      user.useTransaction(tx)
      await user.save()
      // revoke all tokens
      await UserToken.query().useTransaction(tx).where('user_id', user.id).delete()
    })

    return response.ok({ success: true, data: { password: newPassword } })
  }

  public async changePassword({ request, response, auth }: HttpContextContract) {
    const { currentPassword, newPassword, newPasswordAgain } = request.only([
      'currentPassword',
      'newPassword',
      'newPasswordAgain',
    ])
    const user = auth.user
    if (!user) {
      throw AuthException.unauthorized()
    }
    if (!(await auth.user?.verifyPassword(currentPassword))) {
      throw AuthException.passwordNotMatch(currentPassword)
    }
    if (!(newPassword !== newPasswordAgain)) {
      throw AuthException.passwordAgainNotMatch(currentPassword)
    }
    user.merge({ password: newPassword })
    await Database.transaction(async (tx) => {
      user.useTransaction(tx)
      await user.save()
      // revoke all tokens
      await UserToken.query().useTransaction(tx).where('user_id', user.id).delete()
    })

    return response.noContent()
  }
}
