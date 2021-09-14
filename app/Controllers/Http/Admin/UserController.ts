import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ResponseData from 'App/Helpers/ResponseData'
import UserInfoService from 'App/Services/UserInfoService'
import UserInfoValidator from 'App/Validators/UserInfoValidator'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export default class UserController {
  /**
   *
   * @param response
   */
  public async index({ response }: HttpContextContract) {
    try {
      const userInfos = await UserInfoService.getUserInfos()
      const userInfosSON = userInfos.map((userInfo) => userInfo.serialize())
      return response.ok(ResponseData.success(userInfosSON, 'List User For Admin'))
    } catch (e) {
      return response.badRequest(ResponseData.error(e.messages || e))
    }
  }

  /**
   *
   * @param params
   * @param response
   */
  public async view({ params, response }: HttpContextContract) {
    let isError = false
    if (params.id) {
      try {
        const userInfo = await UserInfoService.getUserInfo(params.id)

        const userInfoJSON = userInfo.serialize()
        return response.ok(ResponseData.success(userInfoJSON, 'Get User Success'))
      } catch (e) {
        isError = true
      }
    }

    if (isError) {
      response.notFound(ResponseData.error(`User has id=${params.id} is not existed`))
    }
  }

  /**
   *
   * @param request
   * @param response
   */
  public async add({ request, response }: HttpContextContract) {
    let errorMessage = ''
    try {
      await request.validate({
        schema: UserInfoValidator.UserInfoCreateSchema(),
        messages: UserInfoValidator.UserInfoMessage(),
      })

      const data = this.getData(request)

      const brand = await UserInfoService.store(data)

      response.ok(ResponseData.success(brand.id, 'Create User Success'))
    } catch (e) {
      errorMessage = e.messages || e
    }

    if (errorMessage) {
      return response.badRequest(ResponseData.error(errorMessage))
    }
  }

  /**
   *
   * @param params
   * @param request
   * @param response
   */
  public async update({ params, request, response }: HttpContextContract) {
    let errorMessage = ''
    try {
      const id = params.id
      await request.validate({
        schema: UserInfoValidator.UserInfoUpdateSchema(id),
        messages: UserInfoValidator.UserInfoMessage(),
      })

      const data = this.getData(request)

      await UserInfoService.update(id, data)

      response.ok(ResponseData.success(id, 'Update User Success'))
    } catch (e) {
      errorMessage = e.messages || e
    }

    if (errorMessage) {
      return response.badRequest(ResponseData.error(errorMessage))
    }
  }

  /**
   *
   * @param params
   * @param response
   */
  public async delete({ params, response }: HttpContextContract) {
    const id = params.id
    let errorMessage = ''

    try {
      await UserInfoService.delete(id)
      return response.ok(ResponseData.success(id, `User has id=${params.id} deleted`))
    } catch (e) {
      errorMessage = e.messages || e
    }

    if (errorMessage) {
      return response.badRequest(ResponseData.error(errorMessage))
    }
  }

  /**
   * Mapping data between request and object data
   * @param request
   * @returns data
   * @private
   */
  private getData(request: RequestContract) {
    const firstName = request.input('first_name')
    const lastName = request.input('last_name')
    const displayName = request.input('display_name')
    const gender = request.input('gender')
    const dob = request.input('dob')
    const address1 = request.input('address1')
    const address2 = request.input('address2')
    const city = request.input('city')
    const country = request.input('country')
    const email = request.input('email')
    const mobile = request.input('mobile')

    const imageId = request.input('image_id')

    return {
      firstName,
      lastName,
      displayName,
      gender,
      dob,
      address1,
      address2,
      city,
      country,
      email,
      mobile,
      imageId,
    }
  }
}
