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
| new UserException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class UserException extends Exception {}
