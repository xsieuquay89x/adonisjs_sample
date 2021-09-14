import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ResponseData from 'App/Helpers/ResponseData'
import BrandService from 'App/Services/BrandService'
import BrandValidator from 'App/Validators/BrandValidator'

export default class BrandController {
  /**
   *
   * @param response
   */
  public async index({ response }: HttpContextContract) {
    try {
      const brands = await BrandService.getBrands()
      const brandsSON = brands.map((brand) => brand.serialize())
      return response.ok(ResponseData.success(brandsSON, 'List Brand For Admin'))
    } catch (e) {
      return response.badRequest(ResponseData.error(e.messages))
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
        const brand = await BrandService.getBrand(params.id)

        if (brand) {
          const brandJSON = brand.serialize()
          return response.ok(ResponseData.success(brandJSON, 'Get Brand Success'))
        }
      } catch (e) {
        isError = true
      }
    }

    if (isError) {
      response.notFound(ResponseData.error(`Brand has id=${params.id} is not existed`))
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
        schema: BrandValidator.BrandSchema(),
        messages: BrandValidator.BrandMessage(),
      })

      const name = request.input('name')
      const imageId = request.input('image_id')
      const data = { name: name, imageId: imageId }

      const brand = await BrandService.store(data)

      response.ok(ResponseData.success(brand.id, 'Create Brand Success'))
    } catch (e) {
      errorMessage = e.messages
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
      await request.validate({
        schema: BrandValidator.BrandSchema(),
        messages: BrandValidator.BrandMessage(),
      })
      const id = params.id

      const name = request.input('name')
      const imageId = request.input('image_id')
      const data = { name: name, imageId: imageId }

      await BrandService.update(id, data)

      response.ok(ResponseData.success(id, 'Update Brand Success'))
    } catch (e) {
      errorMessage = e.messages
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
      await BrandService.delete(id)
      return response.ok(ResponseData.success(id, `Brand has id=${params.id} deleted`))
    } catch (e) {
      errorMessage = e.messages
    }

    if (errorMessage) {
      return response.badRequest(ResponseData.error(errorMessage))
    }
  }
}
