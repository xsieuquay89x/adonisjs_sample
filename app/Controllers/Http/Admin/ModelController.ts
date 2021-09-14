import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ResponseData from 'App/Helpers/ResponseData'
import ModelService from 'App/Services/ModelService'
import ModelValidator from 'App/Validators/ModelValidator'

export default class ModelController {
  public async index({ response }: HttpContextContract) {
    try {
      const models = await ModelService.getModels()
      const modelsSON = models.map((model) => model.serialize())
      return response.ok(ResponseData.success(modelsSON, 'List Model For Admin'))
    } catch (e) {
      return response.badRequest(ResponseData.error(e))
    }
  }

  public async view({ params, response }: HttpContextContract) {
    let errorMessage = ''
    if (params.id) {
      const model = await ModelService.getModel(params.id)

      if (model) {
        const modelJSON = model.serialize()
        return response.ok(ResponseData.success(modelJSON, 'Get Model Success'))
      } else {
        errorMessage = `Model has id=${params.id} is not existed`
      }
    } else {
      errorMessage = 'ID not null'
    }

    if (errorMessage !== '') {
      response.badRequest(ResponseData.error(errorMessage))
    }
  }

  public async add({ request, response }: HttpContextContract) {
    try {
      await request.validate({
        schema: ModelValidator.ModelSchema(),
        messages: ModelValidator.ModelMessage(),
      })

      const name = request.input('name')
      const imageId = request.input('image_id')
      const brandId = request.input('brand_id')
      const year = request.input('year')
      const data = { name: name, imageId: imageId, brandId: brandId, year: year }

      const model = await ModelService.store(data)

      response.ok(ResponseData.success(model.id, 'Create Model Success'))
    } catch (e) {
      return response.badRequest(ResponseData.error(e.messages || e))
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      await request.validate({
        schema: ModelValidator.ModelSchema(),
        messages: ModelValidator.ModelMessage(),
      })
      const id = params.id

      const name = request.input('name')
      const imageId = request.input('image_id')
      const brandId = request.input('brand_id')
      const year = request.input('year')
      const data = { name: name, imageId: imageId, brandId: brandId, year: year }

      const model = await ModelService.update(id, data)

      response.ok(ResponseData.success(model.id, 'Update Model Success'))
    } catch (e) {
      return response.badRequest(ResponseData.error(e.messages || e))
    }
  }

  public async delete({ params, response }: HttpContextContract) {
    const id = params.id

    try {
      await ModelService.delete(id)
      return response.ok(ResponseData.success(id, `Model has id=${params.id} deleted`))
    } catch (e) {
      return response.badRequest(ResponseData.error(e.messages || e))
    }
  }
}
