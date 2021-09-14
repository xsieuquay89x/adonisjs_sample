import { Exception } from '@poppinss/utils'
import ErrorCode from './ErrorCode'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new AuthException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/

export default class AuthException extends Exception {
  static unauthorized() {
    return new this(`Unauthorized`, 401, '401')
  }

  static userNotFound(username: string) {
    return new this(`The user '${username}' cannot be found`, 404, ErrorCode.USER_NOT_FOUND)
  }

  static resetTokenInvalid(username: string, token: string) {
    return new this('Reset token is no longer valid', 500, ErrorCode.RESET_TOKEN_INVALID)
  }

  static passwordNotMatch(password: string) {
    return new this(`The entered password does not match.`, 500, ErrorCode.PASSWORD_NOT_MATCH)
  }

  static passwordAgainNotMatch(password: string) {
    return new this(`The entered password does not match.`, 500, ErrorCode.PASSWORD_NOT_MATCH)
  }
}
